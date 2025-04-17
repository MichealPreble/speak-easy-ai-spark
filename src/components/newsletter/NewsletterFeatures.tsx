
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Mic, MessageSquare, Award, UserCheck, BookMarked } from 'lucide-react';

const NewsletterFeatures: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary/80" />,
      title: "The Spotlight",
      description: "Editorial insights on trending speaking topics and industry developments."
    },
    {
      icon: <Mic className="h-8 w-8 text-primary/80" />,
      title: "The Art of Delivery",
      description: "Deep dive into specific delivery techniques like pacing, vocal variety, and more."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary/80" />,
      title: "Speaker Breakdown",
      description: "Analysis of notable speeches, highlighting techniques you can apply."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary/80" />,
      title: "Speaking in Real Life",
      description: "Scripts and mindset tips for everyday scenarios like meetings and interviews."
    },
    {
      icon: <Award className="h-8 w-8 text-primary/80" />,
      title: "Tool of the Month",
      description: "Curated app, template, or resource to enhance your speaking skills."
    },
    {
      icon: <BookMarked className="h-8 w-8 text-primary/80" />,
      title: "Curated Brilliance",
      description: "Handpicked talks, books, quotes, and tools for continuous improvement."
    }
  ];

  return (
    <section className="mt-16 mb-8">
      <h2 className="text-2xl font-bold text-center mb-8">What's Inside Each Issue</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="backdrop-blur-sm border border-primary/10 bg-background/80 hover:bg-background/90 transition-all">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NewsletterFeatures;
