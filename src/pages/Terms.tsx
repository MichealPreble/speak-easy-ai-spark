
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <>
      <SEO 
        title="Terms of Service"
        description="Read the Terms of Service for SpeakEasyAI, your AI-powered public speaking practice assistant."
      />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to SpeakEasyAI. These Terms of Service govern your use of our website and services.
            </p>
            
            <h2>2. Acceptance of Terms</h2>
            <p>
              By accessing or using SpeakEasyAI, you agree to be bound by these Terms of Service.
            </p>
            
            <h2>3. Description of Service</h2>
            <p>
              SpeakEasyAI provides an AI-powered conversation assistant to help users practice and improve their public speaking skills.
            </p>
            
            <h2>4. User Accounts</h2>
            <p>
              You may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information.
            </p>
            
            <h2>5. Privacy Policy</h2>
            <p>
              Your use of SpeakEasyAI is also governed by our Privacy Policy, which can be found at <a href="/privacy">Privacy Policy</a>.
            </p>
            
            <h2>6. Restrictions</h2>
            <p>
              You agree not to use SpeakEasyAI for any unlawful purpose or in any way that could damage, disable, or impair the service.
            </p>
            
            <h2>7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of SpeakEasyAI are owned by us and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2>8. Disclaimer of Warranties</h2>
            <p>
              SpeakEasyAI is provided "as is" and "as available" without any warranties of any kind.
            </p>
            
            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall SpeakEasyAI be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
            
            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Your continued use of SpeakEasyAI after such modifications constitutes your acceptance of the revised terms.
            </p>
            
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@speakeasyai.com.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
