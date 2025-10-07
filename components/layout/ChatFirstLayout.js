import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ChatFirstSidebar from './ChatFirstSidebar';
import { supabase } from '../../lib/supabase';

const ChatFirstLayout = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [user, setUser] = useState(null);

  // Load user and conversations
  useEffect(() => {
    const loadUserAndConversations = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Load conversations from Supabase
          const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(20);

          if (!error && data) {
            setConversations(data.map(conv => ({
              id: conv.id,
              title: conv.title || 'Nouvelle conversation',
              updatedAt: conv.updated_at
            })));
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        // Continue even if there's an error
      }
    };

    loadUserAndConversations();
  }, []);

  const handleNewChat = () => {
    // Create new conversation
    setCurrentConversationId(null);
    router.push('/');
  };

  const handleSelectConversation = (conversationId) => {
    setCurrentConversationId(conversationId);
    router.push(`/?conversation=${conversationId}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div 
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(180deg, rgba(240,240,240,0.7) 0%, rgba(255,255,255,0.9) 100%)'
      }}
    >
      <ChatFirstSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default ChatFirstLayout;

