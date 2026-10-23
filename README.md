# Vivek AI — Advanced Personal AI Assistant

An intelligent, empathetic, and witty personal AI assistant featuring natural Hindi/Hinglish/English voice conversations, proactive memory, task automation, document chat, and an automated GitHub Actions Android APK build pipeline.

---

## 🌟 Key Features

1. **Multilingual Indian Conversational Persona**
   - Natural, emotionally intelligent dialogue across Hindi, Hinglish, and English.
   - Understands colloquialisms, pauses, warmth, and user nicknames.
   - Adaptive empathy: offers calm encouragement when stressed, celebrates achievements with enthusiasm.

2. **Real-time Natural Voice System**
   - Speech-to-Text with continuous listening and wake-word support ("Hey Vivek").
   - Server-side high-fidelity Gemini 3.8 Neural TTS (`gemini-3.8-flash-lite-tts`) with instant fallback to browser speech synthesis.
   - Interactive visual waveforms and instant interrupt controls.

3. **Proactive Memory & Personalization**
   - Retains user preferences, ongoing projects, goals, and facts across conversations.
   - Complete **Memory-Off** mode for privacy.
   - Separate control to wipe conversation history while retaining memories.
   - Full data export (JSON backup) and local-first encryption ready.

4. **Task Automation & Daily Check-ins**
   - Built-in to-do management with priority flags and confetti celebrations.
   - Smart reminders with snooze and browser notification integration.
   - Scheduled daily routines: Morning Greeting, Midday Focus, and Evening Reflection.

5. **Document & Data Intelligence**
   - Upload TXT, CSV, JSON, Markdown, and image files (up to 10MB).
   - Generates executive briefs, parses data tables, and answers targeted questions.

6. **Automated Android APK Build Pipeline**
   - Real, native Android project under `/android` (`com.vivekai.assistant`).
   - Pre-configured GitHub Actions CI/CD workflow at `.github/workflows/android.yml`.
   - Compiles debug APK on every push or manual dispatch and uploads it as a downloadable artifact.

---

## 🚀 Step-by-Step Publishing & Build Guide

### Phase A — Google AI Studio Development
1. Open this project in **Google AI Studio**.
2. If your Gemini API key is not yet set, navigate to **Settings > Secrets** and add `GEMINI_API_KEY`.
3. The server automatically initializes Gemini 3.8 Flash for intelligent chat and Gemini TTS for natural voice.
4. Test chat, voice synthesis, task creation, and memories in the preview browser.

---

### Phase B — Export to GitHub & Automatic APK Build
> **Important Note:** GitHub Pages is only for static websites and **cannot** compile Android APKs. APK builds are handled automatically via **GitHub Actions**.

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Vivek AI personal assistant with Android APK pipeline"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vivek-ai.git
   git push -u origin main
   ```
2. **Open the Actions Tab in GitHub**:
   - Navigate to your repository on GitHub.
   - Click on the **Actions** tab at the top.
   - Select **Build Vivek AI Android APK** from the workflows list on the left.
3. **Run the Workflow**:
   - Click **Run workflow** → select the `main` branch → click **Run workflow**.
   - The workflow will automatically:
     - Install dependencies and build the web bundle (`npm run build`).
     - Copy the web distribution assets into `android/app/src/main/assets/public/`.
     - Configure Java 17 (Temurin) and Android SDK 34.
     - Execute `./gradlew assembleDebug`.
     - Upload the compiled `Vivek-AI-debug-APK` as a GitHub Actions artifact.
4. **Download the APK**:
   - Once the workflow run turns green (takes ~2 minutes), click on the completed run.
   - Scroll down to the **Artifacts** section at the bottom.
   - Download **`Vivek-AI-debug-APK.zip`** and extract `app-debug.apk`.

---

### Phase C — Install & Test on Android Device
1. Transfer `app-debug.apk` to your Android device via USB, Google Drive, or by downloading it directly from GitHub in Chrome on your phone.
2. Tap the APK file to install. If prompted, enable **"Allow from this source"** in your phone's Android security settings.
3. Launch **Vivek AI**.
4. When prompted, grant **Microphone** and **Notification** permissions so Vivek can hear your voice and trigger reminders.

---

### Phase D — Production Release Signing
1. Generate your production keystore locally:
   ```bash
   keytool -genkey -v -keystore vivek-release.jks -alias vivekai -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Base64-encode the keystore and add it to your GitHub Repository Secrets:
   - `SIGNING_KEY`: Base64 string of `vivek-release.jks`
   - `KEY_ALIAS`: `vivekai`
   - `KEY_PASSWORD`: Keystore key password
   - `STORE_PASSWORD`: Keystore store password
3. Never commit raw `.jks` files or signing passwords to git.

---

## 🛠 Project Architecture

```
/
├── .github/
│   └── workflows/
│       └── android.yml            # CI/CD Android APK build workflow
├── android/                       # Native Android Project
│   ├── app/
│   │   ├── build.gradle           # compileSdk 34, namespace com.vivekai.assistant
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # RECORD_AUDIO, POST_NOTIFICATIONS, INTERNET
│   │       ├── java/com/vivekai/assistant/
│   │       │   ├── MainActivity.kt # WebView + WebChromeClient permission bridge
│   │       │   ├── VivekApp.kt     # Application class & notification channels
│   │       │   └── VivekVoiceBridge.kt # JavaScript native bridge interface
│   │       └── res/                # App icon drawables, styles, strings
│   ├── build.gradle               # Root Gradle project
│   ├── settings.gradle            # Settings
│   └── gradlew                    # Executable Gradle wrapper
├── src/                           # React + TypeScript Frontend
│   ├── components/
│   │   ├── Avatar/                # VivekAvatar (dynamic face, eyes, voice mouth)
│   │   ├── Chat/                  # Chat bubbles, tool cards, input area
│   │   ├── Voice/                 # Full-screen Voice mode & Audio waveforms
│   │   ├── Memory/                # Proactive Memory management & export
│   │   ├── Tasks/                 # Tasks, Reminders, and Daily Routines
│   │   ├── DocumentChat/          # Document summarizer & table extractor
│   │   ├── Settings/              # Persona, voice selection, model router
│   │   └── Android/               # Built-in APK build guide modal
│   ├── services/
│   │   ├── aiService.ts           # Emotion detection & server communication
│   │   ├── ttsService.ts          # Gemini TTS & Web Speech fallback
│   │   ├── sttService.ts          # Continuous speech recognition & wake-word
│   │   └── storageService.ts      # Local persistent storage & backup
│   ├── types/                     # TypeScript definitions
│   └── App.tsx                    # Main assistant orchestration
├── server.ts                      # Full-stack Express server with Gemini SDK
└── package.json
```

---

## 🔒 Privacy & Security

- **Local Storage by Default**: User memories, tasks, and conversation history are kept locally in the browser or Android WebView storage.
- **Memory-Off Mode**: Can be toggled with one click in the Memory tab whenever confidential topics are discussed.
- **Server-Side API Security**: Gemini API calls are made exclusively on the server (`server.ts`). Secrets are never embedded inside the client APK.
