import { useState, useEffect } from 'react';
import { StoryForm } from '../components/StoryForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StoryCapture: React.FC = () => {
  const [story, setStory] = useState('');

  useEffect(() => {
    // Load saved story from localStorage if exists
    const savedStory = localStorage.getItem('userStory');
    if (savedStory) {
      const { content } = JSON.parse(savedStory);
      setStory(content);
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Story
          </h1>
          <p className="text-xl text-gray-600">
            Help us understand your career journey and challenges.
            Your story will help us provide personalized guidance.
          </p>
        </div>

        <StoryForm />
      </div>
    </div>
  );
};