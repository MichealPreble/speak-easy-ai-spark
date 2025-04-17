
import React from 'react';
import { GraduationCap, Heart, Gift, Award, Users, Presentation, MicrophoneStage } from 'lucide-react';
import { Card } from '@/components/ui/card';

const SpeechTypeVisual: React.FC = () => {
  const speechTypes = [
    {
      title: 'Wedding Speeches',
      description: 'Create heartfelt toasts that celebrate love and connection',
      icon: <Heart className="h-12 w-12 text-pink-500 mb-4" />,
      color: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800/30'
    },
    {
      title: 'Graduation Addresses',
      description: 'Inspire graduates with wisdom for their next chapter',
      icon: <GraduationCap className="h-12 w-12 text-blue-500 mb-4" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800/30'
    },
    {
      title: 'Retirement Celebrations',
      description: 'Honor careers and legacies with meaningful tributes',
      icon: <Award className="h-12 w-12 text-purple-500 mb-4" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800/30'
    },
    {
      title: 'Promotions & Recognition',
      description: 'Acknowledge achievements and welcome new roles',
      icon: <Gift className="h-12 w-12 text-green-500 mb-4" />,
      color: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800/30'
    },
    {
      title: 'Team Presentations',
      description: 'Deliver clear, engaging messages to colleagues',
      icon: <Users className="h-12 w-12 text-amber-500 mb-4" />,
      color: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800/30'
    },
    {
      title: 'Keynote Speeches',
      description: 'Captivate audiences with powerful industry insights',
      icon: <MicrophoneStage className="h-12 w-12 text-red-500 mb-4" />,
      color: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800/30'
    },
  ];

  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold text-center mb-8">Your AI Speech Coach for Every Occasion</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speechTypes.map((type, index) => (
          <Card 
            key={index}
            className={`p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${type.color} border ${type.borderColor}`}
          >
            <div className="mb-2">
              {type.icon}
            </div>
            <h4 className="text-lg font-semibold mb-2">{type.title}</h4>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          No matter what speaking challenge you face, SpeakEasyAI provides personalized coaching, 
          feedback, and practice to help you deliver with confidence.
        </p>
      </div>
    </div>
  );
};

export default SpeechTypeVisual;
