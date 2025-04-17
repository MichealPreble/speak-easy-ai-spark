
import { Facebook, Linkedin, Mail, Twitter, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=SpeakEasyAI,PublicSpeaking`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "Link copied",
          description: "The article link has been copied to your clipboard."
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy failed",
          description: "Failed to copy the link. Please try again.",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <div className="share-section py-6">
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-2">
        <a 
          href={shareLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => console.log('Twitter share clicked')}
            className="flex items-center gap-2"
          >
            <Twitter className="h-4 w-4" />
            <span className="hidden sm:inline">Twitter</span>
          </Button>
        </a>
        <a 
          href={shareLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('Facebook share clicked')}
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            <span className="hidden sm:inline">Facebook</span>
          </Button>
        </a>
        <a 
          href={shareLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('LinkedIn share clicked')}
            className="flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Button>
        </a>
        <a 
          href={shareLinks.email}
          aria-label="Share via Email"
        >
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('Email share clicked')}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </Button>
        </a>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCopyLink}
          className="flex items-center gap-2"
          aria-label="Copy link"
        >
          <Link className="h-4 w-4" />
          <span className="hidden sm:inline">Copy link</span>
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
