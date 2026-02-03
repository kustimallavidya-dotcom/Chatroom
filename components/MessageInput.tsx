
import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-2 flex items-end space-x-3 shrink-0 transition-colors duration-300">
      <button className="p-2 text-[#54656f] dark:text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
        <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>
      </button>
      
      <div className="flex-1 min-h-[40px] bg-[#ffffff] dark:bg-[#2a3942] rounded-lg px-3 py-1.5 flex items-center shadow-sm">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="w-full bg-transparent border-none focus:ring-0 text-[#111b21] dark:text-[#e9edef] text-[15px] resize-none max-h-[120px] py-1 placeholder-[#667781] dark:placeholder-[#8696a0]"
          rows={1}
          disabled={disabled}
        />
      </div>

      <button 
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className={`p-2 transition-colors ${text.trim() && !disabled ? 'text-[#00a884]' : 'text-[#54656f] dark:text-[#8696a0]'}`}
      >
        <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
      </button>
    </div>
  );
};

export default MessageInput;
