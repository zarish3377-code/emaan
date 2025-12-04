import { useState, useEffect, useRef } from 'react';
import { X, Plus, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  page_name: string;
  created_at: string;
  sender_id: string;
}

interface MessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Color palette for different users
const MESSAGE_COLORS = [
  'bg-pink-200/70 border-pink-300',
  'bg-purple-200/70 border-purple-300',
  'bg-blue-200/70 border-blue-300',
  'bg-green-200/70 border-green-300',
  'bg-yellow-200/70 border-yellow-300',
  'bg-orange-200/70 border-orange-300',
  'bg-teal-200/70 border-teal-300',
  'bg-rose-200/70 border-rose-300',
  'bg-indigo-200/70 border-indigo-300',
  'bg-cyan-200/70 border-cyan-300',
];

// Generate a unique ID for this user
const getOrCreateUserId = (): string => {
  const key = 'lovable_user_id';
  let userId = localStorage.getItem(key);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(key, userId);
  }
  return userId;
};

// Get consistent color based on sender ID
const getColorForSender = (senderId: string): string => {
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MESSAGE_COLORS.length;
  return MESSAGE_COLORS[index];
};

const MessagePanel = ({ isOpen, onClose }: MessagePanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pages, setPages] = useState<string[]>(["General"]);
  const [currentPage, setCurrentPage] = useState("General");
  const [newMessage, setNewMessage] = useState("");
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId] = useState(() => getOrCreateUserId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all messages from database
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('global_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (data) {
        setMessages(data);
        // Extract unique page names
        const uniquePages = [...new Set(data.map(m => m.page_name))];
        if (uniquePages.length > 0) {
          setPages(uniquePages);
          if (!uniquePages.includes(currentPage)) {
            setCurrentPage(uniquePages[0]);
          }
        }
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('global_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'global_messages'
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
          // Add page if it's new
          setPages(prev => {
            if (!prev.includes(newMsg.page_name)) {
              return [...prev, newMsg.page_name];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll to bottom when new messages added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentPage]);

  const addNewPage = () => {
    const pageNumbers = pages
      .map(name => {
        const match = name.match(/Page (\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    const nextNum = Math.max(...pageNumbers, 0) + 1;
    const newPageName = `Page ${nextNum}`;
    setPages(prev => [...prev, newPageName]);
    setCurrentPage(newPageName);
  };


  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    const { error } = await supabase
      .from('global_messages')
      .insert({
        text: newMessage.trim(),
        page_name: currentPage,
        sender_id: userId
      });

    if (error) {
      console.error('Error sending message:', error);
    }
    
    setNewMessage("");
    setSending(false);
    inputRef.current?.focus();
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
      const newPages = pages.map(p => p === editingTab ? editingName.trim() : p);
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

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, h:mm a");
    } catch {
      return "";
    }
  };

  if (!isOpen) return null;

  const currentMessages = messages.filter(m => m.page_name === currentPage);

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
          <div>
            <h3 className="font-serif text-lg text-dark-berry">Just Say It 🌷</h3>
            <p className="text-[10px] text-dark-berry/50">Messages visible to everyone worldwide</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blush-rose/20 transition-colors"
          >
            <X className="w-5 h-5 text-dark-berry" />
          </button>
        </div>

        {/* Page Tabs */}
        <div className="flex items-center gap-1 p-2 overflow-x-auto border-b border-blush-rose/20 scrollbar-hide">
          {pages.map(pageName => (
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-blush-rose animate-spin" />
            </div>
          ) : currentMessages.length === 0 ? (
            <p className="text-center text-dark-berry/50 text-sm italic mt-10">
              No messages yet... write what your heart feels 🌷
            </p>
          ) : (
            currentMessages.map((msg) => {
              const isMyMessage = msg.sender_id === userId;
              const colorClass = getColorForSender(msg.sender_id);
              
              return (
                <div 
                  key={msg.id}
                  className={`relative p-3 pb-6 rounded-2xl shadow-sm animate-fade-in border ${colorClass} ${
                    isMyMessage ? 'ml-4' : 'mr-4'
                  }`}
                >
                  <p className="text-dark-berry text-sm leading-relaxed">{msg.text}</p>
                  <div className="absolute bottom-2 right-3 flex items-center gap-1">
                    {isMyMessage && (
                      <span className="text-[9px] text-dark-berry/40 italic">you</span>
                    )}
                    <span className="text-[10px] text-dark-berry/40">
                      {formatTimestamp(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
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
              disabled={!newMessage.trim() || sending}
              className="p-2.5 rounded-full bg-blush-rose text-white hover:bg-blush-rose/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePanel;
