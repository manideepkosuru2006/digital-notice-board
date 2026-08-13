// Text-To-Speech SpeechSynthesizer for accessibility

class TTSManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.speakingId = null;
  }

  speak(text, noticeId, onEndCallback) {
    if (!this.synth) {
      alert("Text-to-Speech is not supported in your browser.");
      return;
    }

    // If already speaking this notice, pause or stop
    if (this.speakingId === noticeId && this.synth.speaking) {
      this.stop();
      if (onEndCallback) onEndCallback();
      return;
    }

    // Stop any existing speech
    this.stop();

    // Clean text for speech
    const cleanText = text.replace(/[*_#]/g, '');
    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance.rate = 1.0;
    this.currentUtterance.pitch = 1.0;

    // Pick a clear English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) {
      this.currentUtterance.voice = preferredVoice;
    }

    this.speakingId = noticeId;

    this.currentUtterance.onend = () => {
      this.speakingId = null;
      if (onEndCallback) onEndCallback();
    };

    this.currentUtterance.onerror = (err) => {
      console.error("Speech synthesis error:", err);
      this.speakingId = null;
      if (onEndCallback) onEndCallback();
    };

    this.synth.speak(this.currentUtterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.speakingId = null;
    }
  }

  isSpeaking(noticeId) {
    return this.speakingId === noticeId && this.synth && this.synth.speaking;
  }
}

export const tts = new TTSManager();
