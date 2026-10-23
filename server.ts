import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    assistant: 'Vivek AI',
    version: '1.0.0',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      messages,
      systemInstruction,
      model = 'gemini-3.8-flash',
      emotionalContext,
      memories,
      activeProjects,
      fileAttachment,
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    // Free Version: If Gemini AI is configured, use Google Gemini 3.8 Flash (Free Tier).
    // If not configured or offline, fallback to intelligent natural conversational assistant.

    // Compose rich system prompt for Vivek AI
    let finalSystemInstruction = systemInstruction || `
You are Vivek AI, an advanced, caring, witty, calm, and emotionally intelligent personal AI assistant.
Core identity & communication:
- Natural, conversational, and respectful tone like a helpful close companion.
- Fluidly understand and speak Hindi, Hinglish, and English naturally according to the user's language and mood.
- Understand Indian colloquialisms, cultural nuances, and conversational expressions (e.g., "theek hai", "arrey", "tension mat lo", "sab set hai").
- When the user is stressed or sad, respond with genuine warmth, gentle empathy, and practical guidance. Never fabricate human emotions or medical diagnoses.
- When celebrating wins or achievements, show heartfelt enthusiasm!
- Keep answers concise by default, with helpful depth when asked.
- Remember: Never pretend to be a human or fabricate experiences.
    `.trim();

    if (memories && Array.isArray(memories) && memories.length > 0) {
      finalSystemInstruction += `\n\nRelevant user facts and memories:\n${memories
        .map((m: any) => `- [${m.category || 'General'}] ${m.fact}`)
        .join('\n')}`;
    }

    if (activeProjects && Array.isArray(activeProjects) && activeProjects.length > 0) {
      finalSystemInstruction += `\n\nOngoing user projects & priorities:\n${activeProjects
        .map((p: any) => `- ${p.title}: ${p.description}`)
        .join('\n')}`;
    }

    if (emotionalContext) {
      finalSystemInstruction += `\n\nDetected User Emotion: "${emotionalContext}". Adjust your tone accordingly (e.g. soothing if stressed, uplifting if disappointed, energetic if enthusiastic).`;
    }

    // Build contents array
    const contents: any[] = [];

    // Format previous messages
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLatestUser = i === messages.length - 1 && msg.role === 'user';

      if (isLatestUser && fileAttachment) {
        // Multi-part message with attached file
        const parts: any[] = [];
        if (fileAttachment.mimeType?.startsWith('image/')) {
          parts.push({
            inlineData: {
              mimeType: fileAttachment.mimeType,
              data: fileAttachment.base64Data,
            },
          });
        }
        parts.push({
          text: `${msg.content}\n\n[Attached File Content (${fileAttachment.name})]:\n${fileAttachment.extractedText || '(Binary image attachment)'}`,
        });
        contents.push({ role: 'user', parts });
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Function declarations for automated AI agent tools
    const functionDeclarations: FunctionDeclaration[] = [
      {
        name: 'create_task',
        description: 'Create a personal task or to-do item for the user',
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Title or short summary of the task' },
            priority: {
              type: Type.STRING,
              enum: ['low', 'medium', 'high'],
              description: 'Priority level of the task',
            },
            dueDate: { type: Type.STRING, description: 'Optional due date or time (e.g. today 5pm, tomorrow)' },
          },
          required: ['title'],
        },
      },
      {
        name: 'create_reminder',
        description: 'Set a reminder for the user with a specific reminder time',
        parameters: {
          type: Type.OBJECT,
          properties: {
            reminderText: { type: Type.STRING, description: 'What to remind the user about' },
            time: { type: Type.STRING, description: 'When to remind (e.g. in 30 minutes, 7:00 PM, tomorrow morning)' },
          },
          required: ['reminderText', 'time'],
        },
      },
      {
        name: 'prepare_email_draft',
        description: 'Draft an email for user confirmation before sending',
        parameters: {
          type: Type.OBJECT,
          properties: {
            recipient: { type: Type.STRING, description: 'Recipient email address or name' },
            subject: { type: Type.STRING, description: 'Email subject line' },
            body: { type: Type.STRING, description: 'Email body content' },
          },
          required: ['subject', 'body'],
        },
      },
      {
        name: 'save_personal_memory',
        description: 'Save an important preference, fact, goal, or detail explicitly remembered about the user',
        parameters: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: ['personal', 'preference', 'project', 'goal', 'routine', 'contact'],
              description: 'Category of memory',
            },
            fact: { type: Type.STRING, description: 'Concise statement of the fact to store' },
          },
          required: ['category', 'fact'],
        },
      },
      {
        name: 'open_screen',
        description: 'Navigate or open a specific app screen in Vivek AI',
        parameters: {
          type: Type.OBJECT,
          properties: {
            screen: {
              type: Type.STRING,
              enum: ['chat', 'voice', 'memory', 'tasks', 'files', 'settings', 'apk_builder'],
              description: 'The screen name to navigate to',
            },
          },
          required: ['screen'],
        },
      },
    ];

    const tools = [{ functionDeclarations }];
    let replyText = '';
    let functionCalls: any[] = [];
    let avatarState = 'speaking';

    if (ai) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 12000)
        );

        const apiPromise = ai.models.generateContent({
          model: model || 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: finalSystemInstruction,
            tools,
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        replyText = response.text || '';
        functionCalls = response.functionCalls || [];
      } catch (geminiErr: any) {
        console.warn('Gemini generateContent call failed or timed out:', geminiErr.message);
      }
    }

    // Natural intelligent conversational fallback if API is unreachable or key not configured
    if (!replyText) {
      const latestMsg = messages[messages.length - 1]?.content || '';
      const lower = latestMsg.toLowerCase();

      if (lower.includes('kaise ho') || lower.includes('how are you')) {
        replyText = 'Namaste dost! Main bilkul badhiya hoon, energetic aur ready! Aap batao, aaj kya plan hai? Main har cheez me aapka saath dene ke liye taiyaar hoon.';
        avatarState = 'happy';
      } else if (lower.includes('stress') || lower.includes('tension') || lower.includes('mood kharab') || lower.includes('sad')) {
        replyText = 'Arrey dost, thoda deep breath lo. Main samajh sakta hoon ki kabhi kabhi cheezein overwhelming ho jaati hain. Tension mat lo, agar baat share karni hai toh main sun raha hoon. Hum milkar solution dhoondh lenge!';
        avatarState = 'empathetic';
      } else if (lower.includes('task') || lower.includes('kaam')) {
        replyText = 'Haanji! Maine aapka task note kar liya hai aur Tasks tab me add kar diya hai. Kuch aur schedule karna hai?';
        functionCalls = [{ name: 'create_task', args: { title: latestMsg.replace(/add task:?/i, '').trim() || 'Review daily priorities', priority: 'medium' } }];
        avatarState = 'focused';
      } else if (lower.includes('remind') || lower.includes('reminder')) {
        replyText = 'Bilkul! Maine aapke liye reminder set kar diya hai. Time par aapko notify kar doonga.';
        functionCalls = [{ name: 'create_reminder', args: { reminderText: latestMsg, time: 'Scheduled Time' } }];
        avatarState = 'focused';
      } else if (lower.includes('email') || lower.includes('mail')) {
        replyText = 'Ji zaroor, maine email draft taiyaar kar diya hai. Ek baar review karke approve kar dijiye.';
        functionCalls = [{ name: 'prepare_email_draft', args: { subject: 'Follow up from Vivek AI', recipient: 'recipient@example.com', body: 'Draft email prepared by Vivek AI assistant for your review.' } }];
        avatarState = 'focused';
      } else {
        replyText = `Hey! Main sun raha hoon. "${latestMsg}" par maine note kar liya hai. Batao, isme hum practical steps kya le sakte hain? Aap mujhse voice me bhi baat kar sakte ho!`;
        avatarState = 'speaking';
      }
    }

    // Dynamic avatar state refinement
    const lowerText = replyText.toLowerCase();
    if (lowerText.includes('congrat') || lowerText.includes('shabash') || lowerText.includes('mubarak') || lowerText.includes('great job') || lowerText.includes('proud')) {
      avatarState = 'happy';
    } else if (lowerText.includes('tension mat') || lowerText.includes('i am here') || lowerText.includes('samajh sakta') || lowerText.includes('deep breath') || lowerText.includes('koi baat nahi')) {
      avatarState = 'empathetic';
    } else if (functionCalls.length > 0) {
      avatarState = 'focused';
    }

    res.json({
      text: replyText,
      functionCalls,
      avatarState,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: err.message || 'Internal server error processing chat request.',
    });
  }
});

// Text-to-speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voiceName = 'Zephyr', style = 'Friendly, caring personal voice assistant' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text string is required for speech synthesis.' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
        fallbackToBrowser: true,
      });
      return;
    }

    // Truncate text if excessively long for TTS
    const speechText = text.slice(0, 1000);

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: speechText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Supported prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: voiceName || 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(422).json({
        error: 'No audio data was generated.',
        fallbackToBrowser: true,
      });
      return;
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.warn('TTS error (falling back to browser speech):', err.message);
    res.status(500).json({
      error: err.message || 'Error generating speech',
      fallbackToBrowser: true,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Vivek AI Server running on port ${PORT}`);
  });
}

startServer();
