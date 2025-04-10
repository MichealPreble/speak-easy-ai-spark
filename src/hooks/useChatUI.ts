
import { useRef, useState, useEffect } from "react";
import { Message } from "@/types/chat";

export function useChatUI(messages: Message[]) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableArea) {
        scrollableArea.scrollTop = scrollableArea.scrollHeight;
      }
    }
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input field
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Show typing indicator for a specified duration
  const showTyping = (duration = 2000) => {
    setShowTypingIndicator(true);
    
    // Clear any existing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Set a new timer to hide the indicator after the duration
    typingTimerRef.current = setTimeout(() => {
      setShowTypingIndicator(false);
      typingTimerRef.current = null;
    }, duration);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return {
    inputRef,
    scrollAreaRef,
    scrollToBottom,
    focusInput,
    showTyping,
    showTypingIndicator
  };
}
