
import { User, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    content: "SpeakEasyAI transformed my presentation skills. The AI feedback on filler words reduced my 'um's by 70% in just two weeks.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Conference Speaker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    content: "I've tried many public speaking apps, but none give the personalized feedback that SpeakEasyAI provides. It feels like having a coach with me 24/7.",
    rating: 5
  },
  {
    id: 3,
    name: "Taylor Roberts",
    role: "University Student",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    content: "Preparing for my thesis defense was incredibly stressful until I found SpeakEasyAI. The structured feedback helped me sound confident and professional.",
    rating: 4
  }
];

const HeroTestimonials = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Trusted by Speakers Worldwide</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback>
                  <User className="h-6 w-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm italic">{testimonial.content}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center mt-12 space-x-8">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/512px-Microsoft_logo_%282012%29.svg.png" 
          alt="Microsoft" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/500px-Google_2015_logo.svg.png" 
          alt="Google" className="h-7 opacity-70 hover:opacity-100 transition-opacity" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png" 
          alt="LinkedIn" className="h-7 opacity-70 hover:opacity-100 transition-opacity" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png" 
          alt="Apple" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default HeroTestimonials;
