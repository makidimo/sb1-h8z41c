export const checkUserProgress = () => {
  try {
    const storyData = localStorage.getItem('userStory');
    const assessmentData = localStorage.getItem('userAssessment');
    
    // Detailed story check
    const story = storyData ? JSON.parse(storyData) : null;
    const storyLength = story?.content?.trim().length || 0;
    const isStoryComplete = storyLength >= 50;

    // Detailed assessment check
    const assessment = assessmentData ? JSON.parse(assessmentData) : null;
    const isAssessmentComplete = assessment?.completed === true;

    return {
      isStoryComplete,
      isAssessmentComplete,
      storyLength,
      missingStoryCharacters: 50 - storyLength,
      assessmentData: assessment,
      canProceed: isStoryComplete && isAssessmentComplete
    };
  } catch (error) {
    console.error('Error checking progress:', error);
    return {
      isStoryComplete: false,
      isAssessmentComplete: false,
      storyLength: 0,
      missingStoryCharacters: 50,
      assessmentData: null,
      canProceed: false
    };
  }
};