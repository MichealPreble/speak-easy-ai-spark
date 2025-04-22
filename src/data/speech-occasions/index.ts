
import { SpeechOccasionsData, SpeechCategory } from "@/types/speechOccasions";
import { personalLifeOccasions } from "./personal-life";
import { professionalLifeOccasions } from "./professional-life";
import { academicOccasions } from "./academic";
import { communityOccasions } from "./community";
import { specialOccasions } from "./special";

// Legacy speech categories
export const SPEECH_CATEGORIES: SpeechCategory[] = [
  personalLifeOccasions,
  professionalLifeOccasions,
  academicOccasions,
  communityOccasions,
  specialOccasions
];

// Convert legacy format to new format for compatibility
export const SPEECH_OCCASIONS: SpeechOccasionsData = {
  personal: [
    {
      id: "wedding-toast",
      title: "Wedding Toast",
      description: "Prepare a heartfelt toast for a wedding",
      difficulty: "medium",
      duration: "2-5 min",
      tips: ["Start with a personal anecdote", "Balance humor with emotion"]
    },
    {
      id: "birthday-speech",
      title: "Birthday Speech",
      description: "Deliver a memorable birthday celebration speech",
      difficulty: "easy",
      duration: "2-3 min",
      tips: ["Include personal memories", "Keep the tone appropriate"]
    }
  ],
  professional: [
    {
      id: "job-interview",
      title: "Job Interview",
      description: "Practice answering common interview questions confidently",
      difficulty: "medium",
      duration: "2-3 min per answer",
      tips: ["Use the STAR method", "Keep answers concise but thorough"]
    }
  ],
  academic: [
    {
      id: "class-presentation",
      title: "Class Presentation",
      description: "Practice for delivering academic presentations",
      difficulty: "medium",
      duration: "5-10 min",
      tips: ["Start with a clear introduction", "Use visual aids effectively"]
    }
  ]
};
