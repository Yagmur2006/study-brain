import { motion } from 'framer-motion';
import { FileText, Image, X } from 'lucide-react';
import { formatFileSize } from '../utils';
import type { UploadedFile } from '../types';

interface FileChipProps {
  file: UploadedFile;
  onRemove: () => void;
  isPDF?: boolean;
}

export function FileChip({ file, onRemove, isPDF }: FileChipProps) {
  const isActuallyPDF = isPDF || file.mimeType === 'application/pdf';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-sm max-w-[200px] flex-shrink-0 group ${
        isActuallyPDF
          ? 'bg-[#A089E6]/10 border-[#A089E6]/25 text-[#A089E6]'
          : 'bg-blue-500/10 border-blue-500/25 text-blue-400'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {isActuallyPDF ? (
          <FileText className="w-4 h-4" />
        ) : (
          <Image className="w-4 h-4" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-xs leading-tight" title={file.name}>
          {file.name}
        </p>
        <p className={`text-xs opacity-60 ${isActuallyPDF ? 'text-[#A089E6]' : 'text-blue-400'}`}>
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={`flex-shrink-0 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-white/15 ${
          isActuallyPDF ? 'text-[#A089E6]' : 'text-blue-400'
        }`}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
