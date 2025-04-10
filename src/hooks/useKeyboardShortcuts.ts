
import { useEffect } from "react";

type ShortcutHandlers = {
  onVoiceToggle: () => void;
  onSummarize: () => void;
};

export function useKeyboardShortcuts({ onVoiceToggle, onSummarize }: ShortcutHandlers) {
  useEffect(() => {
    // Setup keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+V for voice toggle
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        onVoiceToggle();
      }
      // Ctrl+S for summarize
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSummarize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onVoiceToggle, onSummarize]);
}
