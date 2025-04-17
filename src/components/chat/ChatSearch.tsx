
import { useState } from "react";
import { SearchInput } from "./SearchInput";

interface ChatSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  disabled?: boolean;
}

const ChatSearch = ({ searchQuery, setSearchQuery, disabled }: ChatSearchProps) => {
  return (
    <div className="relative">
      <SearchInput 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        disabled={disabled} 
      />
    </div>
  );
};

export default ChatSearch;
