import { SpeechOccasionsData } from "@/types/speechOccasions";

// Comprehensive list of speech occasions organized by category
export const SPEECH_OCCASIONS: SpeechOccasionsData = [
  {
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
    ],
  },
  {
    category: "Professional Life Events",
    occasions: [
      {
        name: "Team Meetings",
        occasion: "Presenting updates, ideas, or plans to colleagues",
        examples: "Project status update, pitching a new initiative, leading a brainstorming session",
        audienceSize: "Small to medium (5–50 people)",
        audienceSizeCategory: "Small",
        frequency: "Regular",
        task: "Prepare a clear, professional presentation or statement",
        blogTag: "team-meetings"
      },
      {
        name: "Job Interviews",
        occasion: "Responding to interview questions or self-introduction",
        examples: "Answering 'Tell me about yourself', describing experience, asking questions",
        audienceSize: "Very small (1–5 people)",
        audienceSizeCategory: "Small",
        frequency: "Regular",
        task: "Craft concise, compelling responses that highlight your qualifications",
        blogTag: "job-interviews"
      },
      {
        name: "Networking Events",
        occasion: "Introducing yourself or your business",
        examples: "Elevator pitch, business introduction, follow-up conversation",
        audienceSize: "One-on-one or small groups",
        audienceSizeCategory: "Small",
        frequency: "Regular",
        task: "Create a memorable, brief introduction that sparks interest"
      },
      {
        name: "Client Presentations",
        occasion: "Pitching to or updating clients",
        examples: "Sales presentation, project proposal, progress report",
        audienceSize: "Small (2–20 people)",
        audienceSizeCategory: "Small",
        frequency: "Regular",
        task: "Develop a persuasive, value-focused presentation",
        blogTag: "client-presentations"
      },
      {
        name: "Performance Reviews",
        occasion: "Discussing work performance",
        examples: "Self-assessment, accomplishment summary, goal setting",
        audienceSize: "Very small (1–3 people)",
        audienceSizeCategory: "Small",
        frequency: "Regular",
        task: "Prepare honest, balanced reflections on your work"
      }
    ],
  },
  {
    category: "Academic and Educational Contexts",
    occasions: [
      {
        name: "Class Presentations",
        occasion: "Presenting academic work to classmates",
        examples: "Research presentation, project showcase, debate opening",
        audienceSize: "Small to medium (10–50 people)",
        task: "Organize clear, informative content with academic rigor",
      },
      {
        name: "Academic Conferences",
        occasion: "Presenting research or participating in panels",
        examples: "Research presentation, poster session, panel discussion",
        audienceSize: "Medium to large (20–200+ people)",
        task: "Communicate complex information in an accessible, engaging way",
      },
      {
        name: "Thesis Defense",
        occasion: "Defending academic research",
        examples: "Dissertation defense, thesis presentation, committee questions",
        audienceSize: "Small (3–10 people)",
        task: "Present and defend your research with clarity and confidence",
      },
      {
        name: "Teaching",
        occasion: "Delivering lessons or lectures",
        examples: "Class lecture, workshop facilitation, tutorial",
        audienceSize: "Small to large (5–200+ people)",
        task: "Explain concepts clearly and engage learners effectively",
      },
      {
        name: "School Events",
        occasion: "Speaking at school gatherings",
        examples: "Parent-teacher presentations, school clubs, student government",
        audienceSize: "Small to medium (10–100 people)",
        task: "Deliver clear, appropriately formal remarks for the school community",
      }
    ],
  },
  {
    category: "Community and Civic Engagements",
    occasions: [
      {
        name: "Community Meetings",
        occasion: "Participating in local governance",
        examples: "Town hall comment, neighborhood association, public hearing testimony",
        audienceSize: "Small to medium (10–100 people)",
        task: "Express community concerns or positions clearly and persuasively",
      },
      {
        name: "Religious Services",
        occasion: "Speaking at faith-based gatherings",
        examples: "Reading scripture, giving testimony, leading prayer",
        audienceSize: "Small to large (10–500+ people)",
        task: "Deliver meaningful, reverent content appropriate to the setting",
      },
      {
        name: "Fundraising Events",
        occasion: "Advocating for causes or organizations",
        examples: "Charity appeal, donor thank-you, cause explanation",
        audienceSize: "Medium to large (20–200+ people)",
        task: "Inspire support with compelling, emotionally resonant messaging",
      },
      {
        name: "Volunteer Coordination",
        occasion: "Leading or organizing volunteers",
        examples: "Training volunteers, assigning tasks, expressing appreciation",
        audienceSize: "Small to medium (5–50 people)",
        task: "Provide clear direction and motivation for volunteer efforts",
      },
      {
        name: "Public Testimony",
        occasion: "Speaking at governmental proceedings",
        examples: "City council testimony, public comment period, committee hearing",
        audienceSize: "Small to medium (5–100 people)",
        task: "Present concise, fact-based statements on issues of concern",
      }
    ],
  },
  {
    category: "Special Occasions and Miscellaneous",
    occasions: [
      {
        name: "Award Ceremonies",
        occasion: "Accepting or presenting awards",
        examples: "Acceptance speech, award introduction, honoree tribute",
        audienceSize: "Medium to large (20–500+ people)",
        task: "Express gratitude or recognition with sincerity and appropriate emotion",
      },
      {
        name: "Media Interviews",
        occasion: "Responding to journalists or reporters",
        examples: "Print interview, podcast guest, TV appearance",
        audienceSize: "Direct interviewer plus potentially large audience",
        task: "Provide clear, quotable responses that convey your message",
      },
      {
        name: "Podcast or Video Content",
        occasion: "Creating spoken content for distribution",
        examples: "Podcast intro/outro, YouTube script, instructional video",
        audienceSize: "Varies (potentially unlimited)",
        task: "Develop engaging, clear content optimized for audio/visual media",
      },
      {
        name: "Retirement Celebrations",
        occasion: "Honoring career conclusions",
        examples: "Retirement speech, colleague tribute, career reflection",
        audienceSize: "Small to medium (10–100 people)",
        task: "Create a meaningful reflection on professional accomplishments",
      },
      {
        name: "Crisis Communication",
        occasion: "Addressing emergencies or problems",
        examples: "Public safety announcement, organizational response, apology",
        audienceSize: "Varies based on crisis scope",
        task: "Deliver clear, reassuring information during challenging circumstances",
      }
    ],
  }
];
