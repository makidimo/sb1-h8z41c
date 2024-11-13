interface CareerResponse {
  title: string;
  description: string;
  timeline: string;
  skills: Array<{ name: string; level: number }>;
  marketStats: {
    demand: string;
    salary: string;
    growth: string;
  };
  resources: Array<{
    title: string;
    type: string;
    link: string;
    duration?: string;
    cost?: string;
  }>;
  milestones: string[];
}

export async function analyzeCareerPath(
  story: string,
  assessment: { time: string; budget: string; timeline: string }
): Promise<CareerResponse> {
  try {
    if (!story.trim()) {
      throw new Error('Please provide your career story.');
    }

    if (!assessment.time || !assessment.budget || !assessment.timeline) {
      throw new Error('Please complete all assessment questions.');
    }

    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ story, assessment }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze career path. Please try again.');
    }

    const data = await response.json();
    return data as CareerResponse;
  } catch (error) {
    console.error('Error analyzing career path:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}