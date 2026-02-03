
import React, { useState, useEffect, useRef, useCallback } from 'react';
import JoinRoom from './components/JoinRoom';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';
import { Message, ConnectionStatus } from './types';
import { PeerManager } from './services/peerService';

function App() {
  const [roomID, setRoomID] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Sync with system preference initially
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const peerManagerRef = useRef<PeerManager | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const destruct = useCallback(() => {
    if (peerManagerRef.current) {
      peerManagerRef.current.destroy();
    }
    setRoomID(null);
    setMessages([]);
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    if (roomID) {
      peerManagerRef.current = new PeerManager(
        (data: any) => {
          if (data.type === 'message') {
            setMessages(prev => [...prev, {
              ...data.payload,
              sender: 'them',
              id: Date.now().toString()
            }]);
          }
        },
        (newStatus) => setStatus(newStatus)
      );
      peerManagerRef.current.init(roomID);
    }
    return () => peerManagerRef.current?.destroy();
  }, [roomID]);

  // Security: Auto-destruct on hide
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && roomID) {
        destruct();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [roomID, destruct]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payload = { text, timestamp };

    if (peerManagerRef.current?.send({ type: 'message', payload })) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'me',
        timestamp
      }]);
    }
  };

  if (!roomID) return <JoinRoom onJoin={setRoomID} />;

  return (
    <div className={`flex flex-col h-screen max-h-screen transition-all duration-500`}>
      <Header 
        roomID={roomID} 
        isConnected={status === 'connected'} 
        onExit={destruct} 
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className={`flex-1 overflow-y-auto p-4 flex flex-col space-y-2 relative transition-all duration-500 ${isDarkMode ? 'chat-bg-dark' : 'chat-bg-light'}`}>
        <div className="flex justify-center mb-6 sticky top-0 z-10">
          <span className="bg-black/20 dark:bg-white/10 backdrop-blur-md text-[#111b21] dark:text-white/80 text-[10px] px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest font-bold border border-white/5">
            Encrypted Session Active
          </span>
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {status === 'connecting' && (
          <div className="flex justify-center py-10">
             <div className="flex flex-col items-center gap-3">
               <div className="w-8 h-8 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
               <span className="text-xs font-bold uppercase tracking-widest opacity-50">Establishing Tunnel</span>
             </div>
          </div>
        )}

        {status === 'connected' && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 select-none">
             <svg viewBox="0 0 24 24" height="80" width="80" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.81 9.81 0 0 0 12.04 2z"></path></svg>
             <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em]">Ghost Chat</p>
          </div>
        )}

        <div ref={chatEndRef} className="h-4" />
      </main>

      <div className="z-20">
        <MessageInput onSendMessage={handleSendMessage} disabled={status !== 'connected'} />
      </div>
    </div>
  );
}

export default App;
