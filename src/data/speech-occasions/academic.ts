
import { SpeechCategory } from "@/types/speechOccasions";

export const academicOccasions: SpeechCategory = {
  category: "Academic and Educational Contexts",
  occasions: [
    {
      name: "Class Presentations",
      occasion: "Presenting academic work to classmates",
      examples: "Research presentation, project showcase, debate opening",
      audienceSize: "Small to medium (10–50 people)",
      audienceSizeCategory: "Medium",
      frequency: "Regular",
      task: "Organize clear, informative content with academic rigor"
    },
    {
      name: "Academic Conferences",
      occasion: "Presenting research or participating in panels",
      examples: "Research presentation, poster session, panel discussion",
      audienceSize: "Medium to large (20–200+ people)",
      audienceSizeCategory: "Large",
      frequency: "Rare",
      task: "Communicate complex information in an accessible, engaging way"
    },
    {
      name: "Thesis Defense",
      occasion: "Defending academic research",
      examples: "Dissertation defense, thesis presentation, committee questions",
      audienceSize: "Small (3–10 people)",
      audienceSizeCategory: "Small",
      frequency: "Rare",
      task: "Present and defend your research with clarity and confidence"
    },
    {
      name: "Teaching",
      occasion: "Delivering lessons or lectures",
      examples: "Class lecture, workshop facilitation, tutorial",
      audienceSize: "Small to large (5–200+ people)",
      audienceSizeCategory: "Large",
      frequency: "Regular",
      task: "Explain concepts clearly and engage learners effectively"
    }
  ]
};

