import { VoiceSettings } from '../types/assistant';

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingInternal: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;

  public onAmplitudeChange?: (amplitude: number) => void;
  public onStateChange?: (speaking: boolean) => void;

  public get isSpeaking(): boolean {
    return this.isSpeakingInternal;
  }

  public async speak(text: string, settings: VoiceSettings): Promise<void> {
    this.stop();

    if (!text || !text.trim()) return;

    // Clean markdown/symbols from text for natural speech
    const cleanText = text
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    this.isSpeakingInternal = true;
    this.onStateChange?.(true);

    if (settings.ttsEngine === 'gemini') {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voiceName: settings.geminiVoice || 'Zephyr',
            style: 'Friendly, caring natural conversational Indian personal assistant',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audioBase64) {
            await this.playBase64Wav(data.audioBase64, settings);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini TTS server call failed, falling back to browser speech synthesis:', err);
      }
    }

    // Fallback to Web Speech API
    this.speakWithBrowserSynthesis(cleanText, settings);
  }

  private playBase64Wav(base64: string, settings: VoiceSettings): Promise<void> {
    return new Promise((resolve) => {
      const audioUrl = `data:audio/wav;base64,${base64}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.playbackRate = settings.rate || 1.0;
      audio.volume = Math.max(0, Math.min(1, settings.volume || 1.0));

      // Audio analysis for avatar mouth movement
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          const source = this.audioContext.createMediaElementSource(audio);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 64;
          source.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);

          this.startAmplitudeLoop();
        }
      } catch (e) {
        // AudioContext source may fail on some browsers due to CORS or reuse
      }

      audio.onended = () => {
        this.cleanupAudio();
        resolve();
      };

      audio.onerror = () => {
        this.cleanupAudio();
        resolve();
      };

      audio.play().catch(() => {
        this.cleanupAudio();
        resolve();
      });
    });
  }

  private speakWithBrowserSynthesis(text: string, settings: VoiceSettings) {
    if (!('speechSynthesis' in window)) {
      this.isSpeakingInternal = false;
      this.onStateChange?.(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.rate = settings.rate || 1.0;
    utterance.pitch = settings.pitch || 1.0;
    utterance.volume = settings.volume || 1.0;

    // Choose appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (settings.browserVoiceURI) {
        const selected = voices.find((v) => v.voiceURI === settings.browserVoiceURI);
        if (selected) utterance.voice = selected;
      }

      if (!utterance.voice) {
        // Try to match Indian English or Hindi if preferred
        const indianVoice = voices.find(
          (v) =>
            v.lang.includes('hi-IN') ||
            v.lang.includes('en-IN') ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('hindi')
        );
        if (indianVoice) {
          utterance.voice = indianVoice;
        }
      }
    }

    // Simulated amplitude pulse for Web Speech
    let fakeInterval: any = null;
    utterance.onstart = () => {
      fakeInterval = setInterval(() => {
        if (this.onAmplitudeChange) {
          const simulatedAmp = 0.3 + Math.random() * 0.7;
          this.onAmplitudeChange(simulatedAmp);
        }
      }, 100);
    };

    utterance.onend = () => {
      if (fakeInterval) clearInterval(fakeInterval);
      this.cleanupAudio();
    };

    utterance.onerror = () => {
      if (fakeInterval) clearInterval(fakeInterval);
      this.cleanupAudio();
    };

    window.speechSynthesis.speak(utterance);
  }

  private startAmplitudeLoop() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      if (!this.analyser || !this.isSpeakingInternal) return;
      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalized = Math.min(1, avg / 128);

      this.onAmplitudeChange?.(normalized);
      this.animationFrameId = requestAnimationFrame(update);
    };

    this.animationFrameId = requestAnimationFrame(update);
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    this.cleanupAudio();
  }

  private cleanupAudio() {
    this.isSpeakingInternal = false;
    this.onStateChange?.(false);
    this.onAmplitudeChange?.(0);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

export const ttsService = new TTSService();
