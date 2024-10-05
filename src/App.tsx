import React, { useState, useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import { businesses } from './data/businesses';

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: input, isUser: true }]);
      setInput('');
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('https://us-central1-l-e-of-all-trades.cloudfunctions.net/chatFunction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput: input, businesses }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Oops! Received non-JSON response from server");
        }

        const data = await response.json();
        
        if (data.text) {
          setMessages(prevMessages => [...prevMessages, { text: data.text, isUser: false }]);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setError(`Unable to get a response: ${(error as Error).message || 'Unknown error'}. Please try again later.`);
      } finally {
        setIsLoading(false);
      }
    }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow p-3 text-xl border rounded-lg md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-[#b7964d] mb-2 md:mb-0 w-full md:w-auto"
            placeholder="Tell us what you need..."
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#b7964d] text-white p-3 rounded-lg md:rounded-l-none hover:bg-[#a58743] focus:outline-none focus:ring-2 focus:ring-[#b7964d] w-full md:w-auto"
            disabled={isLoading}
          >
            Send
          </button>
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