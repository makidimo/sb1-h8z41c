import React, { useState, useEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { saveStory } from '../lib/storage';
import { auth } from '../lib/firebase';

const AUTOSAVE_DELAY = 30000; // 30 seconds
const MIN_CHARS = 50;
const MAX_CHARS = 5000;

const STORY_PROMPTS = [
  "What challenges are you facing in your career?",
  "How has AI affected your industry?",
  "What uncertainties are you dealing with?",
  "What are your career aspirations?",
  "What skills do you want to develop?",
];

export const StoryForm: React.FC = () => {
  const navigate = useNavigate();
  const [story, setStory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(0);

  const isValid = story.length >= MIN_CHARS;
  const remainingChars = MAX_CHARS - story.length;
  const progress = Math.min((story.length / MIN_CHARS) * 100, 100);

  const saveStory = useCallback(async (showToast = false) => {
    if (!story) return;
    
    // Save story data with proper structure
    const storyData = {
      content: story,
      updatedAt: new Date().toISOString(),
      completed: story.length >= MIN_CHARS
    };
    
    localStorage.setItem('userStory', JSON.stringify(storyData));
    if (showToast) toast.success('Progress saved!');

    // If user is logged in, also save to Firestore
    if (auth.currentUser) {
      setIsSaving(true);
      try {
        await saveStory(story);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving story:', error);
        if (showToast) toast.error('Failed to sync with cloud');
      }
      setIsSaving(false);
    }
  }, [story]);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (story.length > 0) {
        saveStory();
      }
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [story, saveStory]);

  // Rotate prompts
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % STORY_PROMPTS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl">
        <p className="text-gray-600 italic transition-all duration-500">
          {STORY_PROMPTS[currentPrompt]}
        </p>
      </div>

      <div className="relative">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="w-full h-64 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          placeholder="Share your career story..."
          maxLength={MAX_CHARS}
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-4 text-sm text-gray-500">
          {lastSaved && (
            <span>
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <span className={remainingChars < 100 ? 'text-orange-500' : ''}>
            {remainingChars} characters remaining
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {story.length < MIN_CHARS
              ? `${MIN_CHARS - story.length} more characters needed`
              : '✨ Looking good!'}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => saveStory(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          
          <button
            disabled={!isValid}
            onClick={() => navigate('/assessment')}
            className={`px-6 py-2 rounded-lg text-white transition-all duration-200 ${
              isValid
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};