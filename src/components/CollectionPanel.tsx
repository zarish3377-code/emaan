import { useState, useRef } from 'react';
import { X, Play, Pause, Plus, Music, Image, Video, Loader2 } from 'lucide-react';

type MediaType = 'audio' | 'video' | 'image';

interface MediaItem {
  id: string;
  name: string;
  src: string;
  type: MediaType;
}

interface CollectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECRET_CODE = "us against the world";

// Initial media collection
const initialMedia: MediaItem[] = [
  {
    id: '1',
    name: 'Ohh she loves me',
    src: '/audio/collection/Ohh_she_loves_me.mp3',
    type: 'audio'
  }
];

const CollectionPanel = ({ isOpen, onClose }: CollectionPanelProps) => {
  const [media] = useState<MediaItem[]>(initialMedia);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<MediaType | 'all'>('all');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('collection_unlocked') === 'true';
  });
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedImage, setExpandedImage] = useState<MediaItem | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const filteredMedia = activeFilter === 'all' 
    ? media 
    : media.filter(item => item.type === activeFilter);

  const handlePlayAudio = (itemId: string) => {
    // Pause all other audios and videos
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== itemId && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause();
      }
    });

    const audio = audioRefs.current[itemId];
    if (audio) {
      if (currentPlaying === itemId) {
        audio.pause();
        setCurrentPlaying(null);
      } else {
        audio.play();
        setCurrentPlaying(itemId);
      }
    }
  };

  const handlePlayVideo = (itemId: string) => {
    // Pause all audios
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
      }
    });
    // Pause other videos
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (id !== itemId && video) {
        video.pause();
      }
    });

    const video = videoRefs.current[itemId];
    if (video) {
      if (currentPlaying === itemId) {
        video.pause();
        setCurrentPlaying(null);
      } else {
        video.play();
        setCurrentPlaying(itemId);
      }
    }
  };

  const handleMediaEnded = (itemId: string) => {
    if (currentPlaying === itemId) {
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

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'audio': return <Music className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
    }
  };

  const renderMediaItem = (item: MediaItem) => {
    switch (item.type) {
      case 'audio':
        return (
          <div 
            key={item.id}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
              currentPlaying === item.id 
                ? 'bg-gradient-to-r from-violet-200 to-purple-200 shadow-lg scale-[1.02]' 
                : 'bg-white/70 hover:bg-violet-100/50'
            }`}
          >
            <button
              onClick={() => handlePlayAudio(item.id)}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentPlaying === item.id
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
              }`}
            >
              {currentPlaying === item.id ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-dark-berry truncate flex items-center gap-2">
                <Music className="w-4 h-4 text-violet-400" />
                {item.name}
              </p>
              <p className="text-xs text-dark-berry/50">
                {currentPlaying === item.id ? '♪ Now Playing...' : 'Tap to play'}
              </p>
            </div>

            <audio
              ref={(el) => { audioRefs.current[item.id] = el; }}
              src={item.src}
              onEnded={() => handleMediaEnded(item.id)}
              preload="metadata"
            />
          </div>
        );

      case 'video':
        return (
          <div 
            key={item.id}
            className="rounded-2xl overflow-hidden bg-white/70 shadow-sm"
          >
            <div className="relative">
              <video
                ref={(el) => { videoRefs.current[item.id] = el; }}
                src={item.src}
                className="w-full aspect-video object-cover"
                onEnded={() => handleMediaEnded(item.id)}
                controls
                preload="metadata"
              />
            </div>
            <div className="p-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-violet-400" />
              <p className="font-medium text-dark-berry text-sm truncate">{item.name}</p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div 
            key={item.id}
            className="rounded-2xl overflow-hidden bg-white/70 shadow-sm cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setExpandedImage(item)}
          >
            <div className="relative">
              <img
                src={item.src}
                alt={item.name}
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 flex items-center gap-2">
              <Image className="w-4 h-4 text-violet-400" />
              <p className="font-medium text-dark-berry text-sm truncate">{item.name}</p>
            </div>
          </div>
        );
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
        className="relative w-[90%] sm:w-[450px] max-h-[85vh] bg-gradient-to-b from-violet-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in"
        style={{
          boxShadow: '0 10px 60px rgba(139, 92, 246, 0.4), 0 0 40px rgba(196, 181, 253, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-violet-200/30 bg-gradient-to-r from-violet-100/50 to-purple-100/50">
          <div>
            <h3 className="font-serif text-xl text-dark-berry flex items-center gap-2">
              ✨ Our Collection
            </h3>
            <p className="text-xs text-dark-berry/50">Memories that make us smile 💜</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-violet-200/50 transition-colors"
          >
            <X className="w-5 h-5 text-dark-berry" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-3 border-b border-violet-200/20 bg-white/30">
          {(['all', 'audio', 'video', 'image'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-violet-100/50 text-dark-berry hover:bg-violet-200/50'
              }`}
            >
              {filter === 'all' ? '🌟' : getMediaIcon(filter as MediaType)}
              <span className="capitalize">{filter}</span>
            </button>
          ))}
        </div>

        {/* Media List */}
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
          {/* Grid for images, list for audio/video */}
          {activeFilter === 'image' ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredMedia.map(renderMediaItem)}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMedia.map(renderMediaItem)}
            </div>
          )}

          {filteredMedia.length === 0 && (
            <p className="text-center text-dark-berry/50 text-sm italic py-10">
              {activeFilter === 'all' 
                ? "No items yet... add our first memory 💜" 
                : `No ${activeFilter}s yet... add one! 💜`}
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
              <p className="text-xs text-dark-berry/60 text-center mb-4">Enter the secret code to add items</p>
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

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
            <div className="bg-white rounded-2xl p-6 mx-4 shadow-xl max-w-[280px] w-full">
              <h4 className="font-serif text-lg text-dark-berry text-center mb-2">✨ Add Memory</h4>
              <p className="text-xs text-dark-berry/60 text-center mb-4">
                To add photos, videos, or songs - contact the developer 💜
              </p>
              <div className="flex gap-4 justify-center mb-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Music className="w-5 h-5 text-violet-500" />
                  </div>
                  <span className="text-xs text-dark-berry/60">Audio</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Video className="w-5 h-5 text-violet-500" />
                  </div>
                  <span className="text-xs text-dark-berry/60">Video</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Image className="w-5 h-5 text-violet-500" />
                  </div>
                  <span className="text-xs text-dark-berry/60">Image</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-full px-4 py-2 rounded-full bg-violet-500 text-white text-sm hover:bg-violet-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Expanded Image Modal */}
        {expandedImage && (
          <div 
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 rounded-3xl"
            onClick={() => setExpandedImage(null)}
          >
            <div className="relative max-w-[90%] max-h-[80%]">
              <img
                src={expandedImage.src}
                alt={expandedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                {expandedImage.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPanel;
