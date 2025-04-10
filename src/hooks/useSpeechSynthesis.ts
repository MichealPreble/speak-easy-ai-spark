
export function useSpeechSynthesis() {
  // Text-to-speech for bot responses
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Clean text from markdown for better speech
      const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1')
                           .replace(/\*(.*?)\*/g, '$1')
                           .replace(/`(.*?)`/g, '$1');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return { speak };
}
