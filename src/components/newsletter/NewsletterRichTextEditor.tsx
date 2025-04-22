
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ListOrdered, List, Link, Image, Undo, Redo } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';

interface NewsletterRichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

const IMAGE_UPLOAD_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB

export function NewsletterRichTextEditor({ content, onChange, className }: NewsletterRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Focus editor on mount
    editorRef.current?.focus();
  }, []);

  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    const newContent = editorRef.current?.innerHTML || '';
    onChange(newContent);
  };

  // Handle inserting image from file
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // Reset value so same file can be uploaded again if needed

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload an image file (PNG, JPEG, etc.)",
      });
      return;
    }

    if (file.size > IMAGE_UPLOAD_SIZE_LIMIT) {
      toast({
        variant: "destructive",
        title: "Image Too Large",
        description: "Please upload an image smaller than 2MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const base64URL = event.target?.result as string;
      // Insert image
      document.execCommand('insertImage', false, base64URL);
      const newContent = editorRef.current?.innerHTML || '';
      onChange(newContent);
      toast({
        title: "Image inserted",
        description: "Your image has been added.",
      });
    };
    reader.readAsDataURL(file);
  };

  // Open file input when image icon is clicked
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Sanitize and normalize pasted content (optional/expand later – not implemented in this step)

  // Ensure consistent newlines: insert <br> instead of <div> or <p> (can expand later)

  return (
    <div className="space-y-2">
      <Card className="p-2 flex flex-wrap gap-1">
        <Toggle
          aria-label="Toggle bold"
          type="button"
          onClick={() => handleCommand('bold')}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Toggle italic"
          type="button"
          onClick={() => handleCommand('italic')}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Toggle underline"
          type="button"
          onClick={() => handleCommand('underline')}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          aria-label="Align left"
          type="button"
          onClick={() => handleCommand('justifyLeft')}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Align center"
          type="button"
          onClick={() => handleCommand('justifyCenter')}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Align right"
          type="button"
          onClick={() => handleCommand('justifyRight')}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          aria-label="Ordered list"
          type="button"
          onClick={() => handleCommand('insertOrderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Unordered list"
          type="button"
          onClick={() => handleCommand('insertUnorderedList')}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          aria-label="Insert link"
          type="button"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              document.execCommand('createLink', false, url);
              const newContent = editorRef.current?.innerHTML || '';
              onChange(newContent);
            }
          }}
        >
          <Link className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Insert image"
          type="button"
          tabIndex={-1}
          onClick={openFileDialog}
        >
          <Image className="h-4 w-4" />
          {/* Visually hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload image"
            onChange={handleImageUpload}
            tabIndex={-1}
          />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => handleCommand('undo')}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => handleCommand('redo')}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </Card>
      <div
        ref={editorRef}
        className={`min-h-[200px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
        aria-label="Newsletter content text editor"
        suppressContentEditableWarning
        spellCheck
        tabIndex={0}
      />
    </div>
  );
}
