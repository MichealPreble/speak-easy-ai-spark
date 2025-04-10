
import { useState } from "react";
import { Message } from "@/types/chat";

export function useMessageSearch(messages: Message[]) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter messages based on search query
  const filteredMessages = searchQuery.trim() 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return {
    searchQuery,
    setSearchQuery,
    filteredMessages
  };
}
