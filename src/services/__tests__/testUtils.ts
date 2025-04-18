
import { Message } from "@/types/chat";

export const mockMessage: Message = {
  id: 1,
  text: "Test message",
  sender: "user",
  timestamp: new Date("2025-04-18"),
  read: true
};

export const mockMessages: Message[] = [
  mockMessage,
  {
    id: 2,
    text: "Another test message",
    sender: "bot",
    timestamp: new Date("2025-04-18"),
    read: false
  }
];
