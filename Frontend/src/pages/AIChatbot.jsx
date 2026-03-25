import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const exampleQueries = [
  'What is Section 420 IPC?',
  'What happens after filing an FIR?',
  'How long does a civil case take?',
  'What are my rights during arrest?',
];

const mockResponses = {
  'What is Section 420 IPC?':
    'Section 420 of the Indian Penal Code (IPC) deals with cheating and dishonestly inducing delivery of property. It is a criminal offense punishable with imprisonment up to seven years and a fine.',
  'What happens after filing an FIR?':
    'After filing an FIR, the police will register the complaint and begin investigation. They may call you for statements, collect evidence, and if enough evidence is found, file a charge sheet in court.',
  'How long does a civil case take?':
    'Civil cases in India can take anywhere from 1-5 years on average, depending on the complexity of the case, court backlog, and whether appeals are filed. Complex cases may take even longer.',
  'What are my rights during arrest?':
    'During arrest, you have the right to know the reason for arrest, right to remain silent, right to legal representation, right to be informed about bail, and right to be examined by a doctor.',
};

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
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', text: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = mockResponses[inputMessage] ||
        "I understand your question. For specific legal advice, I recommend consulting with a qualified lawyer. You can search for specialized lawyers using our 'Find Lawyers' feature.";

      setMessages((prev) => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleExampleClick = (query) => {
    setInputMessage(query);
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

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
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
                      <p className="text-sm leading-relaxed">{message.text}</p>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-slate-500"
        >
          Note: This AI assistant provides general legal information. For specific legal advice, please consult a qualified lawyer.
        </motion.div>
      </div>
    </div>
  );
}
