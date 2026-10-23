import {
  ChatMessage,
  MemoryItem,
  TaskItem,
  ReminderItem,
  DailyRoutine,
  VoiceSettings,
  ModelSettings,
  PrivacySettings,
  UserProfile,
} from '../types/assistant';

const KEYS = {
  MESSAGES: 'vivek_ai_messages',
  MEMORIES: 'vivek_ai_memories',
  TASKS: 'vivek_ai_tasks',
  REMINDERS: 'vivek_ai_reminders',
  ROUTINES: 'vivek_ai_routines',
  VOICE: 'vivek_ai_voice_settings',
  MODEL: 'vivek_ai_model_settings',
  PRIVACY: 'vivek_ai_privacy_settings',
  PROFILE: 'vivek_ai_profile',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'User',
  nickname: 'Dost',
  preferredLanguage: 'auto',
  responseStyle: 'balanced',
  reducedMotion: false,
  theme: 'dark',
};

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  ttsEngine: 'gemini',
  geminiVoice: 'Zephyr',
  browserVoiceURI: '',
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoSpeak: true,
  wakeWordEnabled: false,
  wakeWord: 'Hey Vivek',
  autoLanguage: true,
  preferredLanguage: 'auto',
};

const DEFAULT_MODEL_SETTINGS: ModelSettings = {
  provider: 'gemini',
  model: 'gemini-3.8-flash',
  temperature: 0.7,
};

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  memoryEnabled: true,
  localEncryption: true,
  shareDiagnostics: false,
};

const DEFAULT_ROUTINES: DailyRoutine[] = [
  {
    id: 'routine-morning',
    type: 'morning',
    title: 'Morning Check-in & Motivation',
    time: '08:30',
    enabled: true,
    description: 'Fresh greeting, weather check, and reviewing top 3 priorities for today in Hinglish/English.',
  },
  {
    id: 'routine-tasks',
    type: 'tasks',
    title: 'Midday Focus & Task Review',
    time: '14:00',
    enabled: true,
    description: 'Quick check-in on pending goals, hydration reminder, and energetic boost.',
  },
  {
    id: 'routine-reflection',
    type: 'reflection',
    title: 'Evening Wind-down & Reflection',
    time: '21:30',
    enabled: true,
    description: 'Reviewing achievements, unwinding, and preparing a calm mind for tomorrow.',
  },
];

