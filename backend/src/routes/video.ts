import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// POST /api/video/generate - Save video generation request
router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    const { description, video_url, status = 'pending', metadata = {} } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Save to database
    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert({
        user_id: req.userId!,
        description,
        video_url: video_url || null,
        status: status || 'pending',
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Save video error:', err);
    res.status(500).json({ error: 'Failed to save video' });
  }
});

// PUT /api/video/:id - Update video status/URL
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { video_url, status, metadata } = req.body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (video_url !== undefined) updateData.video_url = video_url;
    if (status !== undefined) updateData.status = status;
    if (metadata !== undefined) updateData.metadata = metadata;

    const { data, error } = await supabaseAdmin
      .from('videos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.userId!) // Ensure user owns this video
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Update video error:', err);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// GET /api/video - Get user's videos
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error('Get videos error:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET /api/video/:id - Get single video
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId!)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Get video error:', err);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// DELETE /api/video/:id - Delete video
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId!); // Ensure user owns this video

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete video error:', err);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;

