
import React, { useRef, useEffect } from 'react';

interface RichTextContentProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

// Helper to sanitize pasted HTML (very basic for now: strips inline styles, scripts, comments)
function sanitize(html: string) {
  // Create a temp div and use browser parsing
  const temp = document.createElement('div');
  temp.innerHTML = html;
  // Remove <script>, <style> and comments
  temp.querySelectorAll('script, style').forEach(n => n.remove());
  // Remove all comments
  temp
    .querySelectorAll('*')
    .forEach(node => {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.COMMENT_NODE) child.parentNode?.removeChild(child);
      });
    });
  // Remove all inline styles
  temp.querySelectorAll<HTMLElement>('*').forEach(node => {
    node.removeAttribute('style');
    node.removeAttribute('class');
  });
  // Optionally limit allowed tags, e.g., only allow basic formatting, links, and images
  // For this version, let browser do most of the work, but you can add whitelist if needed
  return temp.innerHTML;
}

export const RichTextContent: React.FC<RichTextContentProps> = ({
  content,
  onChange,
  className,
  autoFocus = false,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== content) {
      divRef.current.innerHTML = content;
      if (autoFocus) divRef.current.focus();
    }
  }, [content, autoFocus]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        document.execCommand('insertLineBreak');
        e.preventDefault();
      } else {
        // Optionally force <p> on Enter (browser default makes <div> or <p>)
        // document.execCommand('formatBlock', false, 'p');
        // e.preventDefault();
      }
    }
    if (e.key === 'Tab') {
      document.execCommand('insertText', false, '\u00a0\u00a0\u00a0\u00a0');
      e.preventDefault();
    }
  };

  // Sanitize pasted content
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboard = e.clipboardData;
    let paste = clipboard.getData('text/html') || clipboard.getData('text/plain');
    // Remove unwanted formatting
    paste = sanitize(paste);
    // Insert cleaned content at cursor position
    document.execCommand('insertHTML', false, paste);
    // Update value after a tick
    setTimeout(() => {
      onChange(divRef.current?.innerHTML || '');
    });
  };

  return (
    <div
      ref={divRef}
      className={className}
      contentEditable
      aria-label="Newsletter editor content"
      suppressContentEditableWarning
      spellCheck
      tabIndex={0}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      data-testid="rich-text-content"
      style={{
        minHeight: 200,
        outline: 'none',
      }}
    />
  );
};
