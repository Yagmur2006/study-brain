import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Edit3,
  Check,
  X,
  LogOut,
  ChevronLeft,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UI_TEXT } from '../constants';
import { groupConversationsByDate, truncateText } from '../utils';
import type { Conversation } from '../types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== conversation.title) {
      onRename(trimmed);
    } else {
      setEditTitle(conversation.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setEditTitle(conversation.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-[#A089E6]/15 border border-[#A089E6]/30'
          : 'hover:bg-white/5 border border-transparent'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => !isEditing && onSelect()}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
          isActive ? 'bg-[#A089E6]/20' : 'bg-white/5'
        }`}
      >
        <MessageSquare
          className={`w-3.5 h-3.5 ${isActive ? 'text-[#A089E6]' : 'text-[#A0A0A0]'}`}
        />
      </div>

      {/* Title */}
      {isEditing ? (
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent border-b border-[#A089E6] text-white text-sm outline-none py-0.5 min-w-0"
          dir="rtl"
        />
      ) : (
        <span
          className={`flex-1 text-sm truncate ${isActive ? 'text-white' : 'text-[#A0A0A0]'}`}
        >
          {truncateText(conversation.title, 28)}
        </span>
      )}

      {/* Actions */}
      <AnimatePresence>
        {showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-md text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors"
              title={UI_TEXT.RENAME}
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded-md text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title={UI_TEXT.DELETE}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        )}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleRename}
              className="p-1 rounded-md text-green-400 hover:bg-green-400/10 transition-colors"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                setEditTitle(conversation.title);
                setIsEditing(false);
              }}
              className="p-1 rounded-md text-[#A0A0A0] hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const {
    conversations,
    activeConversationId,
    createNewConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    logout,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groups = groupConversationsByDate(filteredConversations);

  return (
    <div className="flex flex-col h-full border-l border-[#2C303D]" style={{ background: '#151515' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A089E6] to-[#271A58] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">{UI_TEXT.APP_NAME}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => {
            createNewConversation();
            onClose?.();
          }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#A089E6]/20 to-[#271A58]/40 hover:from-[#A089E6]/30 hover:to-[#271A58]/60 border border-[#A089E6]/25 hover:border-[#A089E6]/40 text-white rounded-xl py-2.5 px-4 text-sm font-medium transition-all duration-200 group"
        >
          <Plus className="w-4 h-4 text-[#A089E6] group-hover:rotate-90 transition-transform duration-300" />
          <span>{UI_TEXT.NEW_CHAT}</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A0A0A0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
            className="w-full bg-[#0E1017] border border-[#2C303D] rounded-xl py-2.5 pr-9 pl-3 text-sm text-white placeholder-[#A0A0A0]/50 focus:outline-none focus:border-[#A089E6]/50 transition-colors"
            dir="rtl"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-[#A0A0A0]/50" />
            </div>
            <p className="text-[#A0A0A0] text-sm">{UI_TEXT.NO_CONVERSATIONS}</p>
            <p className="text-[#A0A0A0]/50 text-xs mt-1">گفتگوی جدیدی شروع کنید</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#A0A0A0] text-sm">{UI_TEXT.EMPTY_SEARCH}</p>
          </div>
        ) : (
          <AnimatePresence>
            {groups.map((group) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Clock className="w-3 h-3 text-[#A0A0A0]/50" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A0A0A0]/50">
                    {group.label}
                  </span>
                </div>
                {group.items.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeConversationId}
                    onSelect={() => {
                      selectConversation(conv.id);
                      onClose?.();
                    }}
                    onDelete={() => deleteConversation(conv.id)}
                    onRename={(title) => renameConversation(conv.id, title)}
                  />
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer - Logout */}
      <div className="p-3 border-t border-[#2C303D]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/8 transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-red-400/10 flex items-center justify-center transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-medium">{UI_TEXT.LOGOUT}</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebar } = useApp();

  return (
    <>
      {/* Desktop sidebar - collapsible with width animation */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden h-full"
      >
        <div className="w-[320px] h-full">
          <SidebarContent />
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebar(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-[300px] z-50 lg:hidden"
            >
              <SidebarContent onClose={() => setSidebar(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
