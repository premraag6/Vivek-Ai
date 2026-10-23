import { ChatMessage, MemoryItem, TaskItem, UserProfile } from '../types/assistant';

export interface SendMessageOptions {
  messages: ChatMessage[];
  profile: UserProfile;
  memories: MemoryItem[];
  tasks: TaskItem[];
  model?: string;
  fileAttachment?: {
    name: string;
    size: number;
    mimeType: string;
    extractedText?: string;
    base64Data?: string;
  };
}

export interface SendMessageResponse {
  text: string;
  functionCalls?: Array<{
    name: string;
    args: Record<string, any>;
  }>;
  avatarState?: string;
}

export const AIService = {
  detectEmotion(text: string): string | null {
    const lower = text.toLowerCase();
    if (
      lower.includes('mood kharab') ||
      lower.includes('sad') ||
      lower.includes('upset') ||
      lower.includes('depressed') ||
      lower.includes('heartbroken') ||
      lower.includes('rona aa raha')
    ) {
      return 'sad_or_upset';
    }
    if (
      lower.includes('stress') ||
      lower.includes('tension') ||
      lower.includes('anxiety') ||
      lower.includes('overwhelmed') ||
      lower.includes('pressure')
    ) {
      return 'stressed';
    }
    if (
      lower.includes('hurray') ||
      lower.includes('passed') ||
      lower.includes('cracked') ||
      lower.includes('selection') ||
      lower.includes('happy') ||
      lower.includes('khush') ||
      lower.includes('won') ||
      lower.includes('celebrat')
    ) {
      return 'celebratory_happy';
    }
    if (lower.includes('thak gaya') || lower.includes('tired') || lower.includes('exhausted')) {
      return 'tired';
    }
    if (lower.includes('confused') || lower.includes('samajh nahi aa raha') || lower.includes('stuck')) {
      return 'confused';
    }
    return null;
  },

  async sendMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const { messages, profile, memories, tasks, model = 'gemini-3.8-flash', fileAttachment } = options;

    const latestUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const detectedEmotion = latestUserMsg ? this.detectEmotion(latestUserMsg.content) : null;

    // Filter active memories
    const relevantMemories = memories.slice(0, 15);
    const activeTasks = tasks.filter((t) => !t.completed).slice(0, 10);

    const systemInstruction = `
You are Vivek AI, a personal AI assistant built with deep empathy, calm intelligence, warmth, and wit.
User Profile:
- Name: ${profile.name || 'User'}
- Preferred Nickname: ${profile.nickname || 'Dost'}
- Preferred Language: ${profile.preferredLanguage}
- Preferred Response Style: ${profile.responseStyle}

Key Communication Guidelines:
1. Speak naturally in Hindi, Hinglish, or English depending on how the user speaks to you. Blend natural conversational Indian expressions naturally (e.g. "Batao kya baat hai", "Bilkul tension mat lo", "Arrey badhiya!").
2. Emotional Intelligence:
   - If the user is stressed or upset: acknowledge gently, listen without judgment, offer calm practical support.
   - If the user achieved something: celebrate with genuine enthusiasm and praise!
   - Never pretend to have human physical feelings or fabricate memories.
3. Keep responses clean, concise, and structured. Use Markdown bullet points where appropriate.
4. If the user asks you to save a memory, add a task, set a reminder, or draft an email, invoke the respective tool directly!
    `.trim();

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        systemInstruction,
        model,
        emotionalContext: detectedEmotion,
        memories: relevantMemories,
        activeProjects: activeTasks.map((t) => ({ title: t.title, description: `Priority: ${t.priority}` })),
        fileAttachment,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network request failed' }));
      throw new Error(errorData.error || `Server returned ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || '',
      functionCalls: data.functionCalls || [],
      avatarState: data.avatarState || 'speaking',
    };
  },
};
