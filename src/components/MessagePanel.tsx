import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Send } from 'lucide-react';

interface MessagePages {
  [key: string]: string[];
}

interface MessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessagePanel = ({ isOpen, onClose }: MessagePanelProps) => {
  const [pages, setPages] = useState<MessagePages>({ "Page 1": [] });
  const [currentPage, setCurrentPage] = useState("Page 1");
  const [newMessage, setNewMessage] = useState("");
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("messagePages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPages(parsed);
        const pageNames = Object.keys(parsed);
        if (pageNames.length > 0 && !parsed[currentPage]) {
          setCurrentPage(pageNames[0]);
        }
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
  }, []);

  // Save to localStorage whenever pages change
  useEffect(() => {
    localStorage.setItem("messagePages", JSON.stringify(pages));
  }, [pages]);

  // Auto-scroll to bottom when new messages added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pages, currentPage]);

  const addNewPage = () => {
    const pageNumbers = Object.keys(pages)
      .map(name => {
        const match = name.match(/Page (\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    const nextNum = Math.max(...pageNumbers, 0) + 1;
    const newPageName = `Page ${nextNum}`;
    setPages(prev => ({ ...prev, [newPageName]: [] }));
    setCurrentPage(newPageName);
  };

  const deletePage = (pageName: string) => {
    if (Object.keys(pages).length <= 1) return;
    const newPages = { ...pages };
    delete newPages[pageName];
    setPages(newPages);
    if (currentPage === pageName) {
      setCurrentPage(Object.keys(newPages)[0]);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setPages(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newMessage.trim()]
    }));
    setNewMessage("");
    inputRef.current?.focus();
  };

  const deleteMessage = (index: number) => {
    setPages(prev => ({
      ...prev,
      [currentPage]: prev[currentPage].filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startRenaming = (pageName: string) => {
    setEditingTab(pageName);
    setEditingName(pageName);
  };

  const finishRenaming = () => {
    if (editingTab && editingName.trim() && editingName !== editingTab) {
      const newPages: MessagePages = {};
      Object.keys(pages).forEach(key => {
        if (key === editingTab) {
          newPages[editingName.trim()] = pages[key];
        } else {
          newPages[key] = pages[key];
        }
      });
      setPages(newPages);
      if (currentPage === editingTab) {
        setCurrentPage(editingName.trim());
      }
    }
    setEditingTab(null);
    setEditingName("");
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      finishRenaming();
    } else if (e.key === "Escape") {
      setEditingTab(null);
      setEditingName("");
    }
  };

  if (!isOpen) return null;

  const pageNames = Object.keys(pages);
  const currentMessages = pages[currentPage] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="relative w-[90%] sm:w-[350px] max-h-[80vh] bg-gradient-to-b from-soft-pink to-cream-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden"
        style={{
          boxShadow: '0 -10px 60px rgba(243, 184, 211, 0.5), 0 0 40px rgba(231, 213, 246, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blush-rose/20">
          <h3 className="font-serif text-lg text-dark-berry">Just Say It 🌷</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blush-rose/20 transition-colors"
          >
            <X className="w-5 h-5 text-dark-berry" />
          </button>
        </div>

        {/* Page Tabs */}
        <div className="flex items-center gap-1 p-2 overflow-x-auto border-b border-blush-rose/20 scrollbar-hide">
          {pageNames.map(pageName => (
            <div 
              key={pageName}
              className={`group flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentPage === pageName 
                  ? 'bg-blush-rose text-white shadow-md' 
                  : 'bg-pastel-lavender/30 text-dark-berry hover:bg-pastel-lavender/50'
              }`}
              onClick={() => setCurrentPage(pageName)}
              onDoubleClick={() => startRenaming(pageName)}
            >
              {editingTab === pageName ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={finishRenaming}
                  onKeyDown={handleRenameKeyPress}
                  className="w-16 bg-transparent outline-none text-center"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{pageName}</span>
              )}
              {pageNames.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(pageName);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/30 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNewPage}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-pastel-lavender/30 hover:bg-pastel-lavender/50 text-dark-berry transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[300px] overflow-y-auto p-4 space-y-3">
          {currentMessages.length === 0 ? (
            <p className="text-center text-dark-berry/50 text-sm italic mt-10">
              No messages yet... write what your heart feels 🌷
            </p>
          ) : (
            currentMessages.map((msg, idx) => (
              <div 
                key={idx}
                className="group relative p-3 bg-white/60 rounded-2xl shadow-sm animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <p className="text-dark-berry text-sm leading-relaxed pr-6">{msg}</p>
                <button
                  onClick={() => deleteMessage(idx)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-blush-rose/20 transition-all"
                >
                  <Trash2 className="w-3 h-3 text-dark-berry/50 hover:text-dark-berry" />
                </button>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-blush-rose/20 bg-white/30">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="write what your heart wants to say…"
              className="flex-1 px-4 py-2.5 bg-white/70 rounded-full text-sm text-dark-berry placeholder:text-dark-berry/40 outline-none focus:ring-2 focus:ring-blush-rose/50 transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2.5 rounded-full bg-blush-rose text-white hover:bg-blush-rose/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePanel;
