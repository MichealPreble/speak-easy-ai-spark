
import React, { useRef, useEffect } from 'react';

interface NewsletterRichTextContentProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export const NewsletterRichTextContent: React.FC<NewsletterRichTextContentProps> = ({
  content,
  onChange,
  className,
  autoFocus = false,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = content;
      if (autoFocus) divRef.current.focus();
    }
  }, [content, autoFocus]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key (new paragraph on Shift+Enter for <br>, else <div> or <p>)
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        document.execCommand('insertLineBreak');
        e.preventDefault();
      } else {
        // Default browser behavior is to create <div> or <p>.
        // Optionally, we can force a new <p> tag:
        // document.execCommand('formatBlock', false, 'p');
        // e.preventDefault(); // Uncomment to force <p> on Enter
      }
    }
    // Handle Tab key (indent or traverse)
    if (e.key === 'Tab') {
      document.execCommand('insertText', false, '\u00a0\u00a0\u00a0\u00a0');
      e.preventDefault();
    }
  };

  return (
    <div
      ref={divRef}
      className={className}
      contentEditable
      aria-label="Newsletter content text editor"
      suppressContentEditableWarning
      spellCheck
      tabIndex={0}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      data-testid="newsletter-rich-text-content"
      style={{
        minHeight: 200,
        outline: 'none',
      }}
    />
  );
};
