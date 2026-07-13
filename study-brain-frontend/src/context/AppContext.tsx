import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Conversation, ChatMessage, UploadedFile } from '../types';
import {
  getApiKey,
  saveApiKey,
  removeApiKey,
  loadConversations,
  saveConversations,
  loadActiveConversationId,
  saveActiveConversationId,
  generateId,
  generateConversationTitle,
} from '../utils';
import { sendMessageToGemini } from '../services/gemini';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../constants';

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  apiKey: string | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  sidebarOpen: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'CLEAR_API_KEY' }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: Conversation }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'CLEAR_API_KEY':
      return { ...state, apiKey: null, conversations: [], activeConversationId: null };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [action.payload, ...state.conversations] };
    case 'UPDATE_CONVERSATION': {
      const updated = state.conversations.map((c) =>
        c.id === action.payload.id ? action.payload : c
      );
      return { ...state, conversations: updated };
    }
    case 'DELETE_CONVERSATION': {
      const filtered = state.conversations.filter((c) => c.id !== action.payload);
      const newActive =
        state.activeConversationId === action.payload
          ? filtered[0]?.id ?? null
          : state.activeConversationId;
      return { ...state, conversations: filtered, activeConversationId: newActive };
    }
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue extends AppState {
  login: (apiKey: string) => void;
  logout: () => void;
  createNewConversation: () => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  sendMessage: (content: string, files: UploadedFile[], pdfFiles: UploadedFile[]) => Promise<void>;
  activeConversation: Conversation | null;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    apiKey: getApiKey(),
    conversations: loadConversations(),
    activeConversationId: loadActiveConversationId(),
    isLoading: false,
    sidebarOpen: true,
  });

  // Persist conversations
  useEffect(() => {
    saveConversations(state.conversations);
  }, [state.conversations]);

  // Persist active conversation
  useEffect(() => {
    saveActiveConversationId(state.activeConversationId);
  }, [state.activeConversationId]);

  const activeConversation =
    state.conversations.find((c) => c.id === state.activeConversationId) ?? null;

  const login = useCallback((apiKey: string) => {
    saveApiKey(apiKey);
    dispatch({ type: 'SET_API_KEY', payload: apiKey });
    toast.success(TOAST_MESSAGES.API_KEY_SAVED);
  }, []);

  const logout = useCallback(() => {
    removeApiKey();
    saveActiveConversationId(null);
    saveConversations([]);
    dispatch({ type: 'CLEAR_API_KEY' });
    toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
  }, []);

  const createNewConversation = useCallback((): string => {
    const id = generateId();
    const now = Date.now();
    const conversation: Conversation = {
      id,
      title: 'گفتگوی جدید',
      messages: [],
      createdAt: now,
      updatedAt: now,
      pdfFiles: [],
    };
    dispatch({ type: 'ADD_CONVERSATION', payload: conversation });
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: id });
    return id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: id });
  }, []);

  const deleteConversation = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: id });
    toast.success(TOAST_MESSAGES.CONVERSATION_DELETED);
  }, []);

  const renameConversation = useCallback(
    (id: string, newTitle: string) => {
      const conversation = state.conversations.find((c) => c.id === id);
      if (!conversation) return;
      dispatch({
        type: 'UPDATE_CONVERSATION',
        payload: { ...conversation, title: newTitle },
      });
      toast.success(TOAST_MESSAGES.CONVERSATION_RENAMED);
    },
    [state.conversations]
  );

  const sendMessage = useCallback(
    async (content: string, files: UploadedFile[], pdfFiles: UploadedFile[]) => {
      if (!state.apiKey) {
        toast.error('لطفاً ابتدا کلید API را وارد کنید.');
        return;
      }

      // Ensure there's an active conversation
      let conversationId = state.activeConversationId;
      let conversation: Conversation | undefined;

      // Look up existing conversation (if any) — but never bail out silently.
      // If activeConversationId points to a missing conversation (stale localStorage
      // or edge case), fall back to creating a fresh one.
      if (conversationId) {
        conversation = state.conversations.find((c) => c.id === conversationId);
      }

      if (!conversation) {
        const id = generateId();
        const now = Date.now();
        conversation = {
          id,
          title: generateConversationTitle(content) || 'گفتگوی جدید',
          messages: [],
          createdAt: now,
          updatedAt: now,
          pdfFiles: pdfFiles,
        };
        dispatch({ type: 'ADD_CONVERSATION', payload: conversation });
        dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: id });
        conversationId = id;
      } else {
        // Merge any new PDF files into the conversation
        const existingIds = new Set(conversation.pdfFiles.map((f) => f.id));
        const newPdfs = pdfFiles.filter((f) => !existingIds.has(f.id));
        if (newPdfs.length > 0) {
          conversation = { ...conversation, pdfFiles: [...conversation.pdfFiles, ...newPdfs] };
        }
      }

      const userMessageId = generateId();
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content,
        // Keep every attachment on the message so the sent prompt can be
        // rendered exactly as the client submitted it.
        files: [...pdfFiles, ...files],
        timestamp: Date.now(),
      };

      // Add assistant placeholder
      const assistantMessageId = generateId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isLoading: true,
      };

      // Update title if it's the first message
      const isFirstMessage = conversation.messages.length === 0;
      const updatedTitle = isFirstMessage
        ? generateConversationTitle(content) || 'گفتگوی جدید'
        : conversation.title;

      const updatedConversation: Conversation = {
        ...conversation,
        title: updatedTitle,
        messages: [...conversation.messages, userMessage, assistantPlaceholder],
        updatedAt: Date.now(),
        pdfFiles: conversation.pdfFiles,
      };

      dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
      dispatch({ type: 'SET_LOADING', payload: true });

      let accumulatedText = '';

      try {
        const historyMessages = conversation.messages.filter((m) => !m.isLoading);

        await sendMessageToGemini(
          state.apiKey,
          userMessage,
          historyMessages,
          updatedConversation.pdfFiles,
          (chunk: string) => {
            accumulatedText += chunk;
            // Update the assistant message with streaming content
            dispatch({
              type: 'UPDATE_CONVERSATION',
              payload: {
                ...updatedConversation,
                messages: updatedConversation.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedText, isLoading: true }
                    : m
                ),
              },
            });
          }
        );

        // Finalize the assistant message
        dispatch({
          type: 'UPDATE_CONVERSATION',
          payload: {
            ...updatedConversation,
            messages: updatedConversation.messages.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: accumulatedText, isLoading: false }
                : m
            ),
            updatedAt: Date.now(),
          },
        });
      } catch (error) {
        const errorText =
          error instanceof Error ? error.message : 'خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.';

        dispatch({
          type: 'UPDATE_CONVERSATION',
          payload: {
            ...updatedConversation,
            messages: updatedConversation.messages.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: `❌ خطا: ${errorText}`, isLoading: false }
                : m
            ),
            updatedAt: Date.now(),
          },
        });

        toast.error(TOAST_MESSAGES.SEND_ERROR);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.apiKey, state.activeConversationId, state.conversations]
  );

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setSidebar = useCallback((open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open }), []);

  const value: AppContextValue = {
    ...state,
    activeConversation,
    login,
    logout,
    createNewConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    sendMessage,
    toggleSidebar,
    setSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
