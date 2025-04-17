
import { SpeechCategory } from "@/types/speechOccasions";

export const communityOccasions: SpeechCategory = {
  category: "Community and Civic Engagements",
  occasions: [
    {
      name: "Community Meetings",
      occasion: "Participating in local governance",
      examples: "Town hall comment, neighborhood association, public hearing testimony",
      audienceSize: "Small to medium (10–100 people)",
      audienceSizeCategory: "Medium",
      frequency: "Regular",
      task: "Express community concerns or positions clearly and persuasively"
    },
    {
      name: "Religious Services",
      occasion: "Speaking at faith-based gatherings",
      examples: "Reading scripture, giving testimony, leading prayer",
      audienceSize: "Small to large (10–500+ people)",
      audienceSizeCategory: "Large",
      frequency: "Regular",
      task: "Deliver meaningful, reverent content appropriate to the setting"
    },
    {
      name: "Fundraising Events",
      occasion: "Advocating for causes or organizations",
      examples: "Charity appeal, donor thank-you, cause explanation",
      audienceSize: "Medium to large (20–200+ people)",
      audienceSizeCategory: "Large",
      frequency: "Regular",
      task: "Inspire support with compelling, emotionally resonant messaging"
    },
    {
      name: "Public Testimony",
      occasion: "Speaking at governmental proceedings",
      examples: "City council testimony, public comment period, committee hearing",
      audienceSize: "Small to medium (5–100 people)",
      audienceSizeCategory: "Medium",
      frequency: "Rare",
      task: "Present concise, fact-based statements on issues of concern"
    }
  ]
};

