import { useState } from 'react';
import { apiPost } from '../lib/api';
import { CalendarPlus, X, Clock, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'reel_script' | 'video' | 'caption' | 'custom';
  contentId?: string;
  defaultTitle?: string;
  contentPreview?: string;
}

export default function AddToCalendarModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  defaultTitle = '',
  contentPreview = '',
}: AddToCalendarModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);
    try {
      await apiPost('/api/calendar', {
        title: title.trim(),
        scheduled_date: date,
        scheduled_time: time,
        content_type: contentType,
        content_id: contentId || null,
        content_preview: contentPreview.slice(0, 200),
        notes: notes.trim(),
      });
      toast.success('Added to calendar!');
      onClose();
      setTitle('');
      setDate('');
      setTime('10:00');
      setNotes('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add to calendar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const contentLabel = {
    reel_script: 'Reel Script',
    video: 'Video',
    caption: 'Caption',
    custom: 'Post',
  }[contentType];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#13131f] rounded-2xl shadow-2xl shadow-black/60 border border-white/10 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-pink-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <CalendarPlus className="w-5 h-5" />
            <span className="font-bold text-sm">Schedule {contentLabel}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Content preview */}
          {contentPreview && (
            <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{contentLabel} Preview</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{contentPreview}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Post reel about fitness tips"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-colors"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Time
                </span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra notes for this post..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CalendarPlus className="w-4 h-4" />
            )}
            {loading ? 'Scheduling...' : 'Add to Calendar'}
          </button>
        </div>
      </div>
    </div>
  );
}
