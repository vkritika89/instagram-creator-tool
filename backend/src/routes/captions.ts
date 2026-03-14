import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';
import { openai } from '../lib/openai';

const router = Router();

// POST /api/captions/generate
router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    const { topic, length = 'medium' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Get creator profile for context
    const { data: profile } = await supabaseAdmin
      .from('creator_profiles')
      .select('*')
      .eq('user_id', req.userId!)
      .single();

    const niche = profile?.niche || 'general';

    const lengthGuidance: Record<string, string> = {
      short: '1-2 sentences, punchy and direct',
      medium: '3-5 sentences with personality and a CTA',
      long: '6-10 sentences, story-telling style with a hook, body, and CTA',
    };

    const prompt = `You are a top Instagram caption writer. Generate captions and hashtags for the following.

Creator niche: ${niche}
Post topic: "${topic}"
Caption length: ${length} — ${lengthGuidance[length] || lengthGuidance.medium}

Provide EXACTLY this JSON structure:
{
  "variants": ["caption1", "caption2", "caption3"],
  "hashtags": ["#hashtag1", "#hashtag2", ... ] 
}

Rules:
- Generate exactly 3 caption variants with different tones/angles.
- Include emojis naturally in captions.
- Each caption should have its own CTA.
- Generate 20-30 niche-relevant hashtags, mix of popular and niche-specific.
- Each hashtag must start with #.

Respond ONLY with valid JSON. Do not wrap in markdown code blocks.`;

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
      parsed = match ? JSON.parse(match[0]) : { variants: [], hashtags: [] };
    }

    // Save to database
    const { data, error } = await supabaseAdmin
      .from('captions')
      .insert({
        user_id: req.userId!,
        topic,
        variants: parsed.variants || [],
        hashtags: parsed.hashtags || [],
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Generate captions error:', err);
    res.status(500).json({ error: 'Failed to generate captions' });
  }
});

export default router;

