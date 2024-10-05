import React from 'react';

interface ChatMessageProps {
  message: {
    text: string;
    isUser: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { text, isUser } = message;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-3/4 p-3 rounded-lg ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        <p className="text-lg">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;