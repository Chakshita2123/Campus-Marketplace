import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Search, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

export default function ChatInbox() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to view messages');
      navigate('/login');
      return;
    }

    fetchConversations();
  }, [isAuthenticated, user, navigate]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getConversations();
      setConversations(data);
      if (data.length > 0) {
        setSelectedChat(data[0]);
        fetchMessages(data[0].conversationId);
      }
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await apiClient.getConversationMessages(conversationId);
      setMessages(data);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    fetchMessages(chat.conversationId);
  };

  const handleSendMessage = async () => {
    if (message.trim() === '' || !selectedChat) return;

    try {
      setSending(true);
      await apiClient.sendMessage({
        receiverId: selectedChat.otherUser._id,
        receiverName: selectedChat.otherUser.name,
        text: message,
        listingId: selectedChat.listingId,
        listingTitle: selectedChat.listingTitle,
      });

      // Add message to local state immediately
      const newMessage = {
        text: message,
        createdAt: new Date().toISOString(),
        sender: {
          _id: user?.id,
          name: user?.name,
        },
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary mb-6">Messages</h1>
          <Card className="glass-card p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
            <p className="text-muted-foreground mb-4">
              Start a conversation by messaging a seller on a product page
            </p>
            <Button onClick={() => navigate('/browse')}>Browse Products</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <Card className="glass-card p-4 lg:col-span-1">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              {conversations.map((chat) => (
                <motion.div
                  key={chat.conversationId}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedChat?.conversationId === chat.conversationId
                      ? 'bg-accent/10 border border-accent/20'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                        {chat.otherUser.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{chat.otherUser.name}</div>
                        {chat.listingTitle && (
                          <div className="text-xs text-muted-foreground truncate">
                            Re: {chat.listingTitle}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {chat.lastMessage}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTime(chat.lastMessageTime)}
                    </div>
                  </div>
                  {chat.unread > 0 && (
                    <div className="ml-13 mt-1">
                      <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                        {chat.unread}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="glass-card lg:col-span-2 flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  {selectedChat.otherUser.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{selectedChat.otherUser.name}</div>
                  {selectedChat.listingTitle && (
                    <div className="text-sm text-muted-foreground">
                      About: {selectedChat.listingTitle}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isMe = msg.sender._id === user?.id;
                  return (
                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${
                        isMe
                          ? 'bg-accent text-white rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      } rounded-2xl px-4 py-2 max-w-xs`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className={`text-xs ${
                          isMe ? 'text-accent-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                  disabled={sending}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={sending}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
