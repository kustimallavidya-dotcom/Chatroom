
import React, { useState } from 'react';

interface JoinRoomProps {
  onJoin: (roomID: string) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoin }) => {
  const [inputID, setInputID] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputID.trim()) {
      onJoin(inputID.trim().toLowerCase());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2f5] dark:bg-[#111b21] p-6 transition-all duration-500">
      <div className="w-full max-w-md bg-white dark:bg-[#222e35] p-8 rounded-2xl shadow-2xl transition-all border border-black/5 dark:border-white/5">
        <div className="flex justify-center mb-6">
          <div className="bg-[#128C7E] p-4 rounded-3xl shadow-lg shadow-[#128C7E]/20">
            <svg viewBox="0 0 24 24" height="40" width="40" fill="white"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.81 9.81 0 0 0 12.04 2z"></path></svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center text-[#111b21] dark:text-white">Secure P2P Chat</h1>
        <p className="text-[#667781] dark:text-[#8696a0] mb-8 text-center text-sm">
          Privacy-focused ephemeral chat. Messages vanish forever when you disconnect.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#008069] dark:text-[#00a884] ml-1">Room Identity</label>
            <input 
              type="text" 
              placeholder="e.g. secret-coffee-chat" 
              value={inputID}
              onChange={(e) => setInputID(e.target.value)}
              className="w-full bg-[#f0f2f5] dark:bg-[#2a3942] px-4 py-3.5 rounded-xl outline-none text-[#111b21] dark:text-[#e9edef] placeholder-[#667781] dark:placeholder-[#8696a0] border border-transparent focus:border-[#00a884] transition-all"
              autoFocus
            />
          </div>
          
          <button 
            type="submit"
            disabled={!inputID.trim()}
            className="w-full bg-[#00a884] hover:bg-[#008f6f] disabled:bg-[#8696a0] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-xl active:scale-[0.98]"
          >
            Start Encrypted Session
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#667781] dark:text-[#8696a0]">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> P2P</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In-Memory</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
