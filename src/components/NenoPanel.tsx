import { useState, useEffect, useRef } from 'react';
import { X, CalendarIcon, Plus, Send, LogIn, LogOut, Trash2, Pencil, Check, XCircle } from 'lucide-react';
import { format, differenceInDays, addDays, isSameDay, startOfDay } from 'date-fns';
import { NENO_MESSAGES, NENO_START_DATE } from '@/data/nenoMessages';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface NenoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NenoNote {
  id: string;
  day_number: number;
  text: string;
  author_email: string;
  created_at: string;
}

interface CustomMessage {
  day_number: number;
  message: string;
}

const NenoPanel = ({ isOpen, onClose }: NenoPanelProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notes, setNotes] = useState<NenoNote[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [customMessages, setCustomMessages] = useState<CustomMessage[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  const today = startOfDay(new Date());
  const daysSinceStart = differenceInDays(today, startOfDay(NENO_START_DATE));
  const currentDayNumber = Math.min(Math.max(daysSinceStart + 1, 1), 100);
  
  // Fetch notes and custom messages from database
  useEffect(() => {
    const fetchData = async () => {
      const [notesRes, messagesRes] = await Promise.all([
        supabase.from('neno_notes').select('*').order('day_number', { ascending: true }),
        supabase.from('neno_daily_messages').select('day_number, message')
      ]);
      
      if (notesRes.error) {
        console.error('Error fetching notes:', notesRes.error);
      } else {
        setNotes(notesRes.data || []);
      }
      
      if (messagesRes.error) {
        console.error('Error fetching custom messages:', messagesRes.error);
      } else {
        setCustomMessages(messagesRes.data || []);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);
  
  // Get message for a day (custom or default)
  const getMessageText = (dayNumber: number): string => {
    const custom = customMessages.find(m => m.day_number === dayNumber);
    return custom ? custom.message : NENO_MESSAGES[dayNumber - 1] || '';
  };
  
  // Get available messages (only up to current day)
  const availableMessages = Array.from({ length: currentDayNumber }, (_, i) => i + 1);
  
  // Calculate which message to show when a date is selected
  const getMessageForDate = (date: Date) => {
    const dayNumber = differenceInDays(startOfDay(date), startOfDay(NENO_START_DATE)) + 1;
    if (dayNumber >= 1 && dayNumber <= currentDayNumber) {
      return { dayNumber, message: getMessageText(dayNumber) };
    }
    return null;
  };
  
  // Get the date for a specific day number
  const getDateForDay = (dayNumber: number) => {
    return addDays(NENO_START_DATE, dayNumber - 1);
  };
  
  // Check if a date has a message available
  const isDateAvailable = (date: Date) => {
    const dayNumber = differenceInDays(startOfDay(date), startOfDay(NENO_START_DATE)) + 1;
    return dayNumber >= 1 && dayNumber <= currentDayNumber;
  };

  // Get notes for a specific day
  const getNotesForDay = (dayNumber: number) => {
    return notes.filter(note => note.day_number === dayNumber);
  };
  
  // Scroll to selected date's message
  useEffect(() => {
    if (selectedDate && messagesContainerRef.current) {
      const messageData = getMessageForDate(selectedDate);
      if (messageData) {
        const element = document.getElementById(`neno-day-${messageData.dayNumber}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [selectedDate]);
  
  // Scroll to latest message on open
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 150);
    }
  }, [isOpen, customMessages, notes]);

  const handleAddNote = async () => {
    if (!newNoteText.trim() || !user?.email) return;
    
    setSubmitting(true);
    const { data, error } = await supabase
      .from('neno_notes')
      .insert({
        day_number: currentDayNumber,
        text: newNoteText.trim(),
        author_email: user.email
      })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add note');
      console.error(error);
    } else {
      setNotes(prev => [...prev, data]);
      setNewNoteText('');
      setShowAddNote(false);
      toast.success('Note added! 🌷');
    }
    setSubmitting(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from('neno_notes')
      .delete()
      .eq('id', noteId);
    
    if (error) {
      toast.error('Failed to delete note');
    } else {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success('Note deleted');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
  };

  const handleStartEdit = (dayNumber: number) => {
    setEditingDay(dayNumber);
    setEditText(getMessageText(dayNumber));
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setEditText('');
  };

  const handleSaveEdit = async (dayNumber: number) => {
    if (!editText.trim() || !user?.email) return;
    
    setSavingEdit(true);
    
    const existingCustom = customMessages.find(m => m.day_number === dayNumber);
    
    if (existingCustom) {
      // Update existing
      const { error } = await supabase
        .from('neno_daily_messages')
        .update({ message: editText.trim(), updated_at: new Date().toISOString() })
        .eq('day_number', dayNumber);
      
      if (error) {
        toast.error('Failed to save');
        console.error(error);
      } else {
        setCustomMessages(prev => 
          prev.map(m => m.day_number === dayNumber ? { ...m, message: editText.trim() } : m)
        );
        toast.success('Message updated! 🌷');
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('neno_daily_messages')
        .insert({
          day_number: dayNumber,
          message: editText.trim(),
          updated_by: user.email
        });
      
      if (error) {
        toast.error('Failed to save');
        console.error(error);
      } else {
        setCustomMessages(prev => [...prev, { day_number: dayNumber, message: editText.trim() }]);
        toast.success('Message updated! 🌷');
      }
    }
    
    setSavingEdit(false);
    setEditingDay(null);
    setEditText('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="relative w-[95%] sm:w-[400px] max-h-[85vh] bg-gradient-to-b from-soft-pink to-cream-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden"
        style={{
          boxShadow: '0 -10px 60px rgba(243, 184, 211, 0.5), 0 0 40px rgba(231, 213, 246, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blush-rose/20">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg text-dark-berry">~Ur neno 🌼🌷</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Auth buttons */}
            {user ? (
              <button 
                onClick={handleSignOut}
                className="p-1.5 rounded-full hover:bg-blush-rose/20 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-dark-berry" />
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="p-1.5 rounded-full hover:bg-blush-rose/20 transition-colors"
                title="Sign in"
              >
                <LogIn className="w-4 h-4 text-dark-berry" />
              </button>
            )}
            
            {/* Add note button (only for admin) */}
            {isAdmin && (
              <button 
                onClick={() => setShowAddNote(!showAddNote)}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  showAddNote ? "bg-blush-rose text-white" : "hover:bg-blush-rose/20"
                )}
                title="Add note"
              >
                <Plus className="w-5 h-5 text-dark-berry" />
              </button>
            )}
            
            {/* Calendar Button */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button 
                  className="p-1.5 rounded-full hover:bg-blush-rose/20 transition-colors"
                  aria-label="Open calendar"
                >
                  <CalendarIcon className="w-5 h-5 text-dark-berry" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-md" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date && isDateAvailable(date)) {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  disabled={(date) => !isDateAvailable(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  fromDate={NENO_START_DATE}
                  toDate={addDays(NENO_START_DATE, currentDayNumber - 1)}
                />
              </PopoverContent>
            </Popover>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-blush-rose/20 transition-colors"
            >
              <X className="w-5 h-5 text-dark-berry" />
            </button>
          </div>
        </div>

        {/* Add Note Input (only shown when admin clicks +) */}
        {showAddNote && isAdmin && (
          <div className="p-3 border-b border-blush-rose/20 bg-pastel-lavender/20">
            <p className="text-[10px] text-dark-berry/60 mb-2">Add note for Day {currentDayNumber}</p>
            <div className="flex gap-2">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write your note..."
                className="flex-1 p-2 text-sm rounded-xl border border-blush-rose/30 bg-white/80 resize-none focus:outline-none focus:ring-2 focus:ring-blush-rose/50"
                rows={2}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNoteText.trim() || submitting}
                className="p-2 rounded-xl bg-blush-rose text-white hover:bg-blush-rose/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="h-[60vh] overflow-y-auto p-4 space-y-4"
        >
          {availableMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-dark-berry/50 text-sm italic">
                Your journey begins soon... 🌷
              </p>
            </div>
          ) : (
            availableMessages.map((dayNumber) => {
              const messageDate = getDateForDay(dayNumber);
              const isSelected = selectedDate && isSameDay(selectedDate, messageDate);
              const isToday = isSameDay(messageDate, today);
              const dayNotes = getNotesForDay(dayNumber);
              const messageText = getMessageText(dayNumber);
              const isEditing = editingDay === dayNumber;
              
              return (
                <div key={dayNumber} className="space-y-2">
                  {/* Daily Message */}
                  <div 
                    id={`neno-day-${dayNumber}`}
                    className={cn(
                      "relative p-4 rounded-2xl shadow-sm animate-fade-in border transition-all",
                      isSelected 
                        ? "bg-blush-rose/30 border-blush-rose ring-2 ring-blush-rose/50" 
                        : isToday 
                          ? "bg-pastel-lavender/40 border-pastel-lavender" 
                          : "bg-white/60 border-blush-rose/20"
                    )}
                  >
                    {/* Day badge + Edit button */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        isToday 
                          ? "bg-blush-rose text-white" 
                          : "bg-pastel-lavender/50 text-dark-berry/70"
                      )}>
                        Day {dayNumber} {isToday && "✨"}
                      </span>
                      {isAdmin && !isEditing && (
                        <button
                          onClick={() => handleStartEdit(dayNumber)}
                          className="p-1 rounded-full hover:bg-blush-rose/20 transition-colors"
                          title="Edit message"
                        >
                          <Pencil className="w-3.5 h-3.5 text-dark-berry/60" />
                        </button>
                      )}
                    </div>
                    
                    {/* Message content or edit textarea */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 text-sm rounded-xl border border-blush-rose/30 bg-white/80 resize-none focus:outline-none focus:ring-2 focus:ring-blush-rose/50 text-dark-berry"
                          rows={4}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleCancelEdit}
                            disabled={savingEdit}
                            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <XCircle className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleSaveEdit(dayNumber)}
                            disabled={savingEdit || !editText.trim()}
                            className="p-1.5 rounded-full bg-blush-rose text-white hover:bg-blush-rose/80 disabled:opacity-50 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-dark-berry text-sm leading-relaxed whitespace-pre-wrap">
                        {messageText}
                      </p>
                    )}
                    
                    {/* Date at bottom */}
                    <div className="mt-3 text-right">
                      <span className="text-[10px] text-dark-berry/40 italic">
                        {format(messageDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* User Notes for this day */}
                  {dayNotes.map((note) => (
                    <div 
                      key={note.id}
                      className="relative p-4 rounded-2xl shadow-sm border bg-gradient-to-br from-pastel-lavender/60 to-soft-pink/40 border-pastel-lavender/50 ml-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-dark-berry/10 text-dark-berry/70">
                          📝 Note
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        )}
                      </div>
                      <p className="text-dark-berry text-sm leading-relaxed whitespace-pre-wrap">
                        {note.text}
                      </p>
                      <div className="mt-2 text-right">
                        <span className="text-[10px] text-dark-berry/40 italic">
                          {format(new Date(note.created_at), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-3 border-t border-blush-rose/20 bg-white/30 text-center">
          <p className="text-[10px] text-dark-berry/50">
            {user ? `Signed in as ${user.email}` : 'New message unlocks every day 🌷'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NenoPanel;
