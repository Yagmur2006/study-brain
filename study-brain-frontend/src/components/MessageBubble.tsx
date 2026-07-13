import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, User, FileText, Image } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import type { ChatMessage } from '../types';
import { TOAST_MESSAGES } from '../constants';
import { formatFileSize, formatTime } from '../utils';
import 'katex/dist/katex.min.css';

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#A089E6]"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

interface CodeBlockProps {
  language: string;
  children: string;
}

function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-[#2C303D]">
      <div className="flex items-center justify-between bg-[#0a0a12] px-4 py-2 border-b border-[#2C303D]">
        <span className="text-xs text-[#A0A0A0] font-mono">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-white transition-colors"
        >
          {copied ? (
            <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">کپی شد</span></>
          ) : (
            <><Copy className="w-3 h-3" /><span>کپی</span></>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: '#0a0a12',
          padding: '1rem',
          fontSize: '0.82rem',
          direction: 'ltr',
          textAlign: 'left',
        }}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success(TOAST_MESSAGES.COPY_SUCCESS);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A089E6]/30 to-[#271A58]/60 border border-[#A089E6]/20 flex items-center justify-center">
            <User className="w-4 h-4 text-[#A089E6]" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A089E6] to-[#271A58] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sent attachments */}
        {message.files && message.files.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {message.files.map((file) => {
              const isPdf = file.mimeType === 'application/pdf';
              const fileUrl = `data:${file.mimeType};base64,${file.data}`;

              return isPdf ? (
                <a
                  key={file.id}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.name}
                  className="flex items-center gap-2 max-w-[230px] rounded-xl px-3 py-2 bg-[#A089E6]/10 border border-[#A089E6]/25 hover:bg-[#A089E6]/20 transition-colors"
                  title="باز کردن فایل PDF"
                >
                  <FileText className="w-5 h-5 flex-shrink-0 text-[#A089E6]" />
                  <span className="min-w-0 text-right">
                    <span className="block truncate text-xs font-medium text-white">{file.name}</span>
                    <span className="block text-[10px] text-[#A089E6]/70">PDF · {formatFileSize(file.size)}</span>
                  </span>
                </a>
              ) : (
                <a
                  key={file.id}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.name}
                  className="block rounded-xl overflow-hidden border border-blue-400/25 bg-blue-400/10 hover:border-blue-400/50 transition-colors"
                  title="باز کردن تصویر"
                >
                  <img
                    src={fileUrl}
                    alt={file.name}
                    className="block max-w-[220px] max-h-40 w-auto object-contain"
                  />
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-blue-300" dir="rtl">
                    <Image className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="flex-shrink-0 text-blue-300/60">{formatFileSize(file.size)}</span>
                  </span>
                </a>
              );
            })}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-[#A089E6]/20 to-[#271A58]/40 border border-[#A089E6]/20 text-white'
              : 'bg-[#1C1C1C] border border-[#2C303D] text-[#e2e8f0]'
          }`}
        >
          {/* Loading / streaming indicator */}
          {message.isLoading && !message.content ? (
            <TypingIndicator />
          ) : (
            <>
              {isUser ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap" dir="rtl">
                  {message.content}
                </p>
              ) : (
                <div className="prose-dark text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        if (!isInline && match) {
                          return (
                            <CodeBlock language={match[1]}>
                              {String(children).replace(/\n$/, '')}
                            </CodeBlock>
                          );
                        }
                        return (
                          <code
                            className="bg-[#A089E6]/15 text-[#A089E6] px-1.5 py-0.5 rounded text-xs font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      p({ children }) {
                        return <p className="mb-2 last:mb-0" dir="rtl">{children}</p>;
                      },
                      ul({ children }) {
                        return <ul className="list-disc pr-5 mb-2 space-y-0.5" dir="rtl">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal pr-5 mb-2 space-y-0.5" dir="rtl">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="text-sm" dir="rtl">{children}</li>;
                      },
                      h1({ children }) {
                        return <h1 className="text-xl font-bold text-white mb-2 mt-3" dir="rtl">{children}</h1>;
                      },
                      h2({ children }) {
                        return <h2 className="text-lg font-bold text-white mb-2 mt-3" dir="rtl">{children}</h2>;
                      },
                      h3({ children }) {
                        return <h3 className="text-base font-semibold text-white mb-1.5 mt-2" dir="rtl">{children}</h3>;
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-r-2 border-[#A089E6] pr-3 text-[#A0A0A0] my-2 italic" dir="rtl">
                            {children}
                          </blockquote>
                        );
                      },
                      strong({ children }) {
                        return <strong className="font-semibold text-white">{children}</strong>;
                      },
                      table({ children }) {
                        return (
                          <div className="overflow-x-auto my-2">
                            <table className="w-full border-collapse text-sm" dir="rtl">{children}</table>
                          </div>
                        );
                      },
                      th({ children }) {
                        return <th className="border border-[#2C303D] bg-[#A089E6]/10 px-3 py-1.5 text-right font-semibold">{children}</th>;
                      },
                      td({ children }) {
                        return <td className="border border-[#2C303D] px-3 py-1.5 text-right">{children}</td>;
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  {/* Streaming cursor */}
                  {message.isLoading && message.content && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                      className="inline-block w-1.5 h-4 bg-[#A089E6] rounded-sm ml-0.5 align-middle"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions + Time */}
        <div
          className={`flex items-center gap-2 mt-1.5 px-1 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className="text-[10px] text-[#A0A0A0]/40">
            {formatTime(message.timestamp)}
          </span>
          {!isUser && !message.isLoading && message.content && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[10px] text-[#A0A0A0]/60 hover:text-[#A0A0A0] "
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
