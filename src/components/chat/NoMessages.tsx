
interface NoMessagesProps {
  isSearching: boolean;
}

const NoMessages = ({ isSearching }: NoMessagesProps) => {
  return (
    <p className="text-center text-muted-foreground py-4">
      {isSearching ? "No messages found matching your search." : "No messages yet."}
    </p>
  );
};

export default NoMessages;
