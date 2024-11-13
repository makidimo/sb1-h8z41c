import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { saveAssessment } from '../lib/storage';
import { checkUserProgress } from '../lib/progressTracking';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Clock, Wallet, Calendar } from 'lucide-react';

const SECTIONS = [
  {
    id: 'time',
    title: 'Available Learning Time',
    description: 'How many hours per week can you dedicate to learning?',
    icon: Clock,
    options: [
      { value: '0-2', label: '0-2 hours' },
      { value: '2-5', label: '2-5 hours' },
      { value: '5-10', label: '5-10 hours' },
      { value: '10+', label: '10+ hours' }
    ]
  },
  {
    id: 'budget',
    title: 'Learning Budget',
    description: 'What\'s your budget for learning resources?',
    icon: Wallet,
    options: [
      { value: '0-100', label: '$0-100' },
      { value: '100-500', label: '$100-500' },
      { value: '500-2000', label: '$500-2,000' },
      { value: '2000+', label: '$2,000+' }
    ]
  },
  {
    id: 'timeline',
    title: 'Transition Timeline',
    description: 'When would you like to complete your career transition?',
    icon: Calendar,
    options: [
      { value: '3', label: '3 months' },
      { value: '6', label: '6 months' },
      { value: '12', label: '1 year' }
    ]
  }
];

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('');

  const currentSectionData = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  const handleNext = () => {
    const newAnswers = { ...answers, [currentSectionData.id]: selectedValue };
    setAnswers(newAnswers);
    setSelectedValue('');
    setCurrentSection(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const finalAnswers = { 
        ...answers, 
        [currentSectionData.id]: selectedValue 
      };

      const assessmentData = {
        time: finalAnswers.time || '',
        budget: finalAnswers.budget || '',
        timeline: finalAnswers.timeline || '',
        updatedAt: new Date().toISOString(),
        completed: true
      };


      // Save to localStorage
      localStorage.setItem('userAssessment', JSON.stringify(assessmentData));
      
      // Check overall progress before proceeding
      const { isStoryComplete, storyLength, missingStoryCharacters } = checkUserProgress();
      if (!isStoryComplete) {
        if (storyLength === 0) {
          toast.error('Please share your career story first', {
            duration: 4000,
            action: {
              label: 'Go to Story',
              onClick: () => navigate('/story')
            }
          });
        } else {
          toast.error(
            `Your story needs ${missingStoryCharacters} more characters`, 
            {
              duration: 4000,
              action: {
                label: 'Complete Story',
                onClick: () => navigate('/story')
              }
            }
          );
        }
        return;
      }

      if (auth.currentUser) {
        await saveAssessment(assessmentData);
      }
      
      navigate('/processing', { replace: true });
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save your assessment');
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      navigate('/story');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Step {currentSection + 1} of {SECTIONS.length}
          </div>
        </div>

        {/* Current section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-50 p-3 rounded-xl">
              {React.createElement(currentSectionData.icon, {
                className: "w-6 h-6 text-indigo-600"
              })}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentSectionData.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {currentSectionData.description}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {currentSectionData.options.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedValue(option.value)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedValue === option.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
                disabled={saving}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  {selectedValue === option.value && (
                    <ArrowRight className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back
            </button>
            <button
              onClick={currentSection === SECTIONS.length - 1 ? handleSubmit : handleNext}
              disabled={!selectedValue || saving}
              className={`px-6 py-2 rounded-lg text-white transition-all duration-200 ${
                selectedValue && !saving
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving...' : currentSection === SECTIONS.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};