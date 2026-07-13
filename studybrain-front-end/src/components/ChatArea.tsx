import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { MessageBubble } from './MessageBubble';
import { WelcomeScreen } from './WelcomeScreen';
import { ChatInput } from './ChatInput';

export function ChatArea() {
  const { activeConversation } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = activeConversation?.messages ?? [];

  const lastMessageContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, lastMessageContent]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages / Welcome area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col min-h-full"
            >
              <WelcomeScreen />
            </motion.div>
          ) : (
            <motion.div
              key={`messages-${activeConversation?.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto px-4 py-6 space-y-6"
            >
              {messages.map((msg, idx) => (
                <MessageBubble key={msg.id} message={msg} index={idx} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area - always at bottom */}
      <div className="flex-shrink-0 pb-6 pt-3 border-t border-[#2C303D]/50">
        <ChatInput />
      </div>
    </div>
  );
}
