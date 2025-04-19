
import React from "react";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import { ClearFiltersDialog } from "./ClearFiltersDialog";
import ChatContainer from "./ChatContainer";

interface ChatProps {
  selectedScenario?: string | null;
}

const Chat: React.FC<ChatProps> = ({ selectedScenario }) => {
  const {
    messages,
    filteredMessages,
    input,
    setInput,
    isLoading,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    isVoiceActive,
    isBrowserSupported,
    recordingDuration,
    MAX_RECORDING_SECONDS,
    inputRef,
    scrollAreaRef,
    handleSend,
    handleClearChat,
    toggleVoice,
    toggleDarkMode,
    summarize,
    showTypingIndicator
  } = useChat({ selectedScenario });
  
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterOptions, setFilterOptions] = React.useState({
    showUserMessages: true,
    showBotMessages: true,
    showFeedback: true,
    onlyVoiceMessages: false,
    onlyUnread: false,
  });
  const [showClearFilters, setShowClearFilters] = React.useState(false);
  
  const handleFilterChange = (field: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };
  
  const clearFilters = () => {
    setFilterOptions({
      showUserMessages: true,
      showBotMessages: true,
      showFeedback: true,
      onlyVoiceMessages: false,
      onlyUnread: false,
    });
    setSearchQuery("");
    setShowClearFilters(false);
  };
  
  // Check if any filters are active
  const isFiltersActive = React.useMemo(() => {
    return (
      !filterOptions.showUserMessages ||
      !filterOptions.showBotMessages ||
      !filterOptions.showFeedback ||
      filterOptions.onlyVoiceMessages ||
      filterOptions.onlyUnread ||
      searchQuery.trim().length > 0
    );
  }, [filterOptions, searchQuery]);
  
  // Show clear filters dialog when filters are active
  React.useEffect(() => {
    setShowClearFilters(isFiltersActive);
  }, [isFiltersActive]);
  
  // Handle Enter key in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Apply filters to messages
  const visibleMessages = React.useMemo(() => {
    return (searchQuery.trim().length > 0 ? filteredMessages : messages).filter((message) => {
      if (!filterOptions.showUserMessages && message.sender === "user") return false;
      if (!filterOptions.showBotMessages && message.sender === "bot" && !message.isFeedback) return false;
      if (!filterOptions.showFeedback && message.isFeedback) return false;
      if (filterOptions.onlyVoiceMessages && !message.isVoiceMessage) return false;
      if (filterOptions.onlyUnread && message.read) return false;
      return true;
    });
  }, [messages, filteredMessages, searchQuery, filterOptions]);
  
  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[500px] bg-white dark:bg-zinc-900 border rounded-lg shadow-sm overflow-hidden relative">
      <ChatHeader 
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onClearChat={handleClearChat}
        onShowFilter={() => setIsFilterOpen(true)}
        isVoiceActive={isVoiceActive}
        onToggleVoice={toggleVoice}
        onSummarize={summarize}
      />
      
      <ChatContainer 
        messages={messages}
        visibleMessages={visibleMessages}
        filterOptions={filterOptions}
        handleFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        isFiltersActive={isFiltersActive}
        clearFilters={clearFilters}
        isDarkMode={isDarkMode}
        showTypingIndicator={showTypingIndicator}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        isLoading={isLoading}
        isVoiceActive={isVoiceActive}
        toggleVoice={toggleVoice}
        isBrowserSupported={isBrowserSupported}
        onSummarize={summarize}
        inputRef={inputRef}
        recordingDuration={recordingDuration}
        maxRecordingDuration={MAX_RECORDING_SECONDS}
      />
      
      <ClearFiltersDialog
        open={showClearFilters}
        onOpenChange={setShowClearFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default Chat;
