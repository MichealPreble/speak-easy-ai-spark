
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
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
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you use our services. This includes:
          </p>
          <ul>
            <li>Chat message content</li>
            <li>Voice recordings when using voice input feature</li>
            <li>Information about how you interact with our service</li>
          </ul>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Develop new features and services</li>
            <li>Analyze how users interact with our services</li>
            <li>Respond to your requests and inquiries</li>
          </ul>
          
          <h2>3. Data Storage</h2>
          <p>
            Currently, we store chat messages locally in your browser using localStorage. 
            This means your data stays on your device and is not transmitted to our servers.
            You can clear this data at any time using the "Clear Chat" button.
          </p>
          
          <h2>4. Analytics</h2>
          <p>
            We use Google Analytics to collect anonymous information about how users interact with our application.
            This helps us improve our services. You can opt out of Google Analytics by using browser extensions like 
            Google Analytics Opt-out Browser Add-on.
          </p>
          
          <h2>5. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting 
            the new privacy policy on this page.
          </p>
          
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at:
            <br />
            <a href="mailto:contact@speakeasyai.com" className="text-primary">contact@speakeasyai.com</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
