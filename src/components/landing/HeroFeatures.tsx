
import { Clock, Sparkles, Users } from "lucide-react";

const HeroFeatures = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      <div className="flex items-center bg-muted/50 px-4 py-2 rounded-full">
        <Clock className="h-4 w-4 mr-2 text-primary" />
        <span className="text-sm">Save 30% of preparation time</span>
      </div>
      <div className="flex items-center bg-muted/50 px-4 py-2 rounded-full">
        <Sparkles className="h-4 w-4 mr-2 text-primary" />
        <span className="text-sm">AI-powered speech analysis</span>
      </div>
      <div className="flex items-center bg-muted/50 px-4 py-2 rounded-full">
        <Users className="h-4 w-4 mr-2 text-primary" />
        <span className="text-sm">Join 10k+ speakers</span>
      </div>
    </div>
  );
};

export default HeroFeatures;
