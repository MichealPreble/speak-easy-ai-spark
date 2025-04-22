
import React from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, ListOrdered, List, Link, Undo, Redo 
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NewsletterImageUpload } from './NewsletterImageUpload';

interface NewsletterEditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onImageInserted: (imageUrl: string) => void;
}

export function NewsletterEditorToolbar({ 
  onCommand, 
  onImageInserted 
}: NewsletterEditorToolbarProps) {
  
  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      onCommand('createLink', url);
    }
  };

  return (
    <Card className="p-2 flex flex-wrap gap-1">
      <Toggle
        aria-label="Toggle bold"
        type="button"
        onClick={() => onCommand('bold')}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle italic"
        type="button"
        onClick={() => onCommand('italic')}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle underline"
        type="button"
        onClick={() => onCommand('underline')}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <div className="w-px h-6 bg-border mx-1" />
      <Toggle
        aria-label="Align left"
        type="button"
        onClick={() => onCommand('justifyLeft')}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Align center"
        type="button"
        onClick={() => onCommand('justifyCenter')}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Align right"
        type="button"
        onClick={() => onCommand('justifyRight')}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>
      <div className="w-px h-6 bg-border mx-1" />
      <Toggle
        aria-label="Ordered list"
        type="button"
        onClick={() => onCommand('insertOrderedList')}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Unordered list"
        type="button"
        onClick={() => onCommand('insertUnorderedList')}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <div className="w-px h-6 bg-border mx-1" />
      <Toggle
        aria-label="Insert link"
        type="button"
        onClick={handleLinkInsert}
      >
        <Link className="h-4 w-4" />
      </Toggle>
      <NewsletterImageUpload onImageInserted={onImageInserted} />
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => onCommand('undo')}
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => onCommand('redo')}
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </Card>
  );
}
