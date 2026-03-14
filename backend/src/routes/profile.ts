import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/profile — get creator profile
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('creator_profiles')
      .select('*')
      .eq('user_id', req.userId!)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }
    res.json(data || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// PUT /api/profile — update creator profile
router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const { niche, goal, posting_style, target_audience } = req.body;
    const { data, error } = await supabaseAdmin
      .from('creator_profiles')
      .update({
        niche,
        goal,
        posting_style,
        target_audience,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', req.userId!)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

