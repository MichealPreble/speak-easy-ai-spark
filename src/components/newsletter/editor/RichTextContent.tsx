
import React, { useEffect, useRef, forwardRef } from "react";
import DOMPurify from "dompurify";

interface RichTextContentProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export const RichTextContent = forwardRef<HTMLDivElement, RichTextContentProps>(({
  content,
  onChange,
  className,
  autoFocus = false,
}, ref) => {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const divRef = ref as React.RefObject<HTMLDivElement> || internalRef;

  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== content) {
      divRef.current.innerHTML = content;
      if (autoFocus) divRef.current.focus();
    }
  }, [content, autoFocus, divRef]);

  const handleInput = () => {
    onChange(divRef.current?.innerHTML || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Normalize Enter to insert <p></p> block if not shift-enter.
    if (e.key === "Enter") {
      if (e.shiftKey) {
        document.execCommand("insertLineBreak");
        e.preventDefault();
      } else {
        document.execCommand("formatBlock", false, "p");
        e.preventDefault();
      }
    }
    // Tab inserts 4 spaces rather than moving focus.
    if (e.key === "Tab") {
      document.execCommand("insertText", false, "\u00a0\u00a0\u00a0\u00a0");
      e.preventDefault();
    }
  };

  // Sanitize pasted content
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    let paste = e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain");
    paste = DOMPurify.sanitize(paste, { ALLOWED_TAGS: [
      "b", "i", "em", "strong", "u", "ul", "ol", "li", "a", "p", "br", "img", "h1", "h2", "h3", "blockquote"
    ], ALLOWED_ATTR: ["href", "src", "alt", "title", "target"] });
    document.execCommand("insertHTML", false, paste);
    setTimeout(() => {
      onChange(divRef.current?.innerHTML || "");
    });
  };

  return (
    <div
      ref={divRef as React.RefObject<HTMLDivElement>}
      className={className}
      contentEditable
      aria-label="Newsletter content editor"
      suppressContentEditableWarning
      spellCheck
      tabIndex={0}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      data-testid="rich-text-content"
      style={{
        minHeight: 200,
        outline: "none",
      }}
    />
  );
});

RichTextContent.displayName = "RichTextContent";
