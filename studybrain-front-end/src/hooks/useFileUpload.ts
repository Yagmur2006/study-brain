import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { FILE_LIMITS, TOAST_MESSAGES } from '../constants';
import { fileToBase64, generateId, formatFileSize } from '../utils';
import type { UploadedFile } from '../types';

interface UseFileUploadReturn {
  pdfFiles: UploadedFile[];
  imageFiles: UploadedFile[];
  allFiles: UploadedFile[];
  hasPdf: boolean;
  addPdfFiles: (files: FileList | File[]) => Promise<void>;
  addImageFiles: (files: FileList | File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  isDraggingPdf: boolean;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  handlePdfDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnter: () => void;
  handleDragLeave: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [pdfFiles, setPdfFiles] = useState<UploadedFile[]>([]);
  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const hasPdf = pdfFiles.length > 0;
  const allFiles = [...pdfFiles, ...imageFiles];

  const processFile = useCallback(
    async (
      file: File,
      isPdf: boolean
    ): Promise<UploadedFile | null> => {
      const maxSize = isPdf ? FILE_LIMITS.PDF_MAX_SIZE : FILE_LIMITS.IMAGE_MAX_SIZE;

      if (file.size > maxSize) {
        toast.error(TOAST_MESSAGES.TOO_LARGE);
        return null;
      }

      const acceptedTypes = isPdf
        ? FILE_LIMITS.ACCEPTED_PDF_TYPES
        : FILE_LIMITS.ACCEPTED_IMAGE_TYPES;

      if (!acceptedTypes.includes(file.type as 'application/pdf')) {
        toast.error(TOAST_MESSAGES.INVALID_FILE);
        return null;
      }

      try {
        const base64 = await fileToBase64(file);
        return {
          id: generateId(),
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64,
          mimeType: file.type,
        };
      } catch {
        toast.error('خطا در خواندن فایل.');
        return null;
      }
    },
    []
  );

  const addPdfFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const processed: UploadedFile[] = [];

      for (const file of fileArray) {
        const result = await processFile(file, true);
        if (result) {
          processed.push(result);
          toast.success(`${file.name} بارگذاری شد.`);
        }
      }

      if (processed.length > 0) {
        setPdfFiles((prev) => [...prev, ...processed]);
      }
    },
    [processFile]
  );

  const addImageFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!hasPdf) {
        toast.error(TOAST_MESSAGES.UPLOAD_PDF_FIRST);
        return;
      }

      const fileArray = Array.from(files);
      const processed: UploadedFile[] = [];

      for (const file of fileArray) {
        const result = await processFile(file, false);
        if (result) {
          processed.push(result);
          toast.success(`${file.name} بارگذاری شد.`);
        }
      }

      if (processed.length > 0) {
        setImageFiles((prev) => [...prev, ...processed]);
      }
    },
    [hasPdf, processFile]
  );

  const removeFile = useCallback((id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
    setImageFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setPdfFiles([]);
    setImageFiles([]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback(() => {
    setIsDraggingPdf(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingPdf(false);
  }, []);

  const handlePdfDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingPdf(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf'
      );

      if (files.length > 0) {
        addPdfFiles(files);
      } else {
        toast.error('فقط فایل‌های PDF قابل قبول هستند.');
      }
    },
    [addPdfFiles]
  );

  return {
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
  };
}

export { formatFileSize };
