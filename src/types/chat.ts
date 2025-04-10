
export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isVoiceMessage?: boolean;
  isFeedback?: boolean;
};
