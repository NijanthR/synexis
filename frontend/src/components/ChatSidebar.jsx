import { useState, useRef, useEffect } from 'react';

const ChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'Hello! I\'m your Synexis AI assistant.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call backend chat endpoint (backend uses same URL + API key)
  const getAIResponse = async (userMessage) => {
    let response;

    try {
      response = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
    } catch (error) {
      throw new Error('Network error: Unable to reach the server.');
    }

    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const backendMessage = data?.error || `API error: ${response.status}`;

      if (response.status === 502) {
        throw new Error('AI service is temporarily unavailable. Please try again in a moment.');
      }

      throw new Error(backendMessage);
    }

    const text = data?.text;
    if (!text) {
      throw new Error('Empty response from server.');
    }

    return text;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();

    const userMessage = { 
      role: 'user', 
      content: messageText, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(messageText);
      
      const assistantMessage = {
        role: 'model',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'model',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([{
      role: 'model',
      content: 'Hello! I\'m your AI assistant. I can help you with machine learning models, datasets, predictions, and anything related to your Synexis ML projects. What would you like to know?',
      timestamp: new Date()
    }]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed top-4 right-4 z-50 w-6 h-6 text-white hover:text-gray-300 transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'right-80' : ''
        }`}
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Chat Sidebar */}
      <div className={`fixed top-0 right-0 h-full component-surface border-l component-border shadow-2xl transition-transform duration-300 z-40 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-80`}>
        
        {/* Header */}
        <div className="p-4 border-b component-border bg-gradient-to-r from-gray-800 to-gray-900 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Synexis AI</h3>
                <p className="text-xs text-gray-300">Ask me anything</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearChat}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Clear chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={toggleChat}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 component-surface">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-white text-gray-900 rounded-br-none shadow-lg'
                    : 'bg-gray-700 text-white rounded-bl-none shadow-lg'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 text-right ${
                  message.role === 'user' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 border border-gray-600 rounded-2xl rounded-bl-none px-4 py-3 shadow-lg">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs text-gray-300 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t component-border component-surface flex-shrink-0">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about ML models..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[60px] shadow-lg"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;