import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { User, LineChart, Clock, Calendar, Target, ArrowRight, BookOpen, TrendingUp, Sparkles, Award, BarChart } from 'lucide-react';
import { getUserResults } from '../lib/storage';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CareerResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        const latestResult = localStorage.getItem('latestResult');
        
        if (latestResult) {
          const parsedResult = JSON.parse(latestResult);
          setResults([parsedResult]);

          if (auth.currentUser) {
            const firestoreResults = await getUserResults();
            if (firestoreResults.length > 0) {
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
        toast.error('Failed to load your results');
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
      return;
    }
    setDisplayName(auth.currentUser.displayName || '');
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const trimmedName = displayName.trim();
    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: trimmedName
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.currentUser) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-50 p-4 rounded-xl">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
          </div>

          <div className="space-y-6">
            {/* Email Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="bg-gray-50 px-4 py-2 rounded-lg text-gray-600">
                {auth.currentUser.email}
              </div>
            </div>

            {/* Display Name */}
            <form onSubmit={handleUpdateProfile}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your name"
                    minLength={2}
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(auth.currentUser?.displayName || '');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg text-gray-600">
                    {displayName || 'No name set'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}
            </form>

            {/* Email Verification Status */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Email Verification
                  </h3>
                  <p className="text-sm text-gray-500">
                    Status: {auth.currentUser.emailVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
                {!auth.currentUser.emailVerified && (
                  <button
                    onClick={async () => {
                      try {
                        await auth.currentUser?.sendEmailVerification();
                        toast.success('Verification email sent!');
                      } catch (error) {
                        toast.error('Failed to send verification email');
                      }
                    }}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Resend Verification
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <button
            onClick={async () => {
              try {
                await auth.signOut();
                toast.success('Signed out successfully');
                navigate('/');
              } catch (error) {
                console.error('Error signing out:', error);
                toast.error('Failed to sign out');
              }
            }}
            className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard Section */}
        <div className="mt-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Career Evolution Progress</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Career Dashboard
            </h2>
          </div>

          {loadingResults ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No Results Yet
              </h3>
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
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {latestResult.recommendation.title}
                      </h3>
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
                      <p className="text-gray-900 font-semibold">
                        {latestResult.recommendation.marketStats.demand}
                      </p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <BarChart className="w-4 h-4" />
                        <span className="font-medium">Salary Range</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {latestResult.recommendation.marketStats.salary}
                      </p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">Growth Rate</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {latestResult.recommendation.marketStats.growth}
                      </p>
                    </div>
                  </div>

                  {/* Skills Progress */}
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Skills Progress
                  </h4>
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

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/story')}
                      className="w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-left flex items-center gap-3"
                    >
                      <Target className="w-5 h-5" />
                      New Assessment
                    </button>
                    <button
                      onClick={() => navigate('/results')}
                      className="w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-left flex items-center gap-3"
                    >
                      <BookOpen className="w-5 h-5" />
                      View Full Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};