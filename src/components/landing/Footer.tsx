
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t py-8 mt-8">
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
            <Link to="/chat">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Try Chat
              </Button>
            </Link>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
