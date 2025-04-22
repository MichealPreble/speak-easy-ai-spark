
import React from "react";
import { RichTextEditor } from "./editor/RichTextEditor";

interface NewsletterRichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NewsletterRichTextEditor({
  content,
  onChange,
  className,
}: NewsletterRichTextEditorProps) {
  // Now uses the new modular RichTextEditor
  return (
    <RichTextEditor
      content={content}
      onChange={onChange}
      className={className}
    />
  );
}
