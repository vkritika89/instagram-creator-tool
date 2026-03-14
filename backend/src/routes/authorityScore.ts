import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/authority-score
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Count all user's content
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

    // Simple authority score formula
    // Plans: up to 30 points (3 pts each, max 10)
    // Scripts: up to 30 points (3 pts each, max 10)
    // Captions: up to 20 points (2 pts each, max 10)
    // Consistency bonus: up to 20 points (if they have all 3 types)
    const planScore = Math.min(plansCount * 3, 30);
    const scriptScore = Math.min(scriptsCount * 3, 30);
    const captionScore = Math.min(captionsCount * 2, 20);

    let consistencyBonus = 0;
    if (plansCount > 0 && scriptsCount > 0 && captionsCount > 0) {
      consistencyBonus = 10;
    }
    if (plansCount >= 3 && scriptsCount >= 3 && captionsCount >= 3) {
      consistencyBonus = 20;
    }

    const score = Math.min(planScore + scriptScore + captionScore + consistencyBonus, 100);

    // Generate weaknesses
    const weaknesses: string[] = [];

    if (plansCount === 0) {
      weaknesses.push("You haven't generated any weekly plans yet. Start planning your content to build consistency.");
    } else if (plansCount < 3) {
      weaknesses.push('You have few weekly plans. Aim to generate a new plan every week for better consistency.');
    }

    if (scriptsCount === 0) {
      weaknesses.push("No Reel scripts created yet. Reels are the #1 growth driver on Instagram — start scripting!");
    } else if (scriptsCount < 3) {
      weaknesses.push('Your hooks may be repetitive. Generate more diverse Reel scripts to keep your audience engaged.');
    }

    if (captionsCount === 0) {
      weaknesses.push("You haven't created any captions. Strong captions with CTAs dramatically increase engagement.");
    } else if (captionsCount < 3) {
      weaknesses.push('You rarely use varied CTAs. Try mixing up your calls-to-action across different posts.');
    }

    if (plansCount > 0 && scriptsCount === 0 && captionsCount === 0) {
      weaknesses.push('You plan content but lack execution. Start creating scripts and captions to turn plans into posts.');
    }

    if (weaknesses.length === 0) {
      weaknesses.push("You're doing great! Keep up the consistency and consider experimenting with new content formats.");
    }

    res.json({
      score,
      weaknesses: weaknesses.slice(0, 3), // Max 3 weaknesses
    });
  } catch (err) {
    console.error('Authority score error:', err);
    res.status(500).json({ error: 'Failed to calculate authority score' });
  }
});

export default router;

