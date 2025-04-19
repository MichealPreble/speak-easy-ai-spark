
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import NoMessages from "./NoMessages";
import LoadingIndicator from "./LoadingIndicator";

interface ChatMessagesProps {
  messages: Message[];
  visibleMessages: Message[];
  isDarkMode: boolean;
  showTypingIndicator: boolean;
  clearFilters: () => void;
}

const ChatMessages = ({
  messages,
  visibleMessages,
  isDarkMode,
  showTypingIndicator,
  clearFilters
}: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      {messages.length === 0 ? (
        <NoMessages isSearching={false} />
      ) : visibleMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p>No messages match your filters</p>
          <Button 
            variant="link" 
            onClick={clearFilters}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        visibleMessages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isDarkMode={isDarkMode}
          />
        ))
      )}
      
      {showTypingIndicator && (
        <LoadingIndicator isDarkMode={isDarkMode} />
      )}
    </ScrollArea>
  );
};

export default ChatMessages;
