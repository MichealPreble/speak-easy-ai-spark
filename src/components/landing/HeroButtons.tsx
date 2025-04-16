
import { ArrowRight, Users, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

const HeroButtons = () => {
  const { trackTryItYourself } = useAnalytics();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12 w-full max-w-lg">
      <Button size="lg" asChild className="text-base group transition-all duration-300 shadow-lg hover:shadow-primary/25 relative overflow-hidden transform hover:scale-105">
        <Link to="/auth" onClick={() => trackTryItYourself()}>
          <span className="relative z-10 flex items-center">
            Get Started Free
            <ArrowRightCircle className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="absolute inset-0 bg-primary opacity-100 group-hover:opacity-90 transition-opacity"></span>
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="text-base border-primary/20 hover:bg-primary/5 transform hover:scale-105 transition-all duration-300">
        <a href="#features" className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          <span>See How It Works</span>
        </a>
      </Button>
    </div>
  );
};

export default HeroButtons;
