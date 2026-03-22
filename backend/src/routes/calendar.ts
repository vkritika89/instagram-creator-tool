import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

const router = Router();

// GET /api/calendar?month=3&year=2026
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;

    let query = supabaseAdmin
      .from('content_calendar')
      .select('*')
      .eq('user_id', req.userId!)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true });

    if (month && year) {
      const m = Number(month);
      const y = Number(year);
      const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
      const lastDay = new Date(y, m, 0).getDate();
      const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`;
      query = query.gte('scheduled_date', startDate).lte('scheduled_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err: any) {
    console.error('Get calendar error:', err);
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// POST /api/calendar
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, scheduled_date, scheduled_time, content_type, content_id, content_preview, notes } = req.body;

    if (!title || !scheduled_date || !scheduled_time || !content_type) {
      return res.status(400).json({ error: 'Title, date, time, and content type are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('content_calendar')
      .insert({
        user_id: req.userId!,
        title,
        scheduled_date,
        scheduled_time,
        content_type,
        content_id: content_id || null,
        content_preview: content_preview || '',
        notes: notes || '',
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err: any) {
    console.error('Create calendar entry error:', err);
    res.status(500).json({ error: 'Failed to create calendar entry' });
  }
});

// PUT /api/calendar/:id
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, scheduled_date, scheduled_time, status, notes } = req.body;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (scheduled_date !== undefined) updates.scheduled_date = scheduled_date;
    if (scheduled_time !== undefined) updates.scheduled_time = scheduled_time;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabaseAdmin
      .from('content_calendar')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.userId!)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err: any) {
    console.error('Update calendar entry error:', err);
    res.status(500).json({ error: 'Failed to update calendar entry' });
  }
});

// DELETE /api/calendar/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('content_calendar')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId!);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete calendar entry error:', err);
    res.status(500).json({ error: 'Failed to delete calendar entry' });
  }
});

export default router;
