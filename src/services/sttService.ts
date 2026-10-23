export interface STTOptions {
  language?: string;
  continuous?: boolean;
  wakeWordEnabled?: boolean;
  wakeWord?: string;
}

class STTService {
  private recognition: any = null;
  private isListeningInternal: boolean = false;
  private shouldKeepListening: boolean = false;

  public onResult?: (transcript: string, isFinal: boolean) => void;
  public onListeningChange?: (listening: boolean) => void;
  public onError?: (error: string) => void;
  public onWakeWordDetected?: () => void;

  public get isListening(): boolean {
    return this.isListeningInternal;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  public start(options: STTOptions = {}): boolean {
    if (!this.isSupported()) {
      this.onError?.('Speech recognition is not supported in this browser. Please use Chrome or Android WebView.');
      return false;
    }

    this.stop();

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = options.continuous !== false;
      this.recognition.interimResults = true;

      // Determine speech recognition language
      const lang = options.language || 'en-IN';
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'auto' ? 'en-IN' : lang;

      this.shouldKeepListening = true;

      this.recognition.onstart = () => {
        this.isListeningInternal = true;
        this.onListeningChange?.(true);
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk;
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim();

        // Check wake word if enabled
        if (options.wakeWordEnabled && options.wakeWord) {
          const lower = combined.toLowerCase();
          const target = options.wakeWord.toLowerCase();
          if (lower.includes(target) || lower.includes('vivek')) {
            this.onWakeWordDetected?.();
          }
        }

        if (finalTranscript) {
          this.onResult?.(finalTranscript, true);
        } else if (interimTranscript) {
          this.onResult?.(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          // Normal timeout on silence, ignore
          return;
        }
        if (event.error === 'not-allowed') {
          this.onError?.('Microphone permission denied. Please allow microphone access in browser or Android settings.');
          this.shouldKeepListening = false;
        } else {
          this.onError?.(`Speech error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListeningInternal = false;
        this.onListeningChange?.(false);

        // Auto restart if continuous mode requested and not manually stopped
        if (this.shouldKeepListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Can happen if restarted too quickly
          }
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.onError?.(err.message || 'Failed to initialize speech recognition');
      return false;
    }
  }

  public stop() {
    this.shouldKeepListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }
    this.isListeningInternal = false;
    this.onListeningChange?.(false);
  }
}

export const sttService = new STTService();
