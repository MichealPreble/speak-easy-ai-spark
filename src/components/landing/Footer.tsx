
import { Bot, MessageSquare, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t py-8 mt-8 border-secondary-light/30 dark:border-secondary-dark/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-bold">SpeakEasyAI</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              © {new Date().getFullYear()} SpeakEasyAI. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex gap-4">
              <Link to="/chat">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 bg-primary/15 hover:bg-primary/30 text-primary border border-primary/20 backdrop-blur-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Try Chat
                </Button>
              </Link>
              <Link to="/blog">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-secondary/20 border border-secondary/20 backdrop-blur-sm"
                >
                  <BookOpen className="h-4 w-4" />
                  Blog
                </Button>
              </Link>
            </div>
            <div className="flex gap-6">
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <a 
                href="mailto:support@speakeasyai.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email support"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
