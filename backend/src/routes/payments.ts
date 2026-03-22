import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
});

// Service-role Supabase client so webhook can bypass RLS
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_BASIC_PRICE_ID || '',
  plus:  process.env.STRIPE_PLUS_PRICE_ID  || '',
};

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── POST /api/payments/checkout ─────────────────────────────────────────────
// Creates a Stripe Checkout Session and returns the redirect URL.
router.post('/checkout', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const userEmail = (req as any).userEmail as string;
  const { plan } = req.body as { plan: 'basic' | 'plus' };

  if (!plan || !PRICE_IDS[plan]) {
    res.status(400).json({ error: `Plan "${plan}" is not available yet.` });
    return;
  }

  try {
    // Reuse existing Stripe customer if one exists
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = sub?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { user_id: userId },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url:  `${FRONTEND_URL}/#pricing`,
      metadata: { user_id: userId, plan },
      subscription_data: { metadata: { user_id: userId, plan } },
    });

    res.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// ─── GET /api/payments/subscription ──────────────────────────────────────────
// Returns the current subscription record for the logged-in user.
router.get('/subscription', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;

  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, status, current_period_end, stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json(data ?? { plan: 'free', status: 'inactive', current_period_end: null });
  } catch (err: unknown) {
    console.error('Subscription fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch subscription.' });
  }
});

// ─── POST /api/payments/portal ────────────────────────────────────────────────
// Creates a Stripe Billing Portal session so the user can manage / cancel.
router.post('/portal', async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;

  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (error || !data?.stripe_customer_id) {
      res.status(404).json({ error: 'No active subscription found.' });
      return;
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${FRONTEND_URL}/dashboard/settings`,
    });

    res.json({ url: portalSession.url });
  } catch (err: unknown) {
    console.error('Portal error:', err);
    res.status(500).json({ error: 'Failed to open billing portal.' });
  }
});

// ─── POST /api/payments/webhook (raw body — registered separately in index.ts) ─
export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: unknown) {
    console.error('Webhook signature error:', err);
    res.status(400).send('Webhook signature verification failed.');
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const userId     = session.metadata?.user_id;
        const plan       = session.metadata?.plan as 'basic' | 'plus';
        const customerId = session.customer as string;
        const subId      = session.subscription as string;

        if (!userId || !plan) {
          console.error('Webhook: missing user_id or plan in session metadata', session.metadata);
          break;
        }

        // Fetch subscription — current_period_end moved to items in API v2026+
        const stripeSub = await stripe.subscriptions.retrieve(subId, { expand: ['items.data'] });
        const rawEnd =
          (stripeSub.items?.data?.[0] as any)?.current_period_end ??
          (stripeSub as any).current_period_end;
        const periodEnd = rawEnd ? new Date(rawEnd * 1000).toISOString() : null;

        const { error: upsertError } = await supabaseAdmin.from('subscriptions').upsert({
          user_id:                userId,
          stripe_customer_id:     customerId,
          stripe_subscription_id: subId,
          plan,
          status:                 'active',
          current_period_end:     periodEnd,
          updated_at:             new Date().toISOString(),
        }, { onConflict: 'user_id' });

        if (upsertError) {
          console.error('Supabase upsert error (checkout.session.completed):', upsertError);
          throw upsertError;
        }
        console.log(`✅ Subscription activated for user ${userId} on plan ${plan}`);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        const plan = (sub.metadata?.plan as 'basic' | 'plus') || 'basic';
        const rawEnd =
          (sub.items?.data?.[0] as any)?.current_period_end ??
          (sub as any).current_period_end;
        const periodEnd = rawEnd ? new Date(rawEnd * 1000).toISOString() : null;

        // cancel_at_period_end = user cancelled but still has access until period ends
        const cancelAtPeriodEnd = (sub as any).cancel_at_period_end === true;
        const status =
          cancelAtPeriodEnd             ? 'cancelling' :
          sub.status === 'active'       ? 'active'     :
          sub.status === 'past_due'     ? 'past_due'   :
          sub.status === 'canceled'     ? 'cancelled'  : sub.status;

        const { error: updErr } = await supabaseAdmin.from('subscriptions').upsert({
          user_id:                userId,
          stripe_subscription_id: sub.id,
          plan,
          status,
          current_period_end:     periodEnd,
          updated_at:             new Date().toISOString(),
        }, { onConflict: 'user_id' });

        if (updErr) console.error('Supabase upsert error (subscription.updated):', updErr);
        else console.log(`🔄 Subscription updated for user ${userId}: status=${status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        const { error: delErr } = await supabaseAdmin.from('subscriptions').upsert({
          user_id:    userId,
          plan:       'free',
          status:     'cancelled',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        if (delErr) console.error('Supabase upsert error (subscription.deleted):', delErr);
        else console.log(`❌ Subscription deleted — user ${userId} moved to free plan`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;

        const stripeSub = await stripe.subscriptions.retrieve(subId);
        const userId = stripeSub.metadata?.user_id;
        if (!userId) break;

        await supabaseAdmin.from('subscriptions').upsert({
          user_id:    userId,
          status:     'past_due',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err: unknown) {
    console.error('Webhook handler error:', err);
    res.status(500).send('Webhook handler failed.');
  }
}

export default router;
