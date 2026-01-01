import { useState, useEffect } from "react";
import { X, Pencil, Check, XCircle, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface NewYearPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_LETTER = `New year? New start?
But my old love, Emaan'im — who still feels like a new blossom in the garden of mine I thought was long exhausted?
Why not? Why ever not.

Another year arrived, carrying its own promises and uncertainties, but my heart hasn't learned how to start over when it comes to you. It doesn't want to. With you, even what's old feels newly born. Even the parts of me that felt worn, tired, or weathered seem to soften and bloom again when your name crosses my mind. You arrived like spring after a long winter, silent but life-giving.

A poet once said:
When you like a flower, you pluck it. But when you love a flower, you water it daily.

And loving you has never been about possession or haste. It's been about patience. About choosing care over control. About showing up again and again, even on days when the world feels heavy. Loving you feels like tending something sacred, gently, consistently, without needing any applause.

Someone said:
And I once asked God for flowers…
and He gave me rain — in your shape.

You came into my life as something easy or sometimes hard, but you made me realize what effort feels like when you want to do it, not forced to do it. You came with depth, with storms, with growth. You came as something that made me learn how to stay, how to soften, how to grow roots instead of running. And somehow, everything that once felt like hardship, began to make sense through you.

The moment I see you, something in me stills. I find myself wanting to look at you from every angle, as if my eyes are afraid of missing even the smallest detail. I want to remember the curve of your smile, the way your expressions shift, the quiet movements you don't even notice yourself making. When my eyes rest on you, emotions rise like tides, deep, overwhelming, beautiful. It feels like being pulled gently into the depths of your soul.

I want to know everything about you, what makes you laugh without thinking, what makes you go quiet, what comforts you on mornings and what lingers in your thoughts at night. I want to understand how your heart moves through the day, in the softness of dawn, the chaos of noon, the stillness of evening. When you're not there, there's an emptiness that doesn't ask to be filled by anything else. You don't just occupy my time; you give it meaning.

There's something intoxicating about the way you exist. Your beauty never sits on the surface, it reaches inward, touching places I didn't know could feel this much. The way your hair frames your face, the depth in your eyes, the warmth in your presence, all of it feels like an unspoken language my soul somehow understands and I can never explain it in this human language. You move me. Again and again.

As 2026 Came, I don't wish for perfection, not for you, not for us, not for life. I wish for OUR BOND. For days that don't feel like battles. For nights that end with peace instead of worry. I wish for your heart to feel lighter, your mind to feel quieter, and your laughter to come easier. I wish for you moments where you feel deeply loved without questioning it, seen without explaining, held without asking.

May this new year be kinder to you than the last.
May it meet you with warmth instead of coldness.
May it bring you growth that doesn't hurt, love that doesn't confuse, and peace that doesn't leave.

And if the world feels uncertain again, if days feel long or distant, remember this, some things don't reset with the calendar. Some loves don't start over; they continue. Faithfully.

And my love?

How can one reset its love person named love. You are never replaceable. I'll make sure I get so into you that other humans feel not even half of you. And they never did.

Let's start our new year, TOGETHER
as another year of choosing you. 🌷`;

const NewYearPanel = ({ isOpen, onClose }: NewYearPanelProps) => {
  const [letterContent, setLetterContent] = useState(DEFAULT_LETTER);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch letter from database
  useEffect(() => {
    const fetchLetter = async () => {
      const { data, error } = await supabase
        .from('global_messages')
        .select('text')
        .eq('page_name', 'new_year_letter')
        .single();
      
      if (data && !error) {
        setLetterContent(data.text);
      }
    };

    if (isOpen) {
      fetchLetter();
    }
  }, [isOpen]);

  const handleStartEdit = () => {
    setEditText(letterContent);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText("");
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || !user?.id) return;
    
    setSaving(true);
    
    // Try to update or insert
    const { data: existing } = await supabase
      .from('global_messages')
      .select('id')
      .eq('page_name', 'new_year_letter')
      .single();

    let error;
    if (existing) {
      const result = await supabase
        .from('global_messages')
        .update({ text: editText.trim() })
        .eq('page_name', 'new_year_letter');
      error = result.error;
    } else {
      const result = await supabase
        .from('global_messages')
        .insert({
          page_name: 'new_year_letter',
          text: editText.trim(),
          sender_id: user.id
        });
      error = result.error;
    }

    if (error) {
      toast.error('Failed to save letter');
      console.error(error);
    } else {
      setLetterContent(editText.trim());
      toast.success('Letter updated! 🌷');
    }

    setSaving(false);
    setIsEditing(false);
    setEditText("");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 shadow-2xl border border-amber-200/50 animate-scale-in"
        style={{
          boxShadow: '0 0 60px rgba(255, 215, 0, 0.3), 0 0 100px rgba(255, 182, 193, 0.2)'
        }}
      >
        {/* Decorative header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-100/90 to-rose-100/90 backdrop-blur-sm px-6 py-4 border-b border-amber-200/30">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-amber-800 flex items-center gap-2">
              🎊 Happy New Year 2026 🌷
            </h2>
            <div className="flex items-center gap-2">
              {/* Auth buttons */}
              {user ? (
                <button 
                  onClick={handleSignOut}
                  className="p-1.5 rounded-full hover:bg-amber-200/50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 text-amber-700" />
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/auth')}
                  className="p-1.5 rounded-full hover:bg-amber-200/50 transition-colors"
                  title="Sign in"
                >
                  <LogIn className="w-4 h-4 text-amber-700" />
                </button>
              )}
              
              {/* Edit button for admin */}
              {isAdmin && !isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-full hover:bg-amber-200/50 transition-colors"
                  title="Edit letter"
                >
                  <Pencil className="w-4 h-4 text-amber-700" />
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-amber-200/50 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-amber-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Letter content */}
        <div className="p-6 md:p-8">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full h-[50vh] p-4 text-sm rounded-xl border border-amber-300/50 bg-white/80 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-amber-900 font-serif leading-relaxed"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex items-center gap-1 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editText.trim()}
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="font-serif text-amber-900/90 leading-relaxed whitespace-pre-wrap">
              {letterContent}
            </div>
          )}

          {/* Decorative elements */}
          {!isEditing && (
            <div className="flex justify-center gap-4 pt-6 text-3xl">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🌷</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💕</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎊</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>💕</span>
              <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🌷</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NewYearPanel;
