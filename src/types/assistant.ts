export type AvatarState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'empathetic'
  | 'focused'
  | 'error';

export type UserRole = 'user' | 'assistant' | 'system';

export interface ToolCallExecution {
  name: string;
  args: Record<string, any>;
  result?: string;
  status: 'pending' | 'confirmed' | 'executed' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  role: UserRole;
  content: string;
  timestamp: string;
  avatarState?: AvatarState;
  toolCalls?: ToolCallExecution[];
  fileAttachment?: {
    name: string;
    size: number;
    type: string;
  };
  audioUrl?: string;
}

export interface MemoryItem {
  id: string;
  category: 'personal' | 'preference' | 'project' | 'goal' | 'routine' | 'contact';
  fact: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface ReminderItem {
  id: string;
  reminderText: string;
  timeStr: string;
  triggerTimestamp?: number;
  dismissed: boolean;
  createdAt: string;
}

export interface DailyRoutine {
  id: string;
  type: 'morning' | 'tasks' | 'reflection';
  title: string;
  time: string;
  enabled: boolean;
  description: string;
}

export interface VoiceSettings {
  ttsEngine: 'gemini' | 'browser';
  geminiVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  browserVoiceURI: string;
  rate: number;
  pitch: number;
  volume: number;
  autoSpeak: boolean;
  wakeWordEnabled: boolean;
  wakeWord: string;
  autoLanguage: boolean;
  preferredLanguage: 'auto' | 'hinglish' | 'hindi' | 'english';
}

export interface ModelSettings {
  provider: 'gemini' | 'local';
  model: string;
  temperature: number;
  endpointUrl?: string;
}

export interface PrivacySettings {
  memoryEnabled: boolean;
  localEncryption: boolean;
  shareDiagnostics: boolean;
}

export interface UserProfile {
  name: string;
  nickname: string;
  preferredLanguage: 'auto' | 'hinglish' | 'hindi' | 'english';
  responseStyle: 'balanced' | 'concise' | 'detailed';
  reducedMotion: boolean;
  theme: 'dark' | 'light' | 'system';
}

export type AppTab = 'chat' | 'voice' | 'memory' | 'tasks' | 'files' | 'settings' | 'apk';
