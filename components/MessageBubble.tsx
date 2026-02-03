
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMe = message.sender === 'me';
  
  return (
    <div className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] sm:max-w-[70%] px-3 py-1.5 rounded-lg shadow-sm relative group transition-colors duration-300
          ${isMe 
            ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none' 
            : 'bg-[#ffffff] dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none'}`}
      >
        <div className="text-[14.2px] leading-relaxed break-words whitespace-pre-wrap pr-12">
          {message.text}
        </div>
        <div className="absolute bottom-1 right-1.5 flex items-center space-x-1">
          <span className="text-[11px] text-[#667781] dark:text-[#8696a0]">{message.timestamp}</span>
          {isMe && (
            <span className="text-[#53bdeb]">
              <svg viewBox="0 0 16 15" height="15" width="16" fill="currentColor"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879l-2.976-2.834a.37.37 0 0 0-.539.01l-.5.565a.303.303 0 0 0 .01.439l4.008 3.82a.37.37 0 0 0 .54-.01l5.864-7.994a.36.36 0 0 0-.063-.51zm-5.713 5.103L8.536 9.45l-4.542-4.13a.31.31 0 0 0-.44 0l-.533.489a.294.294 0 0 0 0 .432l5.35 4.86a.33.33 0 0 0 .467 0l1.248-1.136a.31.31 0 0 0 0-.432l-.533-.489a.294.294 0 0 0-.297-.032z"></path></svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
