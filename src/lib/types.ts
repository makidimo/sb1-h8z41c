export interface UserStory {
  content: string;
  updatedAt: string;
}

export interface UserAssessment {
  time: string;
  budget: string;
  timeline: string;
  updatedAt: string;
}

export interface CareerResult {
  id: string;
  userId: string;
  timestamp: string;
  story: UserStory;
  assessment: UserAssessment;
  recommendation: {
    title: string;
    description: string;
    timeline: string;
    skills: {
      name: string;
      level: number;
    }[];
    marketStats: {
      demand: string;
      salary: string;
      growth: string;
    };
    resources?: {
      title: string;
      type: string;
      link: string;
      duration?: string;
      cost?: string;
    }[];
    milestones?: string[];
  };
}