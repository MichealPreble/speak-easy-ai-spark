
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Terms of Service</h1>
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using SpeakEasyAI, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our service.
          </p>
          
          <h2>2. Description of Service</h2>
          <p>
            SpeakEasyAI provides an AI-powered conversation assistant with features including voice messages,
            conversation summarization, and text formatting capabilities. The service is currently provided
            as a demonstration and may be subject to limitations.
          </p>
          
          <h2>3. User Conduct</h2>
          <p>
            You agree not to use SpeakEasyAI to:
          </p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Transmit any harmful, threatening, or abusive content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
          
          <h2>4. Intellectual Property</h2>
          <p>
            All content, features, and functionality of SpeakEasyAI are owned by us and are protected
            by copyright, trademark, and other intellectual property laws.
          </p>
          
          <h2>5. Disclaimer of Warranties</h2>
          <p>
            SpeakEasyAI is provided "as is" without warranties of any kind, either express or implied.
            We do not guarantee that the service will be uninterrupted, secure, or error-free.
          </p>
          
          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall SpeakEasyAI be liable for any indirect, incidental, special, or consequential
            damages arising out of or in any way connected with the use of our service.
          </p>
          
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of significant changes
            by posting the new terms on this page.
          </p>
          
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a href="mailto:contact@speakeasyai.com" className="text-primary">contact@speakeasyai.com</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Terms;
