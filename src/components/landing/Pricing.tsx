
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {/* One Week Plan - Urgent */}
        <Card className="border bg-card flex flex-col relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Urgent Prep</CardTitle>
            <div className="text-3xl font-bold">$12.99</div>
            <CardDescription>One week access</CardDescription>
            <div className="absolute top-0 right-0 bg-amber-500 text-primary-foreground px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg font-medium">
              LAST-MINUTE
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                <span>Unlimited messages for 7 days</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                <span>Emergency speech preparation</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                <span>Expedited feedback</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                <span>Applies toward membership</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Get Ready Fast</Button>
          </CardFooter>
        </Card>

        {/* Free Plan */}
        <Card className="border bg-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Free</CardTitle>
            <div className="text-3xl font-bold">$0</div>
            <CardDescription>Forever free</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 mb-8">
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
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Sign Up Free</Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="border-2 border-primary bg-card flex flex-col relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Premium</CardTitle>
            <div className="text-3xl font-bold">$15</div>
            <CardDescription>per month</CardDescription>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg font-medium">
              POPULAR
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 mb-8">
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
          </CardContent>
          <CardFooter>
            <Button className="w-full">Get Premium</Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border bg-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Pro</CardTitle>
            <div className="text-3xl font-bold">$29</div>
            <CardDescription>per month</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Star className="h-5 w-5 text-indigo-500 mr-2" />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-indigo-500 mr-2" />
                <span>Speech analytics dashboard</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-indigo-500 mr-2" />
                <span>Advanced feedback reports</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-indigo-500 mr-2" />
                <span>Custom speech templates</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Go Pro</Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="border bg-card flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground">Enterprise</CardTitle>
            <div className="text-3xl font-bold">$99</div>
            <CardDescription>per month</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-2" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-2" />
                <span>Team collaboration tools</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-2" />
                <span>Dedicated support manager</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-2" />
                <span>Custom integration options</span>
              </li>
              <li className="flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-2" />
                <span>Branded solutions</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Contact Sales</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default Pricing;
