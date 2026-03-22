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
    const goal = profile?.goal || 'followers';
    const audience = profile?.target_audience || {};

    const prompt = `You are a top Indian Instagram creator who makes viral Reels. You think like a HUMAN storyteller, not an AI. You write scripts the way real people talk — raw, funny, emotional, relatable. Your scripts feel like someone is sharing a real life experience with their audience.

CREATOR CONTEXT:
- Niche: ${niche}
- Goal: ${goal}
- Target Audience: ${JSON.stringify(audience)}

REEL IDEA: "${userPrompt}"

Write a Reel script broken into 5 clear sections. Each section is a separate part the creator will speak on camera.

SECTION 1 — HOOK (spoken in first 2-3 seconds):
Write ONE punchy line that stops the scroll. Use curiosity, shock, humor, or a bold claim. It should make someone think "wait what?!" and keep watching. Examples of great hooks: "My wife asked me to cook dinner… biggest mistake of her life", "This is the reason your reels flop", "Nobody told me this about marriage..."

SECTION 2 — STORY (spoken in seconds 3-15):
Tell a SHORT relatable story or paint a scenario the audience connects with. Make it personal, specific, and vivid. Use "I" and "you" — like you're talking to a friend. Build tension or humor. The audience should think "haha that's so true" or "omg same".

SECTION 3 — TRANSFORMATION (spoken in seconds 15-40):
This is the meat. Share the insight, lesson, tip, or punchline. Use storytelling — don't just list tips. Make it feel like a realization moment. Include 1-2 specific, actionable takeaways. Use natural transitions like "But here's what actually happened...", "And then it hit me..."

SECTION 4 — RETENTION MOMENT (spoken in seconds 40-50):
Drop a twist, unexpected insight, or bonus revelation. This keeps viewers watching till the end. Use "But wait..." or "Here's the part nobody talks about..." — create FOMO so they don't swipe away.

SECTION 5 — CTA (spoken in last 5-10 seconds):
End with a clear call-to-action. Tell them exactly what to do: "Follow for more", "Save this for later", "Comment YES if you relate", "Share this with your partner". Make it feel natural, not salesy.

WRITING RULES:
- Write like a REAL person talking to camera, not an essay
- Use contractions (I'm, you're, don't, can't)
- Include natural pauses with "..." 
- Use humor, sarcasm, emotion where appropriate
- Make every line something a real creator would actually say out loud
- Vary sentence length — short punchy lines mixed with longer flowing ones
- If the topic is funny, BE FUNNY. If emotional, BE EMOTIONAL. Match the vibe.
- Total spoken length: 45-60 seconds

You MUST respond with a JSON object containing these exact keys:

{
  "hook": "The exact words the creator says in the first 2-3 seconds",
  "story": "The story/scenario section — multiple sentences, conversational",
  "transformation": "The main value section — the insight, lesson, or punchline with details",
  "retention": "The twist or bonus moment that keeps them watching",
  "cta": "The closing call-to-action — natural and engaging",
  "psychology_note": "1-2 sentences explaining what psychology makes this script work and why people will watch till the end",
  "on_screen_text": "3-5 short text overlays separated by newlines. These appear on screen at key moments to reinforce the message. Keep each line under 6 words. Use emojis sparingly.",
  "shot_guidance": "Shot-by-shot filming guide. Each line = one shot with timing. Format: 'Description — Xs'. Include camera angles, expressions, B-roll ideas. One shot per line, separated by newlines."
}`;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to backend/.env file.' 
      });
    }

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a top Indian Instagram Reels creator and scriptwriter. You write scripts that sound like a REAL human talking to camera — funny, raw, emotional, relatable. Never write like an AI. Think like a storyteller. Always respond with valid JSON containing the keys: hook, story, transformation, retention, cta, psychology_note, on_screen_text, shot_guidance.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.95,
        response_format: { type: 'json_object' },
      });
    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      let errorMessage = 'Failed to generate script';
      
      if (openaiError?.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key in backend/.env';
      } else if (openaiError?.status === 429) {
        errorMessage = 'OpenAI rate limit exceeded. Please try again in a moment.';
      } else if (openaiError?.message) {
        errorMessage = `OpenAI error: ${openaiError.message}`;
      }
      
      return res.status(500).json({ error: errorMessage });
    }

    const content = completion.choices[0]?.message?.content || '{}';
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      // Try to extract JSON from markdown code blocks or plain text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          parsed = { script: content, on_screen_text: '', shot_guidance: '' };
        }
      } else {
        // If no JSON found, use content as script
        parsed = { 
          script: content, 
          on_screen_text: 'Add text overlays at key moments', 
          shot_guidance: 'Plan shots based on script flow' 
        };
      }
    }

    const sections = {
      hook: parsed.hook || '',
      story: parsed.story || '',
      transformation: parsed.transformation || '',
      retention: parsed.retention || '',
      cta: parsed.cta || '',
      psychology_note: parsed.psychology_note || '',
    };

    const fullScript = [
      sections.hook,
      sections.story,
      sections.transformation,
      sections.retention,
      sections.cta,
    ].filter(Boolean).join('\n\n');

    // Save to database
    const { data, error } = await supabaseAdmin
      .from('reel_scripts')
      .insert({
        user_id: req.userId!,
        topic: userPrompt,
        script: fullScript || parsed.script || '',
        on_screen_text: parsed.on_screen_text || '',
        shot_guidance: parsed.shot_guidance || '',
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ ...data, sections });
  } catch (err: any) {
    console.error('Generate reel script error:', err);
    console.error('Error details:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
    });
    
    let errorMessage = 'Failed to generate reel script';
    if (err?.message) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err?.message : undefined,
    });
  }
});

export default router;

