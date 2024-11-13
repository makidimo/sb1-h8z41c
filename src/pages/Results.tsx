import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserResult } from '../lib/storage';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';
import {
  Sparkles,
  BookOpen,
  Target,
  Calendar,
  ChevronRight,
  Download, 
  Share2, 
  TrendingUp,
  Users,
  Award,
  BarChart
} from 'lucide-react';

interface Recommendation {
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
  resources: {
    title: string;
    type: string;
    link: string;
    duration?: string;
    cost?: string;
  }[];
  milestones: string[];
}

export const Results: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'immediate' | 'short' | 'long'>('immediate');
  const navigate = useNavigate();

  const saveResult = async () => {
    try {
      if (!auth.currentUser) {
        toast.error('Please sign in to save your results.');
        return;
      }

      // Get story from localStorage
      const storyData = localStorage.getItem('userStory');
      const assessmentData = localStorage.getItem('userAssessment');
      
      if (!storyData || !assessmentData) {
        toast.error('Missing story or assessment data');
        return;
      }

      const story = JSON.parse(storyData);
      const assessment = JSON.parse(assessmentData);
      const currentRecommendation = recommendations[selectedTab];

      if (!story.content || !assessment.time) {
        toast.error('Missing required data');
        return;
      }

      const recommendation = {
        title: currentRecommendation.title,
        description: currentRecommendation.description,
        timeline: currentRecommendation.timeline,
        skills: currentRecommendation.skills,
        marketStats: currentRecommendation.marketStats,
        resources: currentRecommendation.resources,
        milestones: currentRecommendation.milestones
      };

      await saveUserResult(story, assessment, recommendation);
      
      toast.success('Result saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Failed to save result');
    }
  };

  const recommendations: Record<string, Recommendation> = {
    immediate: {
      title: 'Data Analysis Fundamentals',
      description: 'Build a strong foundation in data analysis to complement your current role and prepare for future transitions.',
      skills: [
        { name: 'SQL', level: 85 },
        { name: 'Python', level: 70 },
        { name: 'Data Visualization', level: 65 },
        { name: 'Statistical Analysis', level: 60 }
      ],
      marketStats: {
        demand: '↑ High Demand',
        salary: '$75,000 - $95,000',
        growth: '+25% YoY'
      },
      timeline: '0-3 months',
      resources: [
        {
          title: 'SQL Essential Training',
          type: 'Course',
          duration: '2-4 weeks',
          cost: 'Free',
          link: '#'
        },
        {
          title: 'Python for Data Analysis',
          type: 'Workshop',
          duration: '6 weeks',
          cost: '$199',
          link: '#'
        }
      ],
      milestones: [
        'Complete SQL fundamentals certification',
        'Build first data visualization project',
        'Join data analytics community'
      ]
    },
    short: {
      title: 'Machine Learning Applications',
      description: 'Develop practical machine learning skills to enhance your value in the AI-driven market.',
      skills: [
        { name: 'Machine Learning', level: 75 },
        { name: 'Deep Learning', level: 65 },
        { name: 'Model Deployment', level: 60 },
        { name: 'Data Engineering', level: 70 }
      ],
      marketStats: {
        demand: '↑ Very High Demand',
        salary: '$95,000 - $130,000',
        growth: '+35% YoY'
      },
      timeline: '3-6 months',
      resources: [
        {
          title: 'Applied Machine Learning',
          type: 'Course',
          duration: '3 months',
          cost: '$499',
          link: '#'
        },
        {
          title: 'Industry Project Workshop',
          type: 'Workshop',
          duration: '8 weeks',
          cost: '$299',
          link: '#'
        }
      ],
      milestones: [
        'Complete 2 ML projects',
        'Contribute to open source',
        'Build professional portfolio'
      ]
    },
    long: {
      title: 'AI Strategy & Leadership',
      description: 'Position yourself for leadership roles in AI-driven organizations.',
      skills: [
        { name: 'AI Strategy', level: 80 },
        { name: 'Team Leadership', level: 85 },
        { name: 'Project Management', level: 75 },
        { name: 'Business Analytics', level: 70 }
      ],
      marketStats: {
        demand: '↑ Extremely High Demand',
        salary: '$130,000 - $180,000',
        growth: '+40% YoY'
      },
      timeline: '6-12 months',
      resources: [
        {
          title: 'AI Strategy for Leaders',
          type: 'Course',
          duration: '4 months',
          cost: '$899',
          link: '#'
        },
        {
          title: 'Leadership in Tech',
          type: 'Mentorship',
          duration: '6 months',
          cost: '$1,499',
          link: '#'
        }
      ],
      milestones: [
        'Lead cross-functional AI project',
        'Develop AI implementation strategy',
        'Build industry network'
      ]
    }
  };

  const currentRecommendation = recommendations[selectedTab];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Recommendations</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personalized Career Evolution Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your story and preferences, we've crafted a comprehensive development plan
            aligned with your goals and resources.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            {[
              { id: 'immediate', label: 'Immediate Steps' },
              { id: 'short', label: 'Short Term' },
              { id: 'long', label: 'Long Term' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main Overview Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentRecommendation.title}
                  </h2>
                  <p className="text-gray-600">
                    {currentRecommendation.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700">
                  <Calendar className="w-4 h-4" />
                  <span>{currentRecommendation.timeline}</span>
                </div>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Market Demand</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{currentRecommendation.marketStats.demand}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <BarChart className="w-4 h-4" />
                    <span className="font-medium">Salary Range</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{currentRecommendation.marketStats.salary}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Growth Rate</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{currentRecommendation.marketStats.growth}</p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Skills to Develop
                </h3>
                <div className="space-y-4">
                  {currentRecommendation.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Section */}
              <div className="border-t pt-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Milestones
                  </h3>
                  <div className="space-y-3">
                    {currentRecommendation.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-gray-700"
                      > 
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Recommended Resources
              </h3>
              <div className="space-y-4">
                {currentRecommendation.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    className="block p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {resource.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {resource.type}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex gap-3 text-sm text-gray-600">
                      {resource.duration && (
                        <span>{resource.duration}</span>
                      )}
                      {resource.cost && (
                        <>
                          <span>•</span>
                          <span>{resource.cost}</span>
                        </>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Full Plan
              </button>
              <button className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Plan
              </button>
            </div>
            
            {/* Community Stats */}
            <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Users className="w-5 h-5" />
                <span className="font-medium">Community Insights</span>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Join 2,500+ professionals following a similar career path
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">+2.5k others</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};