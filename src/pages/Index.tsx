
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import ContactForm from "@/components/landing/ContactForm";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";
import { ACCESSIBILITY_COLORS } from "@/types/chat";
import { ConnectionStatusIndicator } from "@/components/ui/connection-status";

const Index = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/');
  }, [trackPageView]);

  return (
    <>
      <SEO 
        title="SpeakEasyAI - Public Speaking Practice & AI Feedback"
        description="Master public speaking with personalized AI coaching. Practice speeches, receive balanced feedback, and craft compelling narratives with the power of AI."
      />
      <div className={`min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background backdrop-blur-md ${ACCESSIBILITY_COLORS.HIGH_CONTRAST_TEXT}`}>
        <div className="absolute top-4 right-4 z-10">
          <ConnectionStatusIndicator />
        </div>
        <main>
          <Hero />
          <HowItWorks />
          <Features />
          <Pricing />
          <ContactForm />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
