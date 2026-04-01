import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_URL = 'http://localhost:5000';

const exampleQueries = [
  'What is Section 420 IPC?',
  'What happens after filing an FIR?',
  'How long does a civil case take?',
  'What are my rights during arrest?',
];

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I am your AI Legal Assistant. I can help answer your legal questions. Try asking me about IPC sections, legal procedures, or general legal terms.',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      handleSendDirect(inputMessage);
    }
  };

  const handleExampleClick = (query) => {
    setInputMessage(query);
    // Automatically send the query
    handleSendDirect(query);
  };

  const handleSendDirect = async (queryText) => {
    if (!queryText.trim()) return;

    const userMessage = { type: 'user', text: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log('Sending request to:', `${API_URL}/api/chat`);
      console.log('Question:', queryText);
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: queryText }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setMessages((prev) => [...prev, { type: 'bot', text: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: data.message || 'Sorry, I could not process your request. Please try again.' },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: 'Sorry, I could not connect to the AI service. Please check your connection and try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">AI Legal Assistant</h1>
          </div>
          <p className="text-slate-600">Ask me anything about Indian law and legal procedures</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6">
            <h2 className="text-white font-semibold mb-3">Try asking:</h2>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((query, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExampleClick(query)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors backdrop-blur-sm"
                >
                  {query}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="h-[300px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 ${
                        message.type === 'user'
                          ? 'bg-slate-800'
                          : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold text-slate-900 mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold text-slate-900 mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-medium text-slate-900 mb-1">{children}</h3>,
                            strong: ({children}) => <strong className="font-semibold text-slate-900">{children}</strong>,
                            p: ({children}) => <p className="text-sm leading-relaxed mb-2">{children}</p>,
                            ul: ({children}) => <ul className="list-disc ml-6 mb-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal ml-6 mb-2">{children}</ol>,
                            li: ({children}) => <li className="text-sm">{children}</li>,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your legal question..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
