import React, { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { analyzeCareerPath } from '../lib/openai';
import { saveUserResult } from '../lib/storage';
import { checkUserProgress } from '../lib/progressTracking';

const ANALYSIS_STEPS = [
  'Analyzing your career story...',
  'Evaluating industry trends...',
  'Matching learning resources...',
  'Generating personalized recommendations...',
  'Finalizing your career evolution path...'
];

const Processing: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processUserInput = useCallback(async () => {
    if (error) setError(null);

    try {

      if (!storyData || !assessmentData) {
        throw new Error('Please complete both your story and assessment first.');
      }

      let storyContent, time, budget, timeline;
      setCurrentStep(0);
      setProgress(20);

      try {
        const parsedStory = JSON.parse(storyData);
        const parsedAssessment = JSON.parse(assessmentData);

        storyContent = parsedStory.content;
        ({ time, budget, timeline } = parsedAssessment);

        if (!storyContent?.trim() || !time?.trim() || !budget?.trim() || !timeline?.trim()) {
          throw new Error('Missing required data. Please complete both sections fully.');
        }
      } catch (parseError) {
        console.error('Error parsing stored data:', parseError);
        throw new Error('Error processing your data. Please try again.');
      }

      // Update progress for user feedback
      setCurrentStep(1);
      setProgress(40);

      setCurrentStep(2);
      setProgress(60);

      // Process with OpenAI
      const recommendation = await analyzeCareerPath(
        storyContent,
        { time, budget, timeline }
      );

      setProgress(80);
      setCurrentStep(3);

      // Save the results
      await saveUserResult(
        { content: storyContent, updatedAt: new Date().toISOString() },
        { time, budget, timeline, updatedAt: new Date().toISOString() },
        recommendation
      );

      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/results');
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Failed to process your submission. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('API key')) {
          errorMessage = 'API configuration error. Please try again later.';
        } else if (error.message.includes('complete') || error.message.includes('Missing') || 
          error.message.includes('Missing') || 
          error.message.includes('Incomplete') || 
          error.message.includes('complete')
        ) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setProgress(0);
      setCurrentStep(0);
    }
  }, [navigate, error]);

  useEffect(() => {
    let mounted = true;
    
    if (mounted) {
      processUserInput();
    }

    return () => {
      mounted = false;
    };
  }, [processUserInput]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            <p>{error}</p>
          </div>
          <button
            onClick={processUserInput}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        
        <div className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {ANALYSIS_STEPS[currentStep]}
          </h1>
          <p className="text-gray-600 max-w-md">
            Please wait while we analyze your inputs and create your
            personalized career evolution plan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Processing;