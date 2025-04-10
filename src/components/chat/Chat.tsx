
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatSearch from "./ChatSearch";
import LoadingIndicator from "./LoadingIndicator";
import NoMessages from "./NoMessages";

const Chat = () => {
  const {
    filteredMessages,
    input,
    setInput,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    setIsDarkMode,
    inputRef,
    scrollAreaRef,
    handleSend,
    handleClearChat
  } = useChat();

  return (
    <div className="flex flex-col h-[600px] w-full border rounded-lg shadow-md bg-card">
      {/* Chat Header */}
      <ChatHeader 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        onClearChat={handleClearChat} 
      />

      {/* Search Bar */}
      <ChatSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Message List */}
      <ScrollArea className="flex-1 p-4" aria-live="polite" ref={scrollAreaRef}>
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isDarkMode={isDarkMode} 
              />
            ))
          ) : (
            <NoMessages isSearching={searchQuery.trim().length > 0} />
          )}
          
          {isLoading && <LoadingIndicator isDarkMode={isDarkMode} />}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput
        ref={inputRef}
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
};

export default Chat;
