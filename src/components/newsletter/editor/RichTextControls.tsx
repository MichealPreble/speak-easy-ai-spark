
import React from "react";
import { NewsletterEditorToolbar } from "./NewsletterEditorToolbar";

interface RichTextControlsProps {
  onCommand: (command: string, value?: string) => void;
  onImageInserted: (url: string) => void;
}

export const RichTextControls: React.FC<RichTextControlsProps> = ({
  onCommand,
  onImageInserted,
}) => {
  // Use the existing NewsletterEditorToolbar for all formatting/image actions
  return (
    <NewsletterEditorToolbar
      onCommand={onCommand}
      onImageInserted={onImageInserted}
    />
  );
};
