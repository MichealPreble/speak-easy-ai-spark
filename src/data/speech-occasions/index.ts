
import { SpeechOccasionsData } from "@/types/speechOccasions";
import { personalLifeOccasions } from "./personal-life";
import { professionalLifeOccasions } from "./professional-life";
import { academicOccasions } from "./academic";
import { communityOccasions } from "./community";
import { specialOccasions } from "./special";

export const SPEECH_OCCASIONS: SpeechOccasionsData = [
  personalLifeOccasions,
  professionalLifeOccasions,
  academicOccasions,
  communityOccasions,
  specialOccasions
];

