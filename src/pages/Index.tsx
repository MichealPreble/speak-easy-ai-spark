
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import ContactForm from "@/components/landing/ContactForm";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Hero />
      <Features />
      <Pricing />
      <ContactForm />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
