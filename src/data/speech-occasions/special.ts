
import { SpeechCategory } from "@/types/speechOccasions";

export const specialOccasions: SpeechCategory = {
  category: "Special Occasions and Miscellaneous",
  occasions: [
    {
      name: "Award Ceremonies",
      occasion: "Accepting or presenting awards",
      examples: "Acceptance speech, award introduction, honoree tribute",
      audienceSize: "Medium to large (20–500+ people)",
      audienceSizeCategory: "Large",
      frequency: "Rare",
      task: "Express gratitude or recognition with sincerity and appropriate emotion"
    },
    {
      name: "Media Interviews",
      occasion: "Responding to journalists or reporters",
      examples: "Print interview, podcast guest, TV appearance",
      audienceSize: "Direct interviewer plus potentially large audience",
      audienceSizeCategory: "Large",
      frequency: "Rare",
      task: "Provide clear, quotable responses that convey your message"
    },
    {
      name: "Crisis Communication",
      occasion: "Addressing emergencies or problems",
      examples: "Public safety announcement, organizational response, apology",
      audienceSize: "Varies based on crisis scope",
      audienceSizeCategory: "Large",
      frequency: "Rare",
      task: "Deliver clear, reassuring information during challenging circumstances"
    }
  ]
};

