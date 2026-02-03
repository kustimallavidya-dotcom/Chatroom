
import React from 'react';

interface HeaderProps {
  roomID: string;
  onExit: () => void;
  isConnected: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onCopyID: () => void;
}

const Header: React.FC<HeaderProps> = ({ roomID, onExit, isConnected, isDarkMode, toggleTheme, onCopyID }) => {
  return (
    <header className="bg-[#f0f2f5] dark:bg-[#202c33] h-[70px] flex items-center px-4 justify-between shrink-0 z-20 transition-colors duration-500 border-b border-black/5 dark:border-white/5">
      <div className="flex items-center space-x-3">
        <button onClick={onExit} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-[#54656f] dark:text-[#aebac1]">
          <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
        </button>
        <div className="relative w-11 h-11 cursor-pointer" onClick={onCopyID}>
          <img 
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${roomID}`} 
            alt="Avatar" 
            className="rounded-full w-full h-full bg-[#00a884]/10 border-2 border-white dark:border-[#202c33] shadow-sm"
          />
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#f0f2f5] dark:border-[#202c33] transition-colors duration-500 ${isConnected ? 'bg-[#25d366]' : 'bg-[#8696a0]'}`}></div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-semibold text-[16px] leading-tight text-[#111b21] dark:text-[#e9edef]">{roomID}</h1>
          <p className={`text-[12px] font-medium ${isConnected ? 'text-[#00a884] dark:text-[#00a884]' : 'text-[#667781] dark:text-[#8696a0]'}`}>
            {isConnected ? 'Partner Online (2/2)' : 'Waiting for partner...'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <button 
          onClick={onCopyID}
          className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all text-[#54656f] dark:text-[#aebac1]"
          title="Copy Room ID"
        >
          <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all text-[#54656f] dark:text-[#aebac1]"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? (
            <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor"><path d="M12.12 22c4.07 0 7.7-2.53 9.03-6.32a.503.503 0 0 0-.5-.63c-.15 0-.31.04-.44.13a8.19 8.19 0 0 1-10.6-10.6.502.502 0 0 0-.5-.63c-.15 0-.31.04-.44.13A9.99 9.99 0 0 0 12.12 22z"/></svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
