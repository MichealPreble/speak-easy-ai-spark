
import { SpeechOccasionsData } from '@/types/speechOccasions';

// Export directly from the data structure file
export const SPEECH_OCCASIONS: SpeechOccasionsData = {
  academic: [
    {
      id: "class-presentation",
      title: "Class Presentation",
      description: "Practice for delivering academic presentations to your class",
      difficulty: "medium",
      duration: "5-10 min",
      tips: [
        "Start with a clear introduction of your topic",
        "Use visual aids effectively but don't rely on them completely",
        "End with a memorable conclusion that reinforces your main points"
      ]
    },
    {
      id: "thesis-defense",
      title: "Thesis Defense",
      description: "Prepare for defending your thesis or major research project",
      difficulty: "hard",
      duration: "15-30 min",
      tips: [
        "Begin with a concise summary of your research question and findings",
        "Anticipate questions and prepare responses",
        "Practice transitioning between different sections smoothly"
      ]
    },
    {
      id: "lecture",
      title: "Academic Lecture",
      description: "Practice delivering educational content clearly",
      difficulty: "hard",
      duration: "30-60 min",
      tips: [
        "Structure your content with clear sections",
        "Include examples and analogies to illustrate complex points",
        "Build in opportunities for questions or interaction"
      ]
    }
  ],
  professional: [
    {
      id: "job-interview",
      title: "Job Interview",
      description: "Practice answering common interview questions confidently",
      difficulty: "medium",
      duration: "2-3 min per answer",
      tips: [
        "Use the STAR method for behavioral questions",
        "Keep answers concise but thorough",
        "Practice transitioning between different types of questions"
      ]
    },
    {
      id: "sales-pitch",
      title: "Sales Pitch",
      description: "Deliver a compelling pitch for a product or service",
      difficulty: "medium",
      duration: "3-5 min",
      tips: [
        "Start with a hook that grabs attention",
        "Focus on benefits rather than features",
        "Include a clear call to action"
      ]
    },
    {
      id: "team-presentation",
      title: "Team Presentation",
      description: "Present project updates or proposals to your team",
      difficulty: "medium",
      duration: "10-15 min",
      tips: [
        "Begin with clear objectives for the presentation",
        "Use data visualizations to support key points",
        "Allow time for questions and discussion"
      ]
    }
  ],
  personal: [
    {
      id: "wedding-toast",
      title: "Wedding Toast",
      description: "Prepare a heartfelt toast for a wedding",
      difficulty: "medium",
      duration: "2-5 min",
      tips: [
        "Start with a personal anecdote about the couple",
        "Balance humor with sincere emotion",
        "End by asking everyone to raise their glasses"
      ]
    },
    {
      id: "eulogy",
      title: "Eulogy",
      description: "Honor someone's memory with a thoughtful speech",
      difficulty: "hard",
      duration: "5-7 min",
      tips: [
        "Focus on celebrating the person's life and legacy",
        "Share meaningful stories and memories",
        "Practice emotional control while delivering"
      ]
    },
    {
      id: "birthday-speech",
      title: "Birthday Speech",
      description: "Deliver a memorable birthday celebration speech",
      difficulty: "easy",
      duration: "2-3 min",
      tips: [
        "Include personal memories and highlights",
        "Keep the tone appropriate for the audience",
        "End with well wishes for the year ahead"
      ]
    }
  ],
  community: [
    {
      id: "fundraising",
      title: "Fundraising Appeal",
      description: "Inspire donations for a cause you care about",
      difficulty: "medium",
      duration: "5-7 min",
      tips: [
        "Share compelling stories about impact",
        "Clearly articulate the need and solution",
        "Include specific ways people can contribute"
      ]
    },
    {
      id: "community-meeting",
      title: "Community Meeting",
      description: "Address local issues at a neighborhood or town meeting",
      difficulty: "medium",
      duration: "3-5 min",
      tips: [
        "Start by establishing your connection to the community",
        "Present clear facts about the issue at hand",
        "Propose actionable next steps"
      ]
    },
    {
      id: "volunteer-recruitment",
      title: "Volunteer Recruitment",
      description: "Motivate others to volunteer for a cause",
      difficulty: "medium",
      duration: "3-5 min",
      tips: [
        "Explain the impact volunteers make",
        "Address common hesitations people might have",
        "Make the sign-up process clear and simple"
      ]
    }
  ],
  special: [
    {
      id: "ted-talk",
      title: "TED-style Talk",
      description: "Share an idea worth spreading in an engaging way",
      difficulty: "hard",
      duration: "10-18 min",
      tips: [
        "Start with a compelling hook or question",
        "Focus on one main idea throughout",
        "Use storytelling to make abstract concepts concrete"
      ]
    },
    {
      id: "debate",
      title: "Debate Argument",
      description: "Present a persuasive argument in a structured debate",
      difficulty: "hard",
      duration: "5-7 min",
      tips: [
        "Clearly state your position at the beginning",
        "Support with evidence and logical reasoning",
        "Anticipate and address counterarguments"
      ]
    },
    {
      id: "award-acceptance",
      title: "Award Acceptance",
      description: "Accept an award or recognition with grace",
      difficulty: "medium",
      duration: "2-3 min",
      tips: [
        "Express genuine gratitude",
        "Acknowledge those who helped you",
        "Share what the recognition means to you"
      ]
    }
  ]
};
