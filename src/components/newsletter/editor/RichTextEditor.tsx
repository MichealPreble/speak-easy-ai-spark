
import React, { useRef, useEffect } from "react";
import { RichTextControls } from "./RichTextControls";
import { RichTextContent } from "./RichTextContent";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  className,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  // Formatting/image commands dispatcher for toolbar
  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML || "";
      onChange(newContent);
    }
  };

  const handleImageInsert = (imageUrl: string) => {
    document.execCommand("insertImage", false, imageUrl);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML || "";
      onChange(newContent);
    }
  };

  return (
    <div className="space-y-2">
      <RichTextControls 
        onCommand={handleCommand}
        onImageInserted={handleImageInsert}
      />
      <RichTextContent
        content={content}
        onChange={onChange}
        className={`min-h-[200px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        autoFocus
        ref={editorRef as any}
      />
    </div>
  );
};
