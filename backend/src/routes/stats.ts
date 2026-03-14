import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/stats — dashboard overview stats
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [plansResult, scriptsResult, captionsResult] = await Promise.all([
      supabaseAdmin
        .from('weekly_plans')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseAdmin
        .from('reel_scripts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseAdmin
        .from('captions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

    const plansCount = plansResult.count || 0;
    const scriptsCount = scriptsResult.count || 0;
    const captionsCount = captionsResult.count || 0;

    // Simple authority score (same formula as authority-score route)
    const planScore = Math.min(plansCount * 3, 30);
    const scriptScore = Math.min(scriptsCount * 3, 30);
    const captionScore = Math.min(captionsCount * 2, 20);
    let consistencyBonus = 0;
    if (plansCount > 0 && scriptsCount > 0 && captionsCount > 0) consistencyBonus = 10;
    if (plansCount >= 3 && scriptsCount >= 3 && captionsCount >= 3) consistencyBonus = 20;
    const authorityScore = Math.min(planScore + scriptScore + captionScore + consistencyBonus, 100);

    res.json({
      weeklyPlansCount: plansCount,
      reelScriptsCount: scriptsCount,
      captionsCount: captionsCount,
      authorityScore,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;

