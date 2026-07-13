export type MessageRole = 'user' | 'assistant';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // base64
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  files?: UploadedFile[];
  timestamp: number;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  pdfFiles: UploadedFile[];
}

export interface AppState {
  apiKey: string | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
}

export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface FileChip {
  file: UploadedFile;
  isPDF: boolean;
}
