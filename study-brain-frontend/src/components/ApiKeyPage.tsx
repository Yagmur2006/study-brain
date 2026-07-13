import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Key, ExternalLink, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { UI_TEXT, TOAST_MESSAGES } from '../constants';

export function ApiKeyPage() {
  const { login } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKey.trim();

    if (!trimmed) {
      toast.error(TOAST_MESSAGES.API_KEY_REQUIRED);
      return;
    }

    // Basic format check — Gemini keys start with "AIza" and are ~39 chars
    // We intentionally do NOT make a network call here; wrong keys will surface
    // on the first chat message with a clear error from the Gemini SDK.
    if (trimmed.length < 20) {
      toast.error('کلید API باید حداقل ۲۰ کاراکتر باشد.');
      return;
    }

    login(trimmed);
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-700/8 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-3/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass border border-[#2C303D] rounded-3xl p-8 shadow-2xl shadow-black/50">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A089E6] to-[#271A58] flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#A089E6] flex items-center justify-center">
                <Key className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-white mb-2">{UI_TEXT.API_KEY_TITLE}</h1>
            <p className="text-[#A0A0A0] text-sm leading-relaxed">{UI_TEXT.API_KEY_SUBTITLE}</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                {UI_TEXT.API_KEY_LABEL}
              </label>
              <div className="relative">
                {/* key icon on visual-right (LTR input, so physical left) */}
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={UI_TEXT.API_KEY_PLACEHOLDER}
                  className="w-full bg-[#0E1017] border border-[#2C303D] rounded-xl py-3 pl-10 pr-10 text-white placeholder-[#A0A0A0]/40 text-sm focus:outline-none focus:border-[#A089E6] transition-colors duration-200 font-mono"
                  dir="ltr"
                  autoComplete="off"
                  spellCheck={false}
                />
                {/* eye icon on visual-left (physical right for LTR) */}
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="w-full bg-gradient-to-r from-[#A089E6] to-[#7c6bc4] hover:from-[#b09af0] hover:to-[#8b7ad4] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{UI_TEXT.API_KEY_CONTINUE}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </motion.form>

          {/* Google AI Studio link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#A089E6] hover:text-[#c4b5fd] text-sm transition-colors duration-200 group"
            >
              <span>{UI_TEXT.API_KEY_GET}</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[#A0A0A0]/35 text-xs mt-5"
        >
          کلید API شما فقط در مرورگر شما ذخیره می‌شود و هرگز به سرور ارسال نمی‌شود.
        </motion.p>
      </motion.div>
    </div>
  );
}
