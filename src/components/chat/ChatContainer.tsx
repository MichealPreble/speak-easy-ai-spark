
import React from 'react';
import ChatSearch from './ChatSearch';
import { ActiveFilterBadges } from './ActiveFilterBadges';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { DesktopFilter } from './DesktopFilter';
import { MobileFilter } from './MobileFilter';
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ChatContainerProps {
  messages: any[];
  visibleMessages: any[];
  filterOptions: any;
  handleFilterChange: (field: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  isFiltersActive: boolean;
  clearFilters: () => void;
  isDarkMode: boolean;
  showTypingIndicator: boolean;
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  isVoiceActive: boolean;
  toggleVoice: () => void;
  isBrowserSupported: boolean;
  onSummarize: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  recordingDuration?: number;
  maxRecordingDuration?: number;
}

const ChatContainer = ({
  messages,
  visibleMessages,
  filterOptions,
  handleFilterChange,
  searchQuery,
  setSearchQuery,
  isFilterOpen,
  setIsFilterOpen,
  isFiltersActive,
  clearFilters,
  isDarkMode,
  showTypingIndicator,
  input,
  setInput,
  handleSend,
  handleKeyDown,
  isLoading,
  isVoiceActive,
  toggleVoice,
  isBrowserSupported,
  onSummarize,
  inputRef,
  recordingDuration,
  maxRecordingDuration
}: ChatContainerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex flex-1 overflow-hidden">
      {!isMobile && (
        <DesktopFilter
          filterOptions={filterOptions}
          handleFilterChange={handleFilterChange}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
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
              onClearAll={clearFilters}
            />
          )}
        </div>
        
        <ChatMessages
          messages={messages}
          visibleMessages={visibleMessages}
          isDarkMode={isDarkMode}
          showTypingIndicator={showTypingIndicator}
          clearFilters={clearFilters}
        />
        
        <ChatInput
          input={input}
          setInputValue={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          isVoiceActive={isVoiceActive}
          toggleVoice={toggleVoice}
          isBrowserSupported={isBrowserSupported}
          onSummarize={onSummarize}
          ref={inputRef}
          recordingDuration={recordingDuration}
          maxRecordingDuration={maxRecordingDuration}
        />
      </div>
      
      {isMobile && (
        <MobileFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filterOptions={filterOptions}
          handleFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default ChatContainer;
