import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface PasswordGateProps {
  children: React.ReactNode;
}

const SECRET_PASSWORD = "us against the world";
const STORAGE_KEY = "site_unlocked";

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already unlocked
    const unlocked = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsUnlocked(unlocked);
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.toLowerCase().trim() === SECRET_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-soft-pink to-pastel-lavender flex items-center justify-center">
        <div className="animate-pulse">
          <Heart className="w-12 h-12 text-blush-rose" />
        </div>
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-soft-pink via-cream-white to-pastel-lavender flex items-center justify-center p-4">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.6
            }}
          >
            {i % 2 === 0 ? '🌷' : '✨'}
          </div>
        ))}
      </div>

      {/* Password Dialog */}
      <div 
        className="relative w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in"
        style={{
          boxShadow: '0 20px 60px rgba(243, 184, 211, 0.5), 0 0 40px rgba(231, 213, 246, 0.3)'
        }}
      >
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-blush-rose via-pastel-lavender to-soft-pink" />
        
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blush-rose/20 to-pastel-lavender/30 flex items-center justify-center">
              <span className="text-4xl">🔐</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl text-dark-berry text-center mb-2">
            Welcome, dear one
          </h1>
          <p className="text-sm text-dark-berry/60 text-center mb-6">
            This place is for someone special...<br />
            What's our secret? 💕
          </p>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onKeyDown={handleKeyPress}
                placeholder="enter our secret..."
                className={`w-full px-5 py-3.5 rounded-full text-center text-dark-berry placeholder:text-dark-berry/40 outline-none transition-all ${
                  error 
                    ? 'bg-red-50 border-2 border-red-300 focus:ring-red-300' 
                    : 'bg-pastel-lavender/30 border-2 border-transparent focus:border-blush-rose/50 focus:ring-2 focus:ring-blush-rose/30'
                }`}
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 text-center mt-2 animate-fade-in">
                  That's not it... try again 💕
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-blush-rose to-pastel-lavender text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              Enter 🌷
            </button>
          </form>

          {/* Hint */}
          <p className="text-[10px] text-dark-berry/40 text-center mt-6 italic">
            hint: it's what we are... together 💜
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
