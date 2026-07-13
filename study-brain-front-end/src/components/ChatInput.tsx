import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, ArrowUp, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { useFileUpload } from '../hooks/useFileUpload';
import { useAutoResize } from '../hooks/useAutoResize';
import { FileChip } from './FileChip';
import { UI_TEXT, TOAST_MESSAGES, FILE_LIMITS } from '../constants';

export function ChatInput() {
  const { sendMessage, isLoading, activeConversation } = useApp();
  const [message, setMessage] = useState('');
  const { textareaRef, adjustHeight } = useAutoResize(160);

  const {
    pdfFiles,
    imageFiles,
    allFiles,
    hasPdf,
    addPdfFiles,
    addImageFiles,
    removeFile,
    clearFiles,
    isDraggingPdf,
    pdfInputRef,
    imageInputRef,
    handlePdfDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
  } = useFileUpload();

  // The PDF-first rule is scoped PER CONVERSATION. Once a PDF has been
  // uploaded at any point in the active conversation, the image button and
  // send button stay enabled for every future message in this conversation.
  // Starting a new chat resets the rule (the new conversation has no PDFs).
  const conversationHasPdf = (activeConversation?.pdfFiles?.length ?? 0) > 0;
  const pdfAvailable = hasPdf || conversationHasPdf;

  const canSend = pdfAvailable && (message.trim().length > 0 || imageFiles.length > 0) && !isLoading;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  };

  const handleSend = useCallback(async () => {
    if (!canSend) return;
    const content = message.trim();
    const imagesToSend = [...imageFiles];
    const pdfsToSend = [...pdfFiles];

    setMessage('');
    clearFiles();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(content, imagesToSend, pdfsToSend);
  }, [canSend, message, imageFiles, pdfFiles, sendMessage, clearFiles, textareaRef]);

  const handlePdfButtonClick = () => {
    pdfInputRef.current?.click();
  };

  const handleImageButtonClick = () => {
    if (!pdfAvailable) {
      toast.error(TOAST_MESSAGES.UPLOAD_PDF_FIRST);
      return;
    }
    imageInputRef.current?.click();
  };

  const handlePdfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addPdfFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImageFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">

      {/* Helper text — only when no PDF uploaded yet in this conversation */}
      <AnimatePresence>
        {!pdfAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex items-start gap-2 bg-[#A089E6]/8 border border-[#A089E6]/20 rounded-xl px-4 py-2.5"
          >
            <Paperclip className="w-3.5 h-3.5 text-[#A089E6] flex-shrink-0 mt-0.5" />
            <p className="text-[#A089E6]/80 text-xs leading-relaxed" dir="rtl">
              {UI_TEXT.HELPER_TEXT}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded file chips */}
      <AnimatePresence>
        {allFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-2 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pb-1">
              <AnimatePresence>
                {pdfFiles.map((file) => (
                  <FileChip
                    key={file.id}
                    file={file}
                    isPDF
                    onRemove={() => removeFile(file.id)}
                  />
                ))}
                {imageFiles.map((file) => (
                  <FileChip
                    key={file.id}
                    file={file}
                    onRemove={() => removeFile(file.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main input box ── */}
      <motion.div
        animate={isDraggingPdf ? { scale: 1.01 } : { scale: 1 }}
        onDrop={handlePdfDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative rounded-2xl border transition-all duration-200 ${
          isDraggingPdf
            ? 'border-[#A089E6] bg-[#A089E6]/10 shadow-lg shadow-[#A089E6]/20'
            : 'border-[#2C303D] bg-[#1C1C1C]'
        } shadow-xl shadow-black/30`}
      >
        {/* Drop overlay */}
        <AnimatePresence>
          {isDraggingPdf && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl flex items-center justify-center bg-[#A089E6]/5 z-10 pointer-events-none"
            >
              <p className="text-[#A089E6] font-semibold text-sm">PDF را اینجا رها کنید</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={UI_TEXT.INPUT_PLACEHOLDER}
            disabled={isLoading}
            className="w-full bg-transparent text-white placeholder-[#A0A0A0]/40 text-sm outline-none leading-6 resize-none overflow-hidden disabled:opacity-50"
            style={{ height: '36px', minHeight: '36px', maxHeight: '160px' }}
            dir="rtl"
            rows={1}
          />
        </div>

        {/* ── Toolbar row ── */}
        {/* RTL: items flow right→left, so we use flex-row-reverse to keep
            upload buttons on the visual RIGHT and send button on the visual LEFT */}
        <div className="flex items-center px-3 pb-3 pt-0 gap-2">

          {/* Send button — visually LEFT (flex start in RTL = left side) */}
          <motion.button
            whileHover={canSend ? { scale: 1.08 } : {}}
            whileTap={canSend ? { scale: 0.92 } : {}}
            onClick={handleSend}
            disabled={!canSend}
            title={UI_TEXT.SEND}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
              canSend
                ? 'bg-[#A089E6] hover:bg-[#b09af0] text-white shadow-lg shadow-[#A089E6]/30'
                : 'bg-[#252525] text-[#A0A0A0]/30 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </motion.button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Image upload button — visually RIGHT */}
          <motion.button
            whileHover={pdfAvailable ? { scale: 1.05 } : {}}
            whileTap={pdfAvailable ? { scale: 0.95 } : {}}
            onClick={handleImageButtonClick}
            title={pdfAvailable ? UI_TEXT.UPLOAD_IMAGE : TOAST_MESSAGES.UPLOAD_PDF_FIRST}
            className={`flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all duration-150 ${
              pdfAvailable
                ? 'text-[#A0A0A0] hover:text-blue-400 hover:bg-blue-400/10'
                : 'text-[#A0A0A0]/25 cursor-not-allowed'
            }`}
          >
            <Image className="w-4 h-4 flex-shrink-0" />
            <span>تصویر</span>
          </motion.button>

          {/* PDF upload button — visually far RIGHT */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePdfButtonClick}
            title={UI_TEXT.UPLOAD_PDF}
            className="flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-[#A0A0A0] hover:text-[#A089E6] hover:bg-[#A089E6]/10 transition-all duration-150"
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span>PDF</span>
          </motion.button>

        </div>
      </motion.div>

      {/* Hidden file inputs */}
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={handlePdfInputChange}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept={FILE_LIMITS.ACCEPTED_IMAGE_EXTENSIONS}
        multiple
        className="hidden"
        onChange={handleImageInputChange}
      />

      <p className="text-center text-[#A0A0A0]/25 text-[11px] mt-2" dir="rtl">
        Enter برای ارسال &nbsp;·&nbsp; Shift+Enter برای خط جدید
      </p>
    </div>
  );
}
