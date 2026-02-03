
import React from 'react';

interface HeaderProps {
  roomID: string;
  onExit: () => void;
  isConnected: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ roomID, onExit, isConnected, isDarkMode, toggleTheme }) => {
  return (
    <header className="bg-[#008069] dark:bg-[#202c33] h-16 flex items-center px-4 justify-between shrink-0 z-20 shadow-lg transition-colors duration-500">
      <div className="flex items-center space-x-3 text-white">
        <button onClick={onExit} className="p-1 hover:bg-black/10 rounded-full transition-colors">
          <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
        </button>
        <div className="relative w-10 h-10">
          <img 
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${roomID}`} 
            alt="Avatar" 
            className="rounded-full w-full h-full bg-white/20 border border-white/10"
          />
          <div className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-[#008069] dark:border-[#202c33] transition-colors duration-500 ${isConnected ? 'bg-[#25d366] animate-pulse' : 'bg-red-500'}`}></div>
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-[16px] leading-tight text-white tracking-wide">Ghost Chat</h1>
          <p className="text-[11px] text-white/70 font-medium truncate max-w-[120px]">
            {isConnected ? 'Peer Connected' : 'Waiting for Peer...'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={toggleTheme}
          className="p-2.5 hover:bg-black/10 rounded-full transition-all text-white active:rotate-45"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? (
            <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M12.12 22c4.07 0 7.7-2.53 9.03-6.32a.503.503 0 0 0-.5-.63c-.15 0-.31.04-.44.13a8.19 8.19 0 0 1-10.6-10.6.502.502 0 0 0-.5-.63c-.15 0-.31.04-.44.13A9.99 9.99 0 0 0 12.12 22z"/></svg>
          )}
        </button>
        <button onClick={onExit} className="p-2.5 hover:bg-black/10 rounded-full transition-colors text-white" title="Exit Room">
          <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
