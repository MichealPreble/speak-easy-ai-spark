
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSearch from "./ChatSearch";
import NoMessages from "./NoMessages";
import LoadingIndicator from "./LoadingIndicator";
import { MobileFilter } from "./MobileFilter";
import { DesktopFilter } from "./DesktopFilter";
import { ActiveFilterBadges } from "./ActiveFilterBadges";
import { ClearFiltersDialog } from "./ClearFiltersDialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
    toggleDarkMode,
    isVoiceActive,
    isBrowserSupported,
    inputRef,
    scrollAreaRef,
    handleSend,
    handleClearChat,
    toggleVoice,
    summarize,
    showTypingIndicator,
    recordingDuration,
    MAX_RECORDING_SECONDS
  } = useChat({ selectedScenario });
  
  const isMobile = useMediaQuery("(max-width: 768px)");
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
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar filter */}
        {!isMobile && (
          <DesktopFilter
            filterOptions={filterOptions}
            handleFilterChange={handleFilterChange}
          />
        )}
        
        {/* Chat content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and filter badges area */}
          <div className="p-3 border-b bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800">
            <ChatSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              disabled={messages.length === 0}
            />
            
            {isFiltersActive && (
              <ActiveFilterBadges
                filterOptions={filterOptions}
                searchQuery={searchQuery}
                onClearAll={() => setShowClearFilters(true)}
              />
            )}
          </div>
          
          {/* Message list */}
          <ScrollArea 
            ref={scrollAreaRef} 
            className="flex-1 p-4"
          >
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
          
          {/* Input area */}
          <ChatInput
            input={input}
            setInputValue={setInput}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
            isLoading={isLoading}
            isVoiceActive={isVoiceActive}
            toggleVoice={toggleVoice}
            isBrowserSupported={isBrowserSupported}
            onSummarize={summarize}
            ref={inputRef}
            recordingDuration={recordingDuration}
            maxRecordingDuration={MAX_RECORDING_SECONDS}
          />
        </div>
      </div>
      
      {/* Mobile filter dialog */}
      {isMobile && (
        <MobileFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filterOptions={filterOptions}
          handleFilterChange={handleFilterChange}
        />
      )}
      
      {/* Clear filters confirmation */}
      <ClearFiltersDialog
        isOpen={showClearFilters}
        onClose={() => setShowClearFilters(false)}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default Chat;
