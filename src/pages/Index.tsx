
import { useEffect } from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import ContactForm from "@/components/landing/ContactForm";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";
import { ACCESSIBILITY_COLORS } from "@/types/chat";

const Index = () => {
  return (
    <>
      <SEO 
        title="SpeakEasyAI - Public Speaking Practice & AI Feedback"
        description="Master public speaking with personalized AI coaching. Practice speeches, receive balanced feedback, and craft compelling narratives with the power of AI."
      />
      <div className={`min-h-screen bg-gradient-to-b from-primary-light/10 to-white dark:from-primary-dark/10 dark:to-background backdrop-blur-sm ${ACCESSIBILITY_COLORS.HIGH_CONTRAST_TEXT}`}>
        <main>
          <Hero />
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
