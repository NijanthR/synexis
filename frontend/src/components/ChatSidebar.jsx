import { useState, useRef, useEffect } from 'react';

const ChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem('synexis.chat.messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed.map((item) => ({
            role: item.role,
            content: item.content,
            timestamp: item.timestamp ? new Date(item.timestamp) : new Date()
          }));
        }
      }
    } catch (error) {
      // ignore storage errors
    }
    return [
      {
        role: 'model',
        content: 'Hello! I\'m Gojo.',
        timestamp: new Date()
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMathResultRef = useRef(null);

  const formatMathResult = (value) => {
    if (!Number.isFinite(value)) return null;
    return Number.isInteger(value) ? value.toString() : value.toString();
  };

  const computeBinary = (left, op, right) => {
    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
      case 'x':
        return left * right;
      case '/':
        return right === 0 ? null : left / right;
      default:
        return null;
    }
  };

  const evaluateExpression = (expression) => {
    const sanitized = expression.replace(/\s+/g, '');
    if (!sanitized) return null;
    if (!/^[0-9+\-*/x.]+$/.test(sanitized)) return null;

    const tokens = sanitized.match(/-?\d+(?:\.\d+)?|[+\-*/x]/g);
    if (!tokens || !tokens.length) return null;

    const numbers = [];
    const operators = [];
    const precedence = (op) => (op === '+' || op === '-') ? 1 : 2;
    const applyTop = () => {
      const op = operators.pop();
      const right = numbers.pop();
      const left = numbers.pop();
      if (left === undefined || right === undefined || !op) return null;
      const result = computeBinary(left, op, right);
      if (result === null) return null;
      numbers.push(result);
      return result;
    };

    for (const token of tokens) {
      if (/^[+\-*/x]$/.test(token)) {
        while (operators.length && precedence(operators[operators.length - 1]) >= precedence(token)) {
          const applied = applyTop();
          if (applied === null) return null;
        }
        operators.push(token);
      } else {
        const value = Number(token);
        if (Number.isNaN(value)) return null;
        numbers.push(value);
      }
    }

    while (operators.length) {
      const applied = applyTop();
      if (applied === null) return null;
    }

    return numbers.length === 1 ? numbers[0] : null;
  };

  const findLastNumberInHistory = (history) => {
    for (let i = history.length - 1; i >= 0; i -= 1) {
      const content = history[i]?.content;
      if (typeof content !== 'string') continue;
      const matches = content.match(/-?\d+(?:\.\d+)?/g);
      if (matches && matches.length) {
        const last = matches[matches.length - 1];
        const value = Number(last);
        if (!Number.isNaN(value)) return value;
      }
    }
    return null;
  };

  const getLocalMathResponse = (text, history) => {
    const normalized = text.trim().toLowerCase();
    if (!normalized) return null;

    if (/\b(what\s+is\s+the\s+result|result\?|what\s+is\s+it|what\s+is\s+the\s+answer)\b/.test(normalized)) {
      let base = lastMathResultRef.current;
      if (!Number.isFinite(base)) {
        base = findLastNumberInHistory(history);
      }
      if (!Number.isFinite(base)) return null;
      return formatMathResult(base);
    }

    const expressionResult = evaluateExpression(normalized);
    if (expressionResult !== null) {
      lastMathResultRef.current = expressionResult;
      return formatMathResult(expressionResult);
    }

    const directMatch = normalized.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/x])\s*(-?\d+(?:\.\d+)?)/);
    if (directMatch) {
      const left = Number(directMatch[1]);
      const op = directMatch[2];
      const right = Number(directMatch[3]);
      const result = computeBinary(left, op, right);
      if (result === null) return 'Cannot divide by 0.';
      lastMathResultRef.current = result;
      return formatMathResult(result);
    }

    const opMatch = normalized.match(/\b(add|plus|subtract|subract|substract|minus|multiply|times|divide)\b\s*(?:by\s*)?(-?\d+(?:\.\d+)?)/);
    if (opMatch) {
      const opWord = opMatch[1];
      const value = Number(opMatch[2]);
      if (Number.isNaN(value)) return null;

      let base = lastMathResultRef.current;
      if (!Number.isFinite(base)) {
        base = findLastNumberInHistory(history);
      }
      if (!Number.isFinite(base)) return null;

      let op = null;
      if (opWord === 'add' || opWord === 'plus') op = '+';
      if (opWord === 'subtract' || opWord === 'subract' || opWord === 'substract' || opWord === 'minus') op = '-';
      if (opWord === 'multiply' || opWord === 'times') op = '*';
      if (opWord === 'divide') op = '/';

      const result = computeBinary(base, op, value);
      if (result === null) return 'Cannot divide by 0.';
      lastMathResultRef.current = result;
      return formatMathResult(result);
    }

    return null;
  };

  const normalizeForMatch = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const scoreOverlap = (query, target) => {
    if (!query || !target) return 0;
    const queryTokens = new Set(query.split(' '));
    if (!queryTokens.size) return 0;
    const targetTokens = new Set(target.split(' '));
    let overlap = 0;
    for (const token of queryTokens) {
      if (targetTokens.has(token)) overlap += 1;
    }
    return overlap / queryTokens.size;
  };

  const isMathIntent = (text) => {
    return /\b(add|plus|subtract|subract|substract|minus|multiply|times|divide|sum|total|result|answer|calculate)\b/.test(text) ||
      /[+\-*/x]/.test(text);
  };

  const getCachedResponse = (text, history) => {
    const normalized = normalizeForMatch(text);
    if (!normalized) return null;

    if (/\b(last answer|previous answer|previous response|last response|what did you say|what did you tell)\b/.test(normalized)) {
      for (let i = history.length - 1; i >= 0; i -= 1) {
        if (history[i]?.role === 'model' && typeof history[i].content === 'string') {
          return history[i].content;
        }
      }
    }

    let bestScore = 0;
    let bestAnswer = null;
    for (let i = 0; i < history.length - 1; i += 1) {
      const current = history[i];
      const next = history[i + 1];
      if (current?.role !== 'user' || next?.role !== 'model') continue;
      if (typeof current.content !== 'string' || typeof next.content !== 'string') continue;
      const currentNorm = normalizeForMatch(current.content);
      if (!currentNorm) continue;
      const scoreForward = scoreOverlap(normalized, currentNorm);
      const scoreBackward = scoreOverlap(currentNorm, normalized);
      const score = Math.min(scoreForward, scoreBackward);
      if (score > bestScore) {
        bestScore = score;
        bestAnswer = next.content;
      }
    }

    if (bestScore >= 0.45) {
      const trimmedAnswer = typeof bestAnswer === 'string' ? bestAnswer.trim() : '';
      const isNumericOnly = /^-?\d+(?:\.\d+)?$/.test(trimmedAnswer);
      if (isNumericOnly && !isMathIntent(normalized)) {
        return null;
      }
      return bestAnswer;
    }

    return null;
  };

  const getLastUserMessage = (history) => {
    for (let i = history.length - 1; i >= 0; i -= 1) {
      if (history[i]?.role === 'user' && typeof history[i].content === 'string') {
        return history[i].content.trim();
      }
    }
    return null;
  };

  const getPronounFollowupResponse = (text, history) => {
    const normalized = normalizeForMatch(text);
    if (!normalized) return null;
    if (!/\b(it|that|this|they|them)\b/.test(normalized)) return null;

    const lastUserMessage = getLastUserMessage(history);
    if (!lastUserMessage) return null;

    if (/\bhow to\b/.test(normalized)) {
      return `Do you want steps for ${lastUserMessage}? If so, say: "how to make ${lastUserMessage}".`;
    }

    return `Do you mean: ${lastUserMessage}? Please clarify.`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    try {
      const payload = messages.map((item) => ({
        role: item.role,
        content: item.content,
        timestamp: item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp
      }));
      sessionStorage.setItem('synexis.chat.messages', JSON.stringify(payload));
    } catch (error) {
      // ignore storage errors
    }
  }, [messages]);

  // Call backend chat endpoint (backend uses same URL + API key)
  const getAIResponse = async (userMessage, conversation, clientCache) => {
    let response;

    try {
      response = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          messages: conversation.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          client_cache: clientCache || null,
        }),
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
      const backendDetails = data?.details ? ` ${data.details}` : '';
      throw new Error(`${backendMessage}${backendDetails}`.trim());
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
    
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');

    setIsLoading(true);

    try {
      const localMathResponse = getLocalMathResponse(messageText, messages);
      const cachedResponse = getCachedResponse(messageText, messages);
      const followupResponse = getPronounFollowupResponse(messageText, messages);
      const lastUserMessage = getLastUserMessage(messages);

      const clientCache = {
        local_math: localMathResponse || null,
        cached_match: cachedResponse || null,
        followup_suggestion: followupResponse || null,
        last_user_message: lastUserMessage || null,
      };

      const aiResponse = await getAIResponse(messageText, nextMessages, clientCache);
      
      const assistantMessage = {
        role: 'model',
        content: aiResponse,
        timestamp: new Date()
      };
      const possibleNumber = Number(aiResponse);
      if (!Number.isNaN(possibleNumber)) {
        lastMathResultRef.current = possibleNumber;
      }
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
    lastMathResultRef.current = null;
    setMessages([{
      role: 'model',
      content: 'Hello! I\'m Gojo. Ask me anything about your Synexis ML projects.',
      timestamp: new Date()
    }]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        style={{ color: 'var(--app-text)' }}
        className={`fixed top-4 right-4 z-50 w-6 h-6 hover:opacity-80 transition-all duration-300 flex items-center justify-center ${
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
        <div className="p-4 border-b component-border component-surface flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Gojo</h3>
                <p className="text-xs" style={{ color: 'var(--app-text)', opacity: 0.7 }}>
                  Ask me anything
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearChat}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-black/10"
                style={{ color: 'var(--app-text)' }}
                title="Clear chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={toggleChat}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-black/10"
                style={{ color: 'var(--app-text)' }}
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
                    ? 'bg-blue-600 text-white rounded-br-none shadow-lg'
                    : 'component-surface border component-border rounded-bl-none shadow-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 text-right ${
                  message.role === 'user' ? 'text-blue-100' : ''
                }`}>
                  <span style={message.role === 'user' ? undefined : { color: 'var(--app-text)', opacity: 0.7 }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="component-surface border component-border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs ml-2" style={{ color: 'var(--app-text)', opacity: 0.7 }}>
                    AI is thinking...
                  </span>
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
              className="flex-1 px-3 py-2 component-surface border component-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400"
              style={{ color: 'var(--app-text)' }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[60px] shadow-lg"
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