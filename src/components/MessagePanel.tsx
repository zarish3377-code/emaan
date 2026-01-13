import { useState, useEffect, useRef } from 'react';
import { X, Plus, Send, Loader2, Pencil, Trash2, Check, Smile, Palette } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  text: string;
  page_name: string;
  created_at: string;
  sender_id: string;
  color?: string | null;
}

interface Reaction {
  id: string;
  message_id: string;
  emoji: string;
  sender_id: string;
}

interface MessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['🌷', '🩵', '🌼', '💚', '😭', '🫂', '😮‍💨', '🤦‍♀️'];

// Admin user ID (stored in localStorage for this user)
const ADMIN_SENDER_ID = 'admin_jellyjello';

// Color palette for color picker
const COLOR_OPTIONS = [
  { name: 'Pink', value: 'rgba(255, 192, 203, 0.6)', display: '#FFC0CB' },
  { name: 'Blue', value: 'rgba(127, 187, 250, 0.6)', display: '#7fbbfa' },
  { name: 'Lavender', value: 'rgba(177, 156, 217, 0.6)', display: '#b19cd9' },
  { name: 'Mint', value: 'rgba(152, 251, 152, 0.6)', display: '#98FB98' },
  { name: 'Peach', value: 'rgba(255, 218, 185, 0.6)', display: '#FFDAB9' },
  { name: 'Yellow', value: 'rgba(255, 250, 205, 0.6)', display: '#FFFACD' },
  { name: 'Coral', value: 'rgba(255, 182, 193, 0.6)', display: '#FFB6C1' },
  { name: 'Sky', value: 'rgba(135, 206, 235, 0.6)', display: '#87CEEB' },
];

// Default admin color
const DEFAULT_ADMIN_COLOR = 'rgba(255, 192, 203, 0.6)';
const DEFAULT_ADMIN_DISPLAY = '#FFC0CB';

// Default user colors for hash-based assignment
const DEFAULT_USER_COLORS = ['rgba(127, 187, 250, 0.6)', 'rgba(177, 156, 217, 0.6)'];

// Helper to get display color from value
const getDisplayColor = (value: string): string => {
  const found = COLOR_OPTIONS.find(c => c.value === value);
  if (found) return found.display;
  if (value === DEFAULT_ADMIN_COLOR) return DEFAULT_ADMIN_DISPLAY;
  // For old hex colors, return as-is
  return value;
};

// Generate a unique ID for this user
const getOrCreateUserId = (isAdmin: boolean): string => {
  const key = 'lovable_user_id';
  
  // If admin, always return admin ID
  if (isAdmin) {
    localStorage.setItem(key, ADMIN_SENDER_ID);
    return ADMIN_SENDER_ID;
  }
  
  let userId = localStorage.getItem(key);
  // If stored ID is admin ID but user is not admin, generate new one
  if (!userId || userId === ADMIN_SENDER_ID) {
    userId = crypto.randomUUID();
    localStorage.setItem(key, userId);
  }
  return userId;
};

// Get fallback color based on sender ID (when no custom color is set)
const getFallbackColor = (senderId: string): string => {
  // Admin always gets pink by default
  if (senderId === ADMIN_SENDER_ID) {
    return DEFAULT_ADMIN_COLOR;
  }
  
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DEFAULT_USER_COLORS.length;
  return DEFAULT_USER_COLORS[index];
};


const MessagePanel = ({ isOpen, onClose }: MessagePanelProps) => {
  const { isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [pages, setPages] = useState<string[]>(["General"]);
  const [currentPage, setCurrentPage] = useState("General");
  const [newMessage, setNewMessage] = useState("");
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_ADMIN_COLOR);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set user ID based on admin status
  useEffect(() => {
    setUserId(getOrCreateUserId(isAdmin));
  }, [isAdmin]);

  // Fetch all messages and reactions from database
  useEffect(() => {
    const fetchData = async () => {
      const [messagesRes, reactionsRes] = await Promise.all([
        supabase
          .from('global_messages')
          .select('*')
          .order('created_at', { ascending: true }),
        supabase
          .from('message_reactions')
          .select('*')
      ]);

      if (messagesRes.error) {
        console.error('Error fetching messages:', messagesRes.error);
      } else if (messagesRes.data) {
        setMessages(messagesRes.data);
        const uniquePages = [...new Set(messagesRes.data.map(m => m.page_name))];
        if (uniquePages.length > 0) {
          setPages(uniquePages);
          if (!uniquePages.includes(currentPage)) {
            setCurrentPage(uniquePages[0]);
          }
        }
      }

      if (reactionsRes.data) {
        setReactions(reactionsRes.data);
      }

      setLoading(false);
    };

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('global_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Message;
            setMessages(prev => [...prev, newMsg]);
            setPages(prev => {
              if (!prev.includes(newMsg.page_name)) {
                return [...prev, newMsg.page_name];
              }
              return prev;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as Message;
            setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
          } else if (payload.eventType === 'DELETE') {
            const deletedMsg = payload.old as Message;
            setMessages(prev => prev.filter(m => m.id !== deletedMsg.id));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newReaction = payload.new as Reaction;
            setReactions(prev => [...prev, newReaction]);
          } else if (payload.eventType === 'DELETE') {
            const deletedReaction = payload.old as Reaction;
            setReactions(prev => prev.filter(r => r.id !== deletedReaction.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll to bottom when panel opens, page changes, or new messages added
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, currentPage, isOpen]);

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
    const trimmedMessage = newMessage.trim();
    
    // Input validation
    if (!trimmedMessage || sending) return;
    if (trimmedMessage.length > 2000) {
      console.error('Message too long (max 2000 characters)');
      return;
    }
    
    setSending(true);
    const { error } = await supabase
      .from('global_messages')
      .insert({
        text: trimmedMessage,
        page_name: currentPage,
        sender_id: userId,
        color: selectedColor
      });

    if (error) {
      console.error('Error sending message:', error);
    }
    
    setNewMessage("");
    setSending(false);
    inputRef.current?.focus();
  };

  const handleChangeMessageColor = async (msgId: string, color: string) => {
    const { error } = await supabase
      .from('global_messages')
      .update({ color })
      .eq('id', msgId);

    if (error) {
      console.error('Error updating message color:', error);
    } else {
      setMessages(prev => prev.map(m => 
        m.id === msgId ? { ...m, color } : m
      ));
    }
    setShowColorPicker(null);
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

  const finishRenaming = async () => {
    if (editingTab && editingName.trim() && editingName !== editingTab) {
      const oldName = editingTab;
      const newName = editingName.trim();
      
      // Update messages in database to use new page name
      const { error } = await supabase
        .from('global_messages')
        .update({ page_name: newName })
        .eq('page_name', oldName);

      if (error) {
        console.error('Error updating page name:', error);
      } else {
        // Update local state
        setMessages(prev => prev.map(m => 
          m.page_name === oldName ? { ...m, page_name: newName } : m
        ));
        const newPages = pages.map(p => p === oldName ? newName : p);
        setPages(newPages);
        if (currentPage === oldName) {
          setCurrentPage(newName);
        }
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

  const handleEditMessage = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditingMessageText(msg.text);
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editingMessageText.trim()) return;
    
    const { error } = await supabase
      .from('global_messages')
      .update({ text: editingMessageText.trim() })
      .eq('id', msgId);

    if (error) {
      console.error('Error updating message:', error);
    } else {
      setMessages(prev => prev.map(m => 
        m.id === msgId ? { ...m, text: editingMessageText.trim() } : m
      ));
    }
    setEditingMessageId(null);
    setEditingMessageText("");
  };

  const handleDeleteMessage = async (msgId: string) => {
    const { error } = await supabase
      .from('global_messages')
      .delete()
      .eq('id', msgId);

    if (error) {
      console.error('Error deleting message:', error);
    } else {
      setMessages(prev => prev.filter(m => m.id !== msgId));
    }
  };

  const handleDeletePage = async (pageName: string) => {
    const pageMessages = messages.filter(m => m.page_name === pageName);
    if (pageMessages.length > 0) {
      return; // Don't delete pages with messages
    }
    
    setPages(prev => prev.filter(p => p !== pageName));
    if (currentPage === pageName) {
      setCurrentPage(pages[0] || "General");
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    const existingReaction = reactions.find(
      r => r.message_id === messageId && r.emoji === emoji && r.sender_id === userId
    );

    if (existingReaction) {
      // Remove reaction
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('id', existingReaction.id);

      if (!error) {
        setReactions(prev => prev.filter(r => r.id !== existingReaction.id));
      }
    } else {
      // Add reaction
      const { data, error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          emoji,
          sender_id: userId
        })
        .select()
        .single();

      if (!error && data) {
        setReactions(prev => [...prev, data]);
      }
    }
    setShowEmojiPicker(null);
  };

  const getReactionsForMessage = (messageId: string) => {
    const messageReactions = reactions.filter(r => r.message_id === messageId);
    const grouped: { [emoji: string]: { count: number; hasMyReaction: boolean } } = {};
    
    messageReactions.forEach(r => {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { count: 0, hasMyReaction: false };
      }
      grouped[r.emoji].count++;
      if (r.sender_id === userId) {
        grouped[r.emoji].hasMyReaction = true;
      }
    });
    
    return grouped;
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

        {/* Page Tabs with horizontal scroll */}
        <div className="relative border-b border-blush-rose/20">
          <div 
            className="flex items-center gap-1 p-2 overflow-x-auto scrollbar-soft"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {pages.map(pageName => {
              const pageHasMessages = messages.some(m => m.page_name === pageName);
              const canDelete = isAdmin && !pageHasMessages && pages.length > 1;
              
              return (
                <div key={pageName} className="relative flex-shrink-0 group">
                  <button 
                    type="button"
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
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
                  </button>
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(pageName);
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={addNewPage}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-pastel-lavender/30 hover:bg-pastel-lavender/50 text-dark-berry transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
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
              const messageColor = msg.color || getFallbackColor(msg.sender_id);
              const isEditing = editingMessageId === msg.id;
              const messageReactions = getReactionsForMessage(msg.id);
              
              return (
                <div 
                  key={msg.id}
                  className={`relative p-3 pb-8 rounded-2xl shadow-sm animate-fade-in border ${
                    isMyMessage ? 'ml-4' : 'mr-4'
                  }`}
                  style={{
                    backgroundColor: `${messageColor}B3`,
                    borderColor: messageColor
                  }}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingMessageText}
                        onChange={(e) => setEditingMessageText(e.target.value)}
                        className="flex-1 px-2 py-1 bg-white/70 rounded text-sm text-dark-berry outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(msg.id);
                          if (e.key === 'Escape') {
                            setEditingMessageId(null);
                            setEditingMessageText("");
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(msg.id)}
                        className="p-1 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-dark-berry text-sm leading-relaxed">{msg.text}</p>
                  )}
                  
                  {/* Reactions display */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(messageReactions).map(([emoji, data]) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className={`px-1.5 py-0.5 text-xs rounded-full flex items-center gap-0.5 transition-all ${
                          data.hasMyReaction 
                            ? 'bg-blush-rose/30 border border-blush-rose' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="text-dark-berry/60">{data.count}</span>
                      </button>
                    ))}
                    
                    {/* Add reaction button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                        className="px-1.5 py-0.5 text-xs rounded-full bg-white/50 hover:bg-white/70 transition-all"
                      >
                        <Smile className="w-3 h-3 text-dark-berry/50" />
                      </button>
                      
                      {showEmojiPicker === msg.id && (
                        <div className="absolute bottom-full left-0 mb-1 p-1 bg-white rounded-lg shadow-lg flex gap-1 z-10">
                          {EMOJI_OPTIONS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(msg.id, emoji)}
                              className="text-sm hover:scale-125 transition-transform p-0.5"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 right-3 flex items-center gap-1">
                    {isAdmin && !isEditing && (
                      <>
                        {/* Color picker for admin */}
                        <div className="relative">
                          <button
                            onClick={() => setShowColorPicker(showColorPicker === msg.id ? null : msg.id)}
                            className="p-0.5 rounded hover:bg-white/50 transition-colors"
                          >
                            <Palette className="w-3 h-3 text-dark-berry/50 hover:text-dark-berry" />
                          </button>
                          {showColorPicker === msg.id && (
                            <div className="absolute bottom-full right-0 mb-1 p-2 bg-white rounded-lg shadow-lg grid grid-cols-4 gap-1 z-20 min-w-[120px]">
                              {COLOR_OPTIONS.map(color => (
                                <button
                                  key={color.value}
                                  onClick={() => handleChangeMessageColor(msg.id, color.value)}
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color.display }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleEditMessage(msg)}
                          className="p-0.5 rounded hover:bg-white/50 transition-colors"
                        >
                          <Pencil className="w-3 h-3 text-dark-berry/50 hover:text-dark-berry" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-0.5 rounded hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-dark-berry/50 hover:text-red-500" />
                        </button>
                      </>
                    )}
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
            {/* Color picker for new message */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(showColorPicker === 'new-message' ? null : 'new-message')}
                className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                style={{ backgroundColor: getDisplayColor(selectedColor) }}
                title="Choose message color"
              />
              {showColorPicker === 'new-message' && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg grid grid-cols-4 gap-1 z-20 min-w-[120px]">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setSelectedColor(color.value);
                        setShowColorPicker(null);
                      }}
                      className={`w-6 h-6 rounded-full border-2 shadow-sm hover:scale-110 transition-transform ${
                        selectedColor === color.value ? 'border-dark-berry' : 'border-white'
                      }`}
                      style={{ backgroundColor: color.display }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>
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
