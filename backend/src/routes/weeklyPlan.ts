import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';
import { openai } from '../lib/openai';

const router = Router();

// GET /api/weekly-plan/latest — get the most recent weekly plan
router.get('/latest', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('weekly_plans')
      .select('*')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }
    res.json(data || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// POST /api/weekly-plan/generate — generate a new weekly plan
router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    // Get creator profile for context
    const { data: profile } = await supabaseAdmin
      .from('creator_profiles')
      .select('*')
      .eq('user_id', req.userId!)
      .single();

    const niche = profile?.niche || 'general creator';
    const goal = profile?.goal || 'followers';
    const style = profile?.posting_style || 'mixed';
    const audience = profile?.target_audience || {};

    const prompt = `You are an Instagram content strategist. Create a weekly content plan for an Instagram creator.

Creator details:
- Niche: ${niche}
- Main goal: ${goal}
- Posting style preference: ${style}
- Target audience: ${JSON.stringify(audience)}

Generate exactly 5 posts for this week. For each post, provide:
1. type: one of "Reel", "Carousel", "Static", or "Story"
2. hook: a compelling opening line (the first thing people read/hear)
3. body: the main content (2-4 bullet points or short paragraphs)
4. cta: a specific call-to-action (e.g., "Save this for later", "DM me 'START'", "Follow for more tips")
5. hashtags: array of 5-8 relevant hashtags including the # symbol

Respond ONLY with valid JSON — an array of 5 objects with keys: type, hook, body, cta, hashtags.
Do not wrap in markdown code blocks.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    let posts;
    try {
      posts = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response
      const match = content.match(/\[[\s\S]*\]/);
      posts = match ? JSON.parse(match[0]) : [];
    }

    // Calculate week start (Monday of current week)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const weekStart = monday.toISOString().split('T')[0];

    // Save to database
    const { data, error } = await supabaseAdmin
      .from('weekly_plans')
      .insert({
        user_id: req.userId!,
        week_start: weekStart,
        posts,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Generate weekly plan error:', err);
    res.status(500).json({ error: 'Failed to generate weekly plan' });
  }
});

export default router;

