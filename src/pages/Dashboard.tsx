import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserResults } from '../lib/storage';
import { auth } from '../lib/firebase';
import { CareerResult } from '../lib/types';
import { LineChart, Clock, Calendar, Target, ArrowRight, BookOpen, TrendingUp, Sparkles, Award, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [results, setResults] = useState<CareerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        // First check localStorage for the latest result
        const latestResult = localStorage.getItem('latestResult');
        const storyData = localStorage.getItem('userStory');
        const assessmentData = localStorage.getItem('userAssessment');

        if (latestResult && storyData && assessmentData) {
          const parsedResult = JSON.parse(latestResult);
          setResults([parsedResult]);
          setHasCompletedAssessment(true);

          // If user is logged in, also fetch from Firestore
          if (auth.currentUser) {
            const firestoreResults = await getUserResults();
            if (firestoreResults.length > 0) {
              // Combine results, removing duplicates
              const allResults = [
                parsedResult,
                ...firestoreResults.filter(r => r.id !== parsedResult.id)
              ];
              setResults(allResults);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load your results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const latestResult = results[0];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Recommendations</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{auth.currentUser ? `, ${auth.currentUser.email?.split('@')[0]}` : ''}!
          </h1>
          <p className="text-gray-600">
            Your personalized career evolution path and recommendations
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No Results Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start your career evolution journey to see your personalized recommendations
            </p>
            <button
              onClick={() => navigate('/story')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
            >
              Begin Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest Assessment Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {latestResult.recommendation.title}
                    </h2>
                    <p className="text-gray-600">
                      {latestResult.recommendation.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700">
                    <Calendar className="w-4 h-4" />
                    <span>{latestResult.recommendation.timeline}</span>
                  </div>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">Market Demand</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{latestResult.recommendation.marketStats.demand}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                      <BarChart className="w-4 h-4" />
                      <span className="font-medium">Salary Range</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{latestResult.recommendation.marketStats.salary}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Growth Rate</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{latestResult.recommendation.marketStats.growth}</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Skills to Develop
                </h3>
                <div className="space-y-4">
                  {latestResult.recommendation.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/story')}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-left flex items-center gap-3"
                  >
                    <Target className="w-5 h-5" />
                    New Assessment
                  </button>
                  <button
                    onClick={() => navigate('/history')}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-left flex items-center gap-3"
                  >
                    <LineChart className="w-5 h-5" />
                    View History
                  </button>
                  <button
                    onClick={() => navigate('/results')}
                    className="w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-left flex items-center gap-3"
                  >
                    <BookOpen className="w-5 h-5" />
                    Learning Resources
                  </button>
                </div>
              </div>

              {/* Assessment History */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Previous Recommendations
                </h3>
                <div className="space-y-4">
                  {results.slice(0, 3).map((result, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(`/results/${result.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {result.recommendation.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(result.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};