import { useState, useEffect } from "react";
import { X, Heart, Calendar, Clock, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CountdownPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FloatingHeart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const ADMIN_EMAIL = "jellyjello3377@gmail.com";

const CountdownPanel = ({ isOpen, onClose }: CountdownPanelProps) => {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [meetupTitle, setMeetupTitle] = useState("Our Next Meetup");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving] = useState(false);

  // Generate floating hearts
  useEffect(() => {
    if (isOpen) {
      const hearts: FloatingHeart[] = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        size: 12 + Math.random() * 20,
      }));
      setFloatingHearts(hearts);
    }
  }, [isOpen]);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === ADMIN_EMAIL);
    };
    checkAdmin();
  }, []);

  // Fetch countdown settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('countdown_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setTargetDate(new Date(data.next_meetup_date));
        setMeetupTitle(data.meetup_title);
      }
    };

    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  // Calculate time left
  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSave = async () => {
    if (!editDate) return;
    
    setSaving(true);
    try {
      // Check if settings exist
      const { data: existing } = await supabase
        .from('countdown_settings')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        // Update existing
        await supabase
          .from('countdown_settings')
          .update({
            next_meetup_date: new Date(editDate).toISOString(),
            meetup_title: editTitle || "Our Next Meetup",
            updated_by: ADMIN_EMAIL
          })
          .eq('id', existing.id);
      } else {
        // Insert new
        await supabase
          .from('countdown_settings')
          .insert({
            next_meetup_date: new Date(editDate).toISOString(),
            meetup_title: editTitle || "Our Next Meetup",
            updated_by: ADMIN_EMAIL
          });
      }

      setTargetDate(new Date(editDate));
      setMeetupTitle(editTitle || "Our Next Meetup");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving countdown:', error);
    }
    setSaving(false);
  };

  const openEditor = () => {
    setEditDate(targetDate ? targetDate.toISOString().slice(0, 16) : "");
    setEditTitle(meetupTitle);
    setIsEditing(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Floating Hearts Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingHearts.map((heart) => (
          <Heart
            key={heart.id}
            className="absolute text-pink-400/40 animate-float-up fill-current"
            style={{
              left: `${heart.left}%`,
              bottom: '-50px',
              width: heart.size,
              height: heart.size,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Panel */}
      <div className="relative z-10 mx-4 w-full max-w-md animate-scale-in rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Admin Settings Button */}
        {isAdmin && !isEditing && (
          <button
            onClick={openEditor}
            className="absolute left-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/50 hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg">
            <Heart className="h-8 w-8 text-white fill-current animate-pulse" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {isEditing ? "Set Our Date" : meetupTitle}
          </h2>
          {!isEditing && targetDate && (
            <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {targetDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
        </div>

        {isEditing ? (
          /* Editor Form */
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full rounded-xl border border-pink-200 bg-white/80 px-4 py-3 text-foreground focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Our Next Meetup"
                maxLength={50}
                className="w-full rounded-xl border border-pink-200 bg-white/80 px-4 py-3 text-foreground focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-xl border border-pink-200 bg-white py-3 font-medium text-foreground transition-colors hover:bg-pink-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editDate}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : targetDate ? (
          /* Countdown Display */
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((unit) => (
              <div
                key={unit.label}
                className="rounded-2xl bg-white/80 p-4 text-center shadow-md backdrop-blur-sm"
              >
                <div className="font-display text-3xl font-bold text-rose-500">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Date Set */
          <div className="py-8 text-center">
            <Clock className="mx-auto mb-4 h-12 w-12 text-pink-300" />
            <p className="text-muted-foreground">
              {isAdmin 
                ? "Click the settings icon to set our next meetup! 💕" 
                : "Our next meetup hasn't been set yet... 💕"}
            </p>
          </div>
        )}

        {/* Footer Message */}
        {!isEditing && targetDate && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Can't wait to see you again 💕
          </p>
        )}
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CountdownPanel;
