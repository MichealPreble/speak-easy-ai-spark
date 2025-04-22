
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ListOrdered, List, Link, Image, Undo, Redo } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface NewsletterRichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NewsletterRichTextEditor({ content, onChange, className }: NewsletterRichTextEditorProps) {
  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    const newContent = document.querySelector('[contenteditable="true"]')?.innerHTML || '';
    onChange(newContent);
  };

  return (
    <div className="space-y-2">
      <Card className="p-2 flex flex-wrap gap-1">
        <Toggle
          aria-label="Toggle bold"
          onClick={() => handleCommand('bold')}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Toggle italic"
          onClick={() => handleCommand('italic')}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Toggle underline"
          onClick={() => handleCommand('underline')}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          aria-label="Align left"
          onClick={() => handleCommand('justifyLeft')}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Align center"
          onClick={() => handleCommand('justifyCenter')}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Align right"
          onClick={() => handleCommand('justifyRight')}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          aria-label="Ordered list"
          onClick={() => handleCommand('insertOrderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Unordered list"
          onClick={() => handleCommand('insertUnorderedList')}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle
          aria-label="Insert link"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              document.execCommand('createLink', false, url);
              const newContent = document.querySelector('[contenteditable="true"]')?.innerHTML || '';
              onChange(newContent);
            }
          }}
        >
          <Link className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Insert image"
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              document.execCommand('insertImage', false, url);
              const newContent = document.querySelector('[contenteditable="true"]')?.innerHTML || '';
              onChange(newContent);
            }
          }}
        >
          <Image className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCommand('undo')}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCommand('redo')}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </Card>
      <div
        className={`min-h-[200px] rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
