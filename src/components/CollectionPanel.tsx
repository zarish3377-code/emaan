import { useState, useRef } from 'react';
import { X, Play, Pause, Plus, Music, Loader2 } from 'lucide-react';

interface AudioItem {
  id: string;
  name: string;
  src: string;
}

interface CollectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECRET_CODE = "us against the world";

// Initial audio collection
const initialAudios: AudioItem[] = [
  {
    id: '1',
    name: 'Ohh she loves me',
    src: '/audio/collection/Ohh_she_loves_me.mp3'
  }
];

const CollectionPanel = ({ isOpen, onClose }: CollectionPanelProps) => {
  const [audios] = useState<AudioItem[]>(initialAudios);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('collection_unlocked') === 'true';
  });
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const handlePlay = (audioId: string) => {
    // Pause all other audios
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== audioId && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[audioId];
    if (audio) {
      if (currentPlaying === audioId) {
        audio.pause();
        setCurrentPlaying(null);
      } else {
        audio.play();
        setCurrentPlaying(audioId);
      }
    }
  };

  const handleAudioEnded = (audioId: string) => {
    if (currentPlaying === audioId) {
      setCurrentPlaying(null);
    }
  };

  const handleTryToAdd = () => {
    if (!isUnlocked) {
      setShowPasswordPrompt(true);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setShowAddForm(true);
    }
  };

  const verifyPassword = () => {
    if (passwordInput.toLowerCase().trim() === SECRET_CODE) {
      setIsUnlocked(true);
      localStorage.setItem('collection_unlocked', 'true');
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPasswordError(false);
      setShowAddForm(true);
    } else {
      setPasswordError(true);
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyPassword();
    } else if (e.key === "Escape") {
      setShowPasswordPrompt(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="relative w-[90%] sm:w-[400px] max-h-[80vh] bg-gradient-to-b from-violet-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in"
        style={{
          boxShadow: '0 10px 60px rgba(139, 92, 246, 0.4), 0 0 40px rgba(196, 181, 253, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-violet-200/30 bg-gradient-to-r from-violet-100/50 to-purple-100/50">
          <div>
            <h3 className="font-serif text-xl text-dark-berry flex items-center gap-2">
              <Music className="w-5 h-5 text-violet-500" />
              Our Collection
            </h3>
            <p className="text-xs text-dark-berry/50">Songs that remind me of us 💜</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-violet-200/50 transition-colors"
          >
            <X className="w-5 h-5 text-dark-berry" />
          </button>
        </div>

        {/* Audio List */}
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
          {audios.map((audio) => (
            <div 
              key={audio.id}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                currentPlaying === audio.id 
                  ? 'bg-gradient-to-r from-violet-200 to-purple-200 shadow-lg scale-[1.02]' 
                  : 'bg-white/70 hover:bg-violet-100/50'
              }`}
            >
              <button
                onClick={() => handlePlay(audio.id)}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPlaying === audio.id
                    ? 'bg-violet-500 text-white shadow-lg'
                    : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                }`}
              >
                {currentPlaying === audio.id ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark-berry truncate">{audio.name}</p>
                <p className="text-xs text-dark-berry/50">
                  {currentPlaying === audio.id ? '♪ Now Playing...' : 'Tap to play'}
                </p>
              </div>

              <audio
                ref={(el) => { audioRefs.current[audio.id] = el; }}
                src={audio.src}
                onEnded={() => handleAudioEnded(audio.id)}
                preload="metadata"
              />
            </div>
          ))}

          {audios.length === 0 && (
            <p className="text-center text-dark-berry/50 text-sm italic py-10">
              No songs yet... add our first one 💜
            </p>
          )}
        </div>

        {/* Add Button */}
        <div className="p-4 border-t border-violet-200/30 bg-white/30">
          <button
            onClick={handleTryToAdd}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 text-white font-medium hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            Add to Collection
          </button>
        </div>

        {/* Password Prompt Modal */}
        {showPasswordPrompt && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
            <div className="bg-white rounded-2xl p-6 mx-4 shadow-xl max-w-[280px] w-full">
              <h4 className="font-serif text-lg text-dark-berry text-center mb-2">🔐 Secret Code</h4>
              <p className="text-xs text-dark-berry/60 text-center mb-4">Enter the secret code to add songs</p>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={handlePasswordKeyPress}
                placeholder="enter secret code..."
                className={`w-full px-4 py-2.5 rounded-full text-sm text-dark-berry placeholder:text-dark-berry/40 outline-none transition-all ${
                  passwordError 
                    ? 'bg-red-100 border-2 border-red-300 focus:ring-red-300' 
                    : 'bg-violet-100/50 focus:ring-2 focus:ring-violet-400/50'
                }`}
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-red-500 text-center mt-2">Wrong code, try again 💜</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 px-4 py-2 rounded-full bg-gray-200 text-dark-berry text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyPassword}
                  className="flex-1 px-4 py-2 rounded-full bg-violet-500 text-white text-sm hover:bg-violet-600 transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Form Modal (placeholder for future functionality) */}
        {showAddForm && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
            <div className="bg-white rounded-2xl p-6 mx-4 shadow-xl max-w-[280px] w-full">
              <h4 className="font-serif text-lg text-dark-berry text-center mb-2">🎵 Add Song</h4>
              <p className="text-xs text-dark-berry/60 text-center mb-4">
                To add more songs, contact the developer 💜
              </p>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-full px-4 py-2 rounded-full bg-violet-500 text-white text-sm hover:bg-violet-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPanel;
