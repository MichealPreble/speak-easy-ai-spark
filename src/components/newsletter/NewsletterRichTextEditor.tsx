
import React, { useRef, useEffect } from 'react';
import { NewsletterEditorToolbar } from './editor/NewsletterEditorToolbar';
// Remove import of NewsletterRichTextContent, use new RichTextContent instead
import { RichTextContent } from './editor/RichTextContent';
import { useToast } from '@/hooks/use-toast';

interface NewsletterRichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NewsletterRichTextEditor({ content, onChange, className }: NewsletterRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const newContent = editorRef.current?.innerHTML || '';
    onChange(newContent);
  };

  // Handle inserting image 
  const handleImageInsert = (imageUrl: string) => {
    document.execCommand('insertImage', false, imageUrl);
    const newContent = editorRef.current?.innerHTML || '';
    onChange(newContent);
  };

  return (
    <div className="space-y-2">
      <NewsletterEditorToolbar 
        onCommand={handleCommand}
        onImageInserted={handleImageInsert}
      />
      <RichTextContent
        content={content}
        onChange={onChange}
        className={`min-h-[200px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        autoFocus
      />
    </div>
  );
}
