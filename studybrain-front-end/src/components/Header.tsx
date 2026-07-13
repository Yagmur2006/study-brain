import { motion } from 'framer-motion';
import { Menu, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TEXT } from '../constants';
import { truncateText } from '../utils';

export function Header() {
  const { toggleSidebar, activeConversation, createNewConversation } = useApp();

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-4 py-3 border-b border-[#2C303D] bg-[#0E1017]/80 backdrop-blur-sm flex-shrink-0"
    >
      {/* Right - Logo (visible on mobile) */}
      <div className="flex items-center gap-2">
        <div className="lg:hidden w-8 h-8 rounded-xl bg-gradient-to-br from-[#A089E6] to-[#271A58] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="lg:hidden text-white font-semibold text-sm">{UI_TEXT.APP_NAME}</span>
      </div>

      {/* Center - Conversation title */}
      <div className="absolute left-1/2 -translate-x-1/2">
        {activeConversation && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#A0A0A0] text-sm hidden sm:block"
          >
            {truncateText(activeConversation.title, 40)}
          </motion.span>
        )}
      </div>

      {/* Left - Actions */}
      <div className="flex items-center gap-2">
        {/* New Chat (mobile) */}
        <button
          onClick={() => createNewConversation()}
          className="lg:hidden p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors"
          title={UI_TEXT.NEW_CHAT}
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Toggle Sidebar */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors"
          title="باز کردن تاریخچه"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </motion.header>
  );
}
