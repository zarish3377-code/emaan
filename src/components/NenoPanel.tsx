import { useState, useEffect, useRef } from 'react';
import { X, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, differenceInDays, addDays, isSameDay, isAfter, startOfDay } from 'date-fns';
import { NENO_MESSAGES, NENO_START_DATE } from '@/data/nenoMessages';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NenoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NenoPanel = ({ isOpen, onClose }: NenoPanelProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const today = startOfDay(new Date());
  const daysSinceStart = differenceInDays(today, startOfDay(NENO_START_DATE));
  const currentDayNumber = Math.min(Math.max(daysSinceStart + 1, 1), 100);
  
  // Get available messages (only up to current day)
  const availableMessages = NENO_MESSAGES.slice(0, currentDayNumber);
  
  // Calculate which message to show when a date is selected
  const getMessageForDate = (date: Date) => {
    const dayNumber = differenceInDays(startOfDay(date), startOfDay(NENO_START_DATE)) + 1;
    if (dayNumber >= 1 && dayNumber <= currentDayNumber) {
      return { dayNumber, message: NENO_MESSAGES[dayNumber - 1] };
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
    if (isOpen && messagesContainerRef.current && !selectedDate) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [isOpen]);
  
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
            <span className="text-xs text-dark-berry/50 bg-pastel-lavender/30 px-2 py-0.5 rounded-full">
              Day {currentDayNumber}/100
            </span>
          </div>
          <div className="flex items-center gap-2">
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
            availableMessages.map((message, index) => {
              const dayNumber = index + 1;
              const messageDate = getDateForDay(dayNumber);
              const isSelected = selectedDate && isSameDay(selectedDate, messageDate);
              const isToday = isSameDay(messageDate, today);
              
              return (
                <div 
                  key={dayNumber}
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
                  {/* Day badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      isToday 
                        ? "bg-blush-rose text-white" 
                        : "bg-pastel-lavender/50 text-dark-berry/70"
                    )}>
                      Day {dayNumber} {isToday && "✨"}
                    </span>
                  </div>
                  
                  {/* Message content */}
                  <p className="text-dark-berry text-sm leading-relaxed whitespace-pre-wrap">
                    {message}
                  </p>
                  
                  {/* Date at bottom */}
                  <div className="mt-3 text-right">
                    <span className="text-[10px] text-dark-berry/40 italic">
                      {format(messageDate, "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-3 border-t border-blush-rose/20 bg-white/30 text-center">
          <p className="text-[10px] text-dark-berry/50">
            New message unlocks every day 🌷
          </p>
        </div>
      </div>
    </div>
  );
};

export default NenoPanel;
