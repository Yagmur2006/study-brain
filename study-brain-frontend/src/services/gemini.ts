import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { Part, Content } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../constants';
import type { ChatMessage, UploadedFile } from '../types';

function createClient(apiKey: string): GoogleGenerativeAI {
  return new GoogleGenerativeAI(apiKey);
}

function buildParts(message: ChatMessage, contextFiles: UploadedFile[]): Part[] {
  const parts: Part[] = [];

  // Add context files (PDFs) as inline data
  for (const file of contextFiles) {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data,
      },
    });
  }

  // Add any message-specific files (images / extra PDFs)
  if (message.files && message.files.length > 0) {
    for (const file of message.files) {
      const alreadyAdded = contextFiles.some((f) => f.id === file.id);
      if (!alreadyAdded) {
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data,
          },
        });
      }
    }
  }

  // Add text last
  if (message.content) {
    parts.push({ text: message.content });
  }

  return parts;
}

export async function sendMessageToGemini(
  apiKey: string,
  userMessage: ChatMessage,
  conversationHistory: ChatMessage[],
  pdfFiles: UploadedFile[],
  onChunk: (chunk: string) => void
): Promise<string> {
  const genAI = createClient(apiKey);

  const model = genAI.getGenerativeModel({
    model: GEMINI_CONFIG.MODEL,
    systemInstruction: GEMINI_CONFIG.SYSTEM_PROMPT,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  // Build history (exclude the current user message)
  const history: Content[] = conversationHistory
    .filter((m) => !m.isLoading)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      // Attach the current PDF context once below instead of duplicating it
      // for every previous user turn.
      parts: buildParts(m, []),
    }));

  const chat = model.startChat({ history });

  const userParts = buildParts(userMessage, pdfFiles);
  const result = await chat.sendMessageStream(userParts);

  let fullText = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;
    onChunk(chunkText);
  }

  return fullText;
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = createClient(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });
    await model.generateContent('سلام');
    return true;
  } catch {
    return false;
  }
}
