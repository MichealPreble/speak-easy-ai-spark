
import React, { useRef } from 'react';
import { Image } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';

interface NewsletterImageUploadProps {
  onImageInserted: (imageUrl: string) => void;
}

const IMAGE_UPLOAD_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB

export function NewsletterImageUpload({ onImageInserted }: NewsletterImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

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
      onImageInserted(base64URL);
      toast({
        title: "Image inserted",
        description: "Your image has been added.",
      });
    };
    reader.readAsDataURL(file);
  };

  // Open file dialog when image icon is clicked
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Toggle
        aria-label="Insert image"
        type="button"
        tabIndex={-1}
        onClick={openFileDialog}
      >
        <Image className="h-4 w-4" />
      </Toggle>
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
    </>
  );
}