const DEFAULT_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-seed-1',
    role: 'user',
    content: 'आज मेरा मूड थोड़ा खराब हैं...',
    timestamp: '10:24 AM',
  },
  {
    id: 'msg-seed-2',
    role: 'assistant',
    content:
      'ओह... क्या हुआ? अगर तुम बताना चाहो, मैं सुन सकता हूँ। चाहो तो हम मिलकर कोई समाधान भी सोच सकते हैं। तुम अकेले नहीं हो, मैं हूँ ना।',
    timestamp: '10:25 AM',
    avatarState: 'empathetic',
  },
  {
    id: 'msg-seed-3',
    role: 'user',
    content: 'धन्यवाद Vivek 🙂',
    timestamp: '10:26 AM',
  },
  {
    id: 'msg-seed-4',
    role: 'assistant',
    content:
      'हमेशा, दोस्त ❤️ चलो, अब कुछ अच्छा सुनते हैं... तुम्हारा कोई पसंदीदा गाना चलाऊँ?',
    timestamp: '10:26 AM',
    avatarState: 'happy',
  },
];

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'goal',
    fact: 'Career Growth, Financial Freedom',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem-2',
    category: 'preference',
    fact: 'Tech, AI, Cricket, Music',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem-3',
    category: 'personal',
    fact: 'Important People: Family, Friends',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem-4',
    category: 'personal',
    fact: 'Shared Moments: Travel, College Days',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem-5',
    category: 'preference',
    fact: 'Preferences: Hindi, Dark Theme, Male Voice',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'AI Project Review',
    priority: 'high',
    dueDate: 'Today 10:00 AM',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Meeting with Team',
    priority: 'medium',
    dueDate: 'Today 12:30 PM',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Workout',
    priority: 'medium',
    dueDate: 'Today 6:00 PM',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Buy Groceries',
    priority: 'low',
    dueDate: 'Tomorrow 9:00 AM',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Read a Book',
    priority: 'low',
    dueDate: 'Tomorrow 8:00 PM',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const StorageService = {
  // Messages
  getMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(KEYS.MESSAGES);
      return data ? JSON.parse(data) : DEFAULT_INITIAL_MESSAGES;
    } catch {
      return DEFAULT_INITIAL_MESSAGES;
    }
  },
  saveMessages(messages: ChatMessage[]) {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  },
  clearMessages() {
    localStorage.removeItem(KEYS.MESSAGES);
  },

  // Memories
  getMemories(): MemoryItem[] {
    try {
      const data = localStorage.getItem(KEYS.MEMORIES);
      return data ? JSON.parse(data) : DEFAULT_MEMORIES;
    } catch {
      return DEFAULT_MEMORIES;
    }
  },
  saveMemories(memories: MemoryItem[]) {
    localStorage.setItem(KEYS.MEMORIES, JSON.stringify(memories));
  },
  addMemory(fact: string, category: MemoryItem['category'] = 'personal'): MemoryItem {
    const list = this.getMemories();
    const item: MemoryItem = {
      id: 'mem-' + Date.now(),
      category,
      fact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(item);
    this.saveMemories(list);
    return item;
  },
  deleteMemory(id: string) {
    const list = this.getMemories().filter((m) => m.id !== id);
    this.saveMemories(list);
  },
  clearMemories() {
    localStorage.removeItem(KEYS.MEMORIES);
  },

  // Tasks
  getTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },
  saveTasks(tasks: TaskItem[]) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },
  addTask(title: string, priority: TaskItem['priority'] = 'medium', dueDate?: string): TaskItem {
    const list = this.getTasks();
    const item: TaskItem = {
      id: 'task-' + Date.now(),
      title,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(item);
    this.saveTasks(list);
    return item;
  },
  toggleTask(id: string) {
    const list = this.getTasks().map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    this.saveTasks(list);
  },
  deleteTask(id: string) {
    const list = this.getTasks().filter((t) => t.id !== id);
    this.saveTasks(list);
  },

  // Reminders
  getReminders(): ReminderItem[] {
    try {
      const data = localStorage.getItem(KEYS.REMINDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveReminders(reminders: ReminderItem[]) {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  },
  addReminder(reminderText: string, timeStr: string): ReminderItem {
    const list = this.getReminders();
    const item: ReminderItem = {
      id: 'rem-' + Date.now(),
      reminderText,
      timeStr,
      dismissed: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(item);
    this.saveReminders(list);
    return item;
  },
  dismissReminder(id: string) {
    const list = this.getReminders().map((r) => (r.id === id ? { ...r, dismissed: true } : r));
    this.saveReminders(list);
  },

  // Routines
  getRoutines(): DailyRoutine[] {
    try {
      const data = localStorage.getItem(KEYS.ROUTINES);
      return data ? JSON.parse(data) : DEFAULT_ROUTINES;
    } catch {
      return DEFAULT_ROUTINES;
    }
  },
  saveRoutines(routines: DailyRoutine[]) {
    localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },
  toggleRoutine(id: string) {
    const list = this.getRoutines().map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    this.saveRoutines(list);
  },

  // Settings & Profile
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },
  saveProfile(profile: UserProfile) {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getVoiceSettings(): VoiceSettings {
    try {
      const data = localStorage.getItem(KEYS.VOICE);
      return data ? { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(data) } : DEFAULT_VOICE_SETTINGS;
    } catch {
      return DEFAULT_VOICE_SETTINGS;
    }
  },
  saveVoiceSettings(settings: VoiceSettings) {
    localStorage.setItem(KEYS.VOICE, JSON.stringify(settings));
  },

  getModelSettings(): ModelSettings {
    try {
      const data = localStorage.getItem(KEYS.MODEL);
      return data ? { ...DEFAULT_MODEL_SETTINGS, ...JSON.parse(data) } : DEFAULT_MODEL_SETTINGS;
    } catch {
      return DEFAULT_MODEL_SETTINGS;
    }
  },
  saveModelSettings(settings: ModelSettings) {
    localStorage.setItem(KEYS.MODEL, JSON.stringify(settings));
  },

  getPrivacySettings(): PrivacySettings {
    try {
      const data = localStorage.getItem(KEYS.PRIVACY);
      return data ? { ...DEFAULT_PRIVACY_SETTINGS, ...JSON.parse(data) } : DEFAULT_PRIVACY_SETTINGS;
    } catch {
      return DEFAULT_PRIVACY_SETTINGS;
    }
  },
  savePrivacySettings(settings: PrivacySettings) {
    localStorage.setItem(KEYS.PRIVACY, JSON.stringify(settings));
  },

  // Export / Import
  exportAllData(): string {
    const dump = {
      exportedAt: new Date().toISOString(),
      app: 'Vivek AI Assistant',
      version: '1.0.0',
      profile: this.getProfile(),
      voiceSettings: this.getVoiceSettings(),
      modelSettings: this.getModelSettings(),
      privacySettings: this.getPrivacySettings(),
      memories: this.getMemories(),
      tasks: this.getTasks(),
      reminders: this.getReminders(),
      routines: this.getRoutines(),
      messages: this.getMessages(),
    };
    return JSON.stringify(dump, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) this.saveProfile(data.profile);
      if (data.voiceSettings) this.saveVoiceSettings(data.voiceSettings);
      if (data.modelSettings) this.saveModelSettings(data.modelSettings);
      if (data.privacySettings) this.savePrivacySettings(data.privacySettings);
      if (data.memories) this.saveMemories(data.memories);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.reminders) this.saveReminders(data.reminders);
      if (data.routines) this.saveRoutines(data.routines);
      if (data.messages) this.saveMessages(data.messages);
      return true;
    } catch {
      return false;
    }
  },

  resetAllData() {
    localStorage.clear();
  },
};
