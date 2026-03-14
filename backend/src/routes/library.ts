import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/library/plans
router.get('/plans', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('weekly_plans')
      .select('*')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// GET /api/library/scripts
router.get('/scripts', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reel_scripts')
      .select('*')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scripts' });
  }
});

// GET /api/library/captions
router.get('/captions', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('captions')
      .select('*')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch captions' });
  }
});

// DELETE /api/library/plans/:id
router.delete('/plans/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabaseAdmin
      .from('weekly_plans')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId!);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// DELETE /api/library/scripts/:id
router.delete('/scripts/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabaseAdmin
      .from('reel_scripts')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId!);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete script' });
  }
});

// DELETE /api/library/captions/:id
router.delete('/captions/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabaseAdmin
      .from('captions')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId!);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete caption' });
  }
});

export default router;

