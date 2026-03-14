import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';
import { openai } from '../lib/openai';

const router = Router();

// POST /api/reel-script/generate
router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    const { prompt: userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get creator profile for context
    const { data: profile } = await supabaseAdmin
      .from('creator_profiles')
      .select('*')
      .eq('user_id', req.userId!)
      .single();

    const niche = profile?.niche || 'general';

    const prompt = `You are a viral Reels script writer for Instagram. Create a Reel script for the following idea.

Creator niche: ${niche}
Reel idea: "${userPrompt}"

Provide the following in your response as valid JSON:
1. "script": The full spoken script with a strong hook (first 2 seconds), 1-2 key points, and a clear CTA. Keep it under 60 seconds when spoken.
2. "on_screen_text": 3-5 lines of text overlay that appear on screen (short, punchy, one per line).
3. "shot_guidance": Step-by-step shot directions (e.g., "Close-up of face: 2 seconds", "B-roll of product: 3 seconds"). Include timing for each shot.

Respond ONLY with valid JSON with keys: script, on_screen_text, shot_guidance.
Make each value a string (not an array). Use newlines within strings for multiple items.
Do not wrap in markdown code blocks.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { script: content, on_screen_text: '', shot_guidance: '' };
    }

    // Save to database
    const { data, error } = await supabaseAdmin
      .from('reel_scripts')
      .insert({
        user_id: req.userId!,
        topic: userPrompt,
        script: parsed.script || '',
        on_screen_text: parsed.on_screen_text || '',
        shot_guidance: parsed.shot_guidance || '',
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Generate reel script error:', err);
    res.status(500).json({ error: 'Failed to generate reel script' });
  }
});

export default router;

