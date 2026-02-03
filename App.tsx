
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

  // Removed visibilitychange listener to prevent accidental disconnects
  // Chat will only close if the user explicitly exits or closes the tab

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

  const copyRoomID = () => {
    if (roomID) {
      navigator.clipboard.writeText(roomID);
      alert('Room ID copied! Share it with your friend.');
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
        onCopyID={copyRoomID}
      />

      <main className={`flex-1 overflow-y-auto p-4 flex flex-col space-y-2 relative transition-all duration-500 ${isDarkMode ? 'chat-bg-dark' : 'chat-bg-light'}`}>
        <div className="flex flex-col items-center mb-6 sticky top-0 z-10 gap-2">
          <span className="bg-white/90 dark:bg-[#111b21]/90 backdrop-blur-md text-[#54656f] dark:text-[#8696a0] text-[11px] px-3 py-1 rounded-md shadow-sm uppercase tracking-wider font-bold border border-black/5 dark:border-white/5">
            Today
          </span>
          <span className="bg-[#e1f3fb] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[10px] px-4 py-1 rounded-md shadow-sm text-center max-w-[80%] leading-tight">
            Messages are end-to-end encrypted. No one outside of this chat can read them.
          </span>
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {status === 'connecting' && (
          <div className="flex justify-center py-10">
             <div className="flex flex-col items-center gap-3 bg-white/50 dark:bg-black/20 p-6 rounded-2xl backdrop-blur-sm">
               <div className="w-8 h-8 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
               <span className="text-xs font-bold uppercase tracking-widest text-[#00a884]">Waiting for partner to join...</span>
               <button 
                 onClick={copyRoomID}
                 className="text-[10px] bg-[#00a884] text-white px-3 py-1.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
               >
                 COPY ROOM ID
               </button>
             </div>
          </div>
        )}

        {status === 'connected' && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40 select-none">
             <div className="p-6 rounded-full bg-[#00a884]/10 mb-4">
                <svg viewBox="0 0 24 24" height="60" width="60" fill="#00a884"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.81 9.81 0 0 0 12.04 2z"></path></svg>
             </div>
             <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00a884]">Partner Joined</p>
             <p className="text-[10px] mt-1 text-[#54656f] dark:text-[#8696a0]">Say hello to start the conversation</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex justify-center py-4">
             <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-1 rounded-full text-xs font-medium border border-red-500/20">
               Connection issue. Trying to stay alive...
             </span>
          </div>
        )}

        <div ref={chatEndRef} className="h-4" />
      </main>

      <div className="z-20 border-t border-black/5 dark:border-white/5">
        <MessageInput onSendMessage={handleSendMessage} disabled={status !== 'connected'} />
      </div>
    </div>
  );
}

export default App;
