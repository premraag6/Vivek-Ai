import React from 'react';
import { ArrowLeft, MoreVertical, PhoneOff, Mic, Grid, Square } from 'lucide-react';
import { AvatarState, VoiceSettings } from '../../types/assistant';
import { JarvisReactor } from '../HUD/JarvisReactor';

interface VoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  avatarState: AvatarState;
  isListening: boolean;
  isSpeaking: boolean;
  amplitude: number;
  liveTranscript: string;
  lastReply: string;
  voiceSettings: VoiceSettings;
  onStartListening: () => void;
  onStopListening: () => void;
  onInterruptSpeech: () => void;
  onReplaySpeech: () => void;
  onUpdateLanguage: (lang: 'auto' | 'hinglish' | 'hindi' | 'english') => void;
  onUpdateVoiceEngine: (engine: 'gemini' | 'browser') => void;
}

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  isOpen,
  onClose,
  avatarState,
  isListening,
  isSpeaking,
  amplitude,
  liveTranscript,
  lastReply,
  voiceSettings,
  onStartListening,
  onStopListening,
  onInterruptSpeech,
  onUpdateLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030919] text-slate-100 flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn border-2 border-cyan-500/30">
      {/* Top Header matching reference image: "<- Voice Conversation  ..." */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto py-2 border-b border-cyan-500/20">
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
        </button>

        <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
          Voice Conversation
        </h2>

        <button
          onClick={() =>
            onUpdateLanguage(
              voiceSettings.preferredLanguage === 'hindi'
                ? 'hinglish'
                : voiceSettings.preferredLanguage === 'hinglish'
                ? 'english'
                : 'hindi'
            )
          }
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Toggle Language"
        >
          <MoreVertical className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* Center: The Massive Arc Reactor & Hindi Prompts */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center my-auto">
        <JarvisReactor
          state={avatarState}
          isListening={isListening}
          isSpeaking={isSpeaking}
          amplitude={amplitude}
          onToggleMic={isListening ? onStopListening : onStartListening}
          onInterrupt={onInterruptSpeech}
        />

        {/* Hindi conversational subtitle from reference image */}
        <div className="mt-4 px-4 py-2 rounded-2xl bg-slate-950/60 border border-cyan-500/30 backdrop-blur-md max-w-xs">
          {liveTranscript ? (
            <p className="text-xs sm:text-sm font-semibold text-cyan-300 animate-pulse">
              "{liveTranscript}"
            </p>
          ) : lastReply ? (
            <p className="text-xs text-slate-300 line-clamp-3">
              "{lastReply}"
            </p>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-cyan-200">
              आप कुछ कहना चाहते हैं?
            </p>
          )}
        </div>
      </div>

      {/* Bottom Controls matching reference image: [Red End]  [Big Mic]  [Keypad More] */}
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto w-full pb-4">
        <div className="flex items-center justify-center gap-8 w-full px-6">
          {/* Red End Call Button */}
          <button
            onClick={() => {
              onInterruptSpeech();
              onClose();
            }}
            className="p-4 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] transform active:scale-95 transition-all flex items-center justify-center"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Primary Glowing Mic Button */}
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`p-6 rounded-full shadow-[0_0_25px_rgba(0,240,255,0.7)] transition-all transform active:scale-95 border-2 ${
              isListening
                ? 'bg-cyan-400 text-slate-950 border-white ring-4 ring-cyan-400/40 animate-pulse'
                : 'bg-gradient-to-tr from-cyan-600 to-blue-700 text-white border-cyan-300'
            }`}
            title="Toggle Mic"
          >
            <Mic className="w-8 h-8" />
          </button>

          {/* More Keypad Button */}
          <button
            onClick={() =>
              onUpdateLanguage(
                voiceSettings.preferredLanguage === 'hindi' ? 'english' : 'hindi'
              )
            }
            className="p-4 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 transform active:scale-95 transition-all flex items-center justify-center"
            title="Language & Options"
          >
            <Grid className="w-6 h-6" />
          </button>
        </div>

        {/* Footer Language Indicators from reference image */}
        <div className="flex items-center gap-3 text-xs text-cyan-300/80 font-medium tracking-wide">
          <span className={voiceSettings.preferredLanguage === 'hindi' ? 'text-cyan-300 font-bold underline' : ''}>
            Hindi
          </span>
          <span>•</span>
          <span className={voiceSettings.preferredLanguage === 'english' ? 'text-cyan-300 font-bold underline' : ''}>
            English
          </span>
          <span>•</span>
          <span className={voiceSettings.preferredLanguage === 'hinglish' || voiceSettings.preferredLanguage === 'auto' ? 'text-cyan-300 font-bold underline' : ''}>
            Hinglish
          </span>
        </div>
      </div>
    </div>
  );
};
