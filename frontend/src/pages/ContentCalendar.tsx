import { useEffect, useState, useMemo } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Film,
  Video,
  MessageSquareText,
  FileText,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CalendarEntry {
  id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  content_type: 'reel_script' | 'video' | 'caption' | 'custom';
  content_id: string | null;
  content_preview: string;
  status: 'scheduled' | 'posted' | 'missed';
  notes: string;
  created_at: string;
}

const CONTENT_STYLES: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  reel_script: { icon: Film, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/25', label: 'Reel Script' },
  video: { icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', label: 'Video' },
  caption: { icon: MessageSquareText, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', label: 'Caption' },
  custom: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25', label: 'Post' },
};

const STATUS_STYLES: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  scheduled: { icon: Circle, color: 'text-blue-500', label: 'Scheduled' },
  posted: { icon: CheckCircle2, color: 'text-green-500', label: 'Posted' },
  missed: { icon: AlertCircle, color: 'text-red-500', label: 'Missed' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function ContentCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addDate, setAddDate] = useState('');

  // Quick-add form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newType, setNewType] = useState<'reel_script' | 'video' | 'caption' | 'custom'>('custom');
  const [newNotes, setNewNotes] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await apiGet<CalendarEntry[]>(`/api/calendar?month=${currentMonth + 1}&year=${currentYear}`);
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [currentMonth, currentYear]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDay(todayStr);
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, day: d, isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        isCurrentMonth: true,
      });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, day: d, isCurrentMonth: false });
    }

    return days;
  }, [currentMonth, currentYear]);

  const entriesByDate = useMemo(() => {
    const map: Record<string, CalendarEntry[]> = {};
    entries.forEach((e) => {
      if (!map[e.scheduled_date]) map[e.scheduled_date] = [];
      map[e.scheduled_date].push(e);
    });
    return map;
  }, [entries]);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const selectedEntries = selectedDay ? (entriesByDate[selectedDay] || []) : [];

  const handleAdd = async () => {
    if (!newTitle.trim()) { toast.error('Enter a title'); return; }
    setAdding(true);
    try {
      await apiPost('/api/calendar', {
        title: newTitle.trim(),
        scheduled_date: addDate,
        scheduled_time: newTime,
        content_type: newType,
        notes: newNotes.trim(),
      });
      toast.success('Added to calendar!');
      setShowAddModal(false);
      setNewTitle('');
      setNewTime('10:00');
      setNewType('custom');
      setNewNotes('');
      fetchEntries();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/api/calendar/${id}`);
      toast.success('Removed from calendar');
      fetchEntries();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleStatus = async (entry: CalendarEntry) => {
    const nextStatus = entry.status === 'scheduled' ? 'posted' : 'scheduled';
    try {
      await apiPut(`/api/calendar/${entry.id}`, { status: nextStatus });
      toast.success(nextStatus === 'posted' ? 'Marked as posted!' : 'Marked as scheduled');
      fetchEntries();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-brand-400" />
            My Calendar
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Schedule your reels, videos, and posts. Stay consistent and grow.
          </p>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Month navigation */}
      <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-lg font-bold text-white">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-white/[0.07]">
          {DAYS.map((d) => (
            <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {calendarDays.map((cell, i) => {
              const dayEntries = entriesByDate[cell.date] || [];
              const isToday = cell.date === todayStr;
              const isSelected = cell.date === selectedDay;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(cell.date)}
                  className={`relative min-h-[90px] p-1.5 border-b border-r border-white/[0.04] text-left transition-colors
                    ${!cell.isCurrentMonth ? 'bg-white/[0.01]' : 'bg-transparent hover:bg-white/[0.04]'}
                    ${isSelected ? 'ring-2 ring-inset ring-brand-500 bg-brand-500/5' : ''}
                  `}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold mb-0.5
                      ${isToday ? 'bg-brand-600 text-white' : ''}
                      ${!cell.isCurrentMonth ? 'text-slate-700' : isToday ? '' : 'text-slate-300'}
                    `}
                  >
                    {cell.day}
                  </span>

                  {/* Entry dots / previews */}
                  <div className="space-y-0.5">
                    {dayEntries.slice(0, 3).map((entry) => {
                      const style = CONTENT_STYLES[entry.content_type] || CONTENT_STYLES.custom;
                      return (
                        <div
                          key={entry.id}
                          className={`${style.bg} ${style.border} border rounded-md px-1.5 py-0.5 truncate`}
                        >
                          <span className={`text-[10px] font-medium ${style.color} truncate block`}>
                            {entry.title}
                          </span>
                        </div>
                      );
                    })}
                    {dayEntries.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-medium px-1">+{dayEntries.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected day detail + quick add */}
      {selectedDay && (
        <div className="bg-[#13131f] rounded-2xl border border-white/[0.07] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">
              {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <button
              onClick={() => { setAddDate(selectedDay); setShowAddModal(true); }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add post
            </button>
          </div>

          {selectedEntries.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-10 h-10 text-white/10 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Nothing scheduled for this day</p>
              <button
                onClick={() => { setAddDate(selectedDay); setShowAddModal(true); }}
                className="mt-3 text-sm text-brand-400 font-semibold hover:underline"
              >
                Schedule a post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEntries.map((entry) => {
                const style = CONTENT_STYLES[entry.content_type] || CONTENT_STYLES.custom;
                const statusStyle = STATUS_STYLES[entry.status] || STATUS_STYLES.scheduled;
                const Icon = style.icon;
                const StatusIcon = statusStyle.icon;

                return (
                  <div
                    key={entry.id}
                    className={`border ${style.border} rounded-xl p-4 ${style.bg}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4.5 h-4.5 ${style.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate">{entry.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {formatTime(entry.scheduled_time)}
                            </span>
                            <span className={`flex items-center gap-1 text-xs font-medium ${statusStyle.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusStyle.label}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.color} border ${style.border}`}>
                              {style.label}
                            </span>
                          </div>
                          {entry.content_preview && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{entry.content_preview}</p>
                          )}
                          {entry.notes && (
                            <p className="text-xs text-slate-600 mt-1 italic">Note: {entry.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleStatus(entry)}
                          className={`p-1.5 rounded-lg transition-colors ${entry.status === 'posted' ? 'text-green-400' : 'text-slate-600 hover:text-green-400'}`}
                          title={entry.status === 'posted' ? 'Mark as scheduled' : 'Mark as posted'}
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-1">
        {Object.entries(CONTENT_STYLES).map(([key, style]) => {
          const Icon = style.icon;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${style.bg} ${style.border} border`} />
              <Icon className={`w-3.5 h-3.5 ${style.color}`} />
              <span className="text-xs text-slate-500">{style.label}</span>
            </div>
          );
        })}
      </div>

      {/* Quick-add modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13131f] rounded-2xl shadow-2xl shadow-black/60 border border-white/10 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-pink-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Plus className="w-5 h-5" />
                <span className="font-bold text-sm">
                  Schedule for {new Date(addDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Post reel about morning routine"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as typeof newType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60"
                  >
                    <option value="reel_script">Reel Script</option>
                    <option value="video">Video</option>
                    <option value="caption">Caption</option>
                    <option value="custom">Custom Post</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Notes (optional)</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Any extra notes..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1c1c2e] text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none"
                />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-semibold hover:bg-white/5">Cancel</button>
              <button
                onClick={handleAdd}
                disabled={adding}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {adding ? 'Adding...' : 'Add to Calendar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
