
import { Message } from "@/types/chat";

// Load messages from localStorage
export function loadMessagesFromLocalStorage(): Message[] {
  try {
    const saved = localStorage.getItem('chatMessages');
    return saved
      ? JSON.parse(saved, (key, value) =>
          key === 'timestamp' ? new Date(value) : value
        )
      : [
          {
            id: 1,
            text: "Welcome to SpeakEasyAI! I'm your public speaking assistant, ready to help you become a more confident and effective speaker.\n\nI can help you:\n- Structure your speeches\n- Integrate personal stories\n- Improve your delivery\n- Practice with voice recognition and get detailed feedback\n- Build confidence techniques\n\nTry the voice button to record a practice segment and receive analysis on your pace, filler words, and delivery. How would you like to enhance your speaking skills today?",
            sender: "bot",
            timestamp: new Date(),
            read: true
          },
        ];
  } catch (error) {
    console.error("Error loading chat messages from localStorage:", error);
    return [
      {
        id: 1,
        text: "Welcome to SpeakEasyAI! I'm your public speaking assistant. How can I help you improve your speaking skills today?",
        sender: "bot",
        timestamp: new Date(),
        read: true
      },
    ];
  }
}

// Save messages to localStorage
export function saveMessagesToLocalStorage(messages: Message[]): void {
  try {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving chat messages to localStorage:", error);
  }
}
