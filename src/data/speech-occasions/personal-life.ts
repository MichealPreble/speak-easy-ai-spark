
import { SpeechCategory } from "@/types/speechOccasions";

export const personalLifeOccasions: SpeechCategory = {
  category: "Personal Life Events",
  occasions: [
    {
      name: "Weddings",
      occasion: "Delivering a toast, speech, or vows",
      examples: "Best man/maid of honor speech, groom/bride speech, parent's welcome remarks, personal vows",
      audienceSize: "Small to large (10–200+ people)",
      audienceSizeCategory: "Large",
      frequency: "Rare",
      task: "Prepare a heartfelt, engaging speech or statement to celebrate the couple",
      blogTag: "wedding-speech"
    },
    {
      name: "Funerals or Memorial Services",
      occasion: "Giving a eulogy or tribute",
      examples: "Sharing memories of the deceased, reading a poem, or delivering a farewell message",
      audienceSize: "Small to medium (10–100 people)",
      audienceSizeCategory: "Medium",
      frequency: "Rare",
      task: "Craft a respectful, emotional statement to honor the deceased",
      blogTag: "eulogy"
    },
    {
      name: "Birthday Celebrations",
      occasion: "Delivering birthday wishes or toast",
      examples: "Birthday toast, surprise party speech, milestone birthday tribute",
      audienceSize: "Small to medium (5–50 people)",
      audienceSizeCategory: "Small",
      frequency: "Regular",
      task: "Create a warm, celebratory message honoring the birthday person"
    },
    {
      name: "Baby Showers",
      occasion: "Hosting or speaking at baby shower",
      examples: "Welcome speech, games facilitation, gift presentation",
      audienceSize: "Small (5–30 people)",
      audienceSizeCategory: "Small",
      frequency: "Rare",
      task: "Prepare cheerful, supportive remarks for the parents-to-be"
    },
    {
      name: "Anniversaries",
      occasion: "Celebrating relationship milestones",
      examples: "Anniversary toast, tribute to the couple, renewal of vows",
      audienceSize: "Small to medium (10–50 people)",
      audienceSizeCategory: "Small",
      frequency: "Regular",
      task: "Craft a meaningful reflection on the couple's journey together"
    }
  ]
};

