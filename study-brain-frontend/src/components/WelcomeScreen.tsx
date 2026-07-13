import { motion } from 'framer-motion';
import { Sparkles, FileText, MessageSquare, Zap, Shield } from 'lucide-react';
import { UI_TEXT } from '../constants';

const features = [
  {
    icon: FileText,
    title: 'تحلیل اسناد PDF',
    desc: 'فایل‌های PDF خود را آپلود کنید و سوالاتتان را بپرسید.',
    color: 'from-purple-500/20 to-purple-700/10',
    border: 'border-purple-500/20',
    iconColor: 'text-[#A089E6]',
    iconBg: 'bg-[#A089E6]/10',
  },
  {
    icon: MessageSquare,
    title: 'مکالمه هوشمند',
    desc: 'با مدل زبانی پیشرفته گوگل جمینی در فارسی مکالمه کنید.',
    color: 'from-blue-500/20 to-blue-700/10',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
  },
  {
    icon: Shield,
    title: 'حریم خصوصی شما',
    desc: 'اطلاعات شما هرگز ذخیره نمی‌شود. همه‌چیز محلی است.',
    color: 'from-green-500/20 to-green-700/10',
    border: 'border-green-500/20',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-400/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export function WelcomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center flex-1 px-6 text-center py-12"
    >
      {/* Icon + glow */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8"
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 blur-3xl bg-[#A089E6]/15 rounded-full scale-[2]" />
        {/* Pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-3xl bg-[#A089E6]/20"
        />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#A089E6] to-[#271A58] flex items-center justify-center shadow-2xl shadow-purple-500/40">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold mb-3"
        dir="rtl"
      >
        <span className="gradient-text">{UI_TEXT.WELCOME_TITLE}</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-[#A0A0A0] text-base sm:text-lg mb-12 max-w-md leading-relaxed"
        dir="rtl"
      >
        {UI_TEXT.WELCOME_SUBTITLE}
      </motion.p>

      {/* Feature cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full"
      >
        {features.map((feat) => (
          <motion.div
            key={feat.title}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`bg-gradient-to-br ${feat.color} border ${feat.border} rounded-2xl p-5 text-right cursor-default hover:shadow-lg transition-shadow duration-300`}
          >
            <div
              className={`w-10 h-10 rounded-xl ${feat.iconBg} flex items-center justify-center mb-3 mr-auto ml-0`}
            >
              <feat.icon className={`w-5 h-5 ${feat.iconColor}`} />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1.5" dir="rtl">
              {feat.title}
            </h3>
            <p className="text-[#A0A0A0] text-xs leading-relaxed" dir="rtl">
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-10 flex items-center gap-2 text-[#A0A0A0]/40 text-xs"
        dir="rtl"
      >
        <Zap className="w-3 h-3" />
        <span>با بارگذاری PDF شروع کنید</span>
      </motion.div>
    </motion.div>
  );
}
