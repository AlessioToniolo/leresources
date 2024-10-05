import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, Volume2, Instagram } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import BusinessCard from './components/BusinessCard';
import { businesses } from './data/businesses';

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('/.netlify/functions/chat');
      if (!response.ok) {
        throw new Error('Server is not responding');
      }
    } catch (error) {
      console.error('Server check failed:', error);
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      setIsLoading(true);
      setError(null);
      try {
        const botResponse = await getChatResponse(input);
        setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
      } catch (error) {
        console.error('Error getting chat response:', error);
        setError('Unable to get a response. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getChatResponse = async (userInput: string): Promise<string> => {
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput, businesses }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.text) {
        throw new Error('Invalid response from server');
      }
      return data.text;
    } catch (error) {
      console.error('Error in getChatResponse:', error);
      throw error;
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Implement speech-to-text functionality here
  };

  const handleTextToSpeech = (text: string) => {
    setIsSpeaking(true);
    // Implement text-to-speech functionality here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#b7964d] text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">L-E-of-all-trades</h1>
      </header>
      <main className="flex-grow p-4 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[calc(100vh-16rem)] overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && <p className="text-center text-gray-500">Thinking...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow p-3 text-xl border rounded-lg md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-[#b7964d] mb-2 md:mb-0 w-full md:w-auto"
            placeholder="Tell us what you need..."
            disabled={isLoading}
          />
          <div className="flex w-full md:w-auto">
            <button
              onClick={handleSendMessage}
              className="bg-[#b7964d] text-white p-3 rounded-lg md:rounded-l-none hover:bg-[#a58743] focus:outline-none focus:ring-2 focus:ring-[#b7964d] disabled:bg-[#d9c7a3] flex-grow md:flex-grow-0"
              disabled={isLoading}
            >
              <MessageSquare size={24} className="mx-auto" />
            </button>
            <button
              onClick={handleVoiceInput}
              className="ml-2 bg-[#b7964d] text-white p-3 rounded-lg hover:bg-[#a58743] focus:outline-none focus:ring-2 focus:ring-[#b7964d] disabled:bg-[#d9c7a3]"
              disabled={isLoading}
            >
              <Mic size={24} />
            </button>
            <button
              onClick={() => handleTextToSpeech(messages[messages.length - 1]?.text)}
              className="ml-2 bg-[#b7964d] text-white p-3 rounded-lg hover:bg-[#a58743] focus:outline-none focus:ring-2 focus:ring-[#b7964d] disabled:bg-[#d9c7a3]"
              disabled={isLoading || messages.length === 0}
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <div className="flex justify-center items-center">
          <p className="text-lg mr-2">© 2024 L-E-of-all-trades. All rights reserved.</p>
          <a href="https://www.instagram.com/l.e.resources" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Instagram size={24} className="text-[#b7964d] hover:text-[#a58743]" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;