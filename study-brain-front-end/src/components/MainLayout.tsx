import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatArea } from './ChatArea';

export function MainLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-screen animated-bg overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar - positioned on right in RTL */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/2 w-[500px] h-[500px] bg-[#A089E6]/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#271A58]/20 rounded-full blur-3xl" />
        </div>

        <Header />

        <div className="flex-1 overflow-hidden relative">
          <ChatArea />
        </div>
      </div>
    </motion.div>
  );
}
