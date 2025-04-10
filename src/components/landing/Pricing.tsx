
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Pricing = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-24 bg-accent/5 rounded-2xl my-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works for you
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
        <div className="flex-1 p-8 rounded-xl border bg-card flex flex-col max-w-md mx-auto md:mx-0">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-1">Free</h3>
            <div className="text-4xl font-bold mb-1">$0</div>
            <p className="text-sm text-muted-foreground">Forever free</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span>10 messages per day</span>
            </li>
            <li className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span>Basic conversation capabilities</span>
            </li>
            <li className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span>Standard response time</span>
            </li>
          </ul>
          <Button variant="outline" className="w-full">Sign Up Free</Button>
        </div>
        <div className="flex-1 p-8 rounded-xl border-2 border-primary bg-card flex flex-col relative max-w-md mx-auto md:mx-0">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg font-medium">
            POPULAR
          </div>
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-1">Premium</h3>
            <div className="text-4xl font-bold mb-1">$15</div>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span>Unlimited messages</span>
            </li>
            <li className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span>Advanced AI capabilities</span>
            </li>
            <li className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span>Priority response time</span>
            </li>
            <li className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span>File uploads and analysis</span>
            </li>
          </ul>
          <Button className="w-full">Get Premium</Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
