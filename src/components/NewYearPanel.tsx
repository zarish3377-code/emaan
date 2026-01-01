import { X } from "lucide-react";

interface NewYearPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewYearPanel = ({ isOpen, onClose }: NewYearPanelProps) => {
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
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-amber-200/50 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-amber-700" />
            </button>
          </div>
        </div>

        {/* Letter content */}
        <div className="p-6 md:p-8 space-y-6 font-serif text-amber-900/90 leading-relaxed">
          <p className="text-lg italic text-rose-700">
            New year? New start?<br />
            But my old love, Emaan'im — who still feels like a new blossom in the garden of mine I thought was long exhausted?<br />
            Why not? Why ever not.
          </p>

          <p>
            Another year arrived, carrying its own promises and uncertainties, but my heart hasn't learned how to start over when it comes to you. It doesn't want to. With you, even what's old feels newly born. Even the parts of me that felt worn, tired, or weathered seem to soften and bloom again when your name crosses my mind. You arrived like spring after a long winter, silent but life-giving.
          </p>

          <blockquote className="border-l-4 border-rose-300 pl-4 italic text-rose-700 my-6">
            A poet once said:<br />
            When you like a flower, you pluck it. But when you love a flower, you water it daily.
          </blockquote>

          <p>
            And loving you has never been about possession or haste. It's been about patience. About choosing care over control. About showing up again and again, even on days when the world feels heavy. Loving you feels like tending something sacred, gently, consistently, without needing any applause.
          </p>

          <blockquote className="border-l-4 border-amber-300 pl-4 italic text-amber-700 my-6">
            Someone said:<br />
            And I once asked God for flowers…<br />
            and He gave me rain — in your shape.
          </blockquote>

          <p>
            You came into my life as something easy or sometimes hard, but you made me realize what effort feels like when you want to do it, not forced to do it. You came with depth, with storms, with growth. You came as something that made me learn how to stay, how to soften, how to grow roots instead of running. And somehow, everything that once felt like hardship, began to make sense through you.
          </p>

          <p>
            The moment I see you, something in me stills. I find myself wanting to look at you from every angle, as if my eyes are afraid of missing even the smallest detail. I want to remember the curve of your smile, the way your expressions shift, the quiet movements you don't even notice yourself making. When my eyes rest on you, emotions rise like tides, deep, overwhelming, beautiful. It feels like being pulled gently into the depths of your soul.
          </p>

          <p>
            I want to know everything about you, what makes you laugh without thinking, what makes you go quiet, what comforts you on mornings and what lingers in your thoughts at night. I want to understand how your heart moves through the day, in the softness of dawn, the chaos of noon, the stillness of evening. When you're not there, there's an emptiness that doesn't ask to be filled by anything else. You don't just occupy my time; you give it meaning.
          </p>

          <p>
            There's something intoxicating about the way you exist. Your beauty never sits on the surface, it reaches inward, touching places I didn't know could feel this much. The way your hair frames your face, the depth in your eyes, the warmth in your presence, all of it feels like an unspoken language my soul somehow understands and I can never explain it in this human language. You move me. Again and again.
          </p>

          <div className="bg-gradient-to-r from-rose-100/50 to-amber-100/50 rounded-xl p-6 my-6 border border-rose-200/30">
            <p className="text-center">
              As 2026 Came, I don't wish for perfection, not for you, not for us, not for life. I wish for <strong className="text-rose-700">OUR BOND</strong>. For days that don't feel like battles. For nights that end with peace instead of worry. I wish for your heart to feel lighter, your mind to feel quieter, and your laughter to come easier. I wish for you moments where you feel deeply loved without questioning it, seen without explaining, held without asking.
            </p>
          </div>

          <p className="text-center italic text-rose-700">
            May this new year be kinder to you than the last.<br />
            May it meet you with warmth instead of coldness.<br />
            May it bring you growth that doesn't hurt, love that doesn't confuse, and peace that doesn't leave.
          </p>

          <p>
            And if the world feels uncertain again, if days feel long or distant, remember this, some things don't reset with the calendar. Some loves don't start over; they continue. <em>Faithfully.</em>
          </p>

          <div className="text-center my-8">
            <p className="text-lg text-amber-800">And my love?</p>
            <p className="mt-4">
              How can one reset its love person named love. You are never replaceable. I'll make sure I get so into you that other humans feel not even half of you. And they never did.
            </p>
          </div>

          <div className="text-center pt-6 border-t border-rose-200/50">
            <p className="text-xl font-medium text-rose-700">
              Let's start our new year, <strong>TOGETHER</strong>
            </p>
            <p className="mt-2 text-amber-700 italic">
              as another year of choosing you. 🌷
            </p>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center gap-4 pt-6 text-3xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🌷</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💕</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎊</span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>💕</span>
            <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🌷</span>
          </div>
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
