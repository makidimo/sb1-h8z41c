import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CareerResult } from '../lib/types';
import { Calendar, ChevronRight, LineChart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const History: React.FC = () => {
  const [results, setResults] = useState<CareerResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsRef = collection(db, 'results');
        const q = query(resultsRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        
        const fetchedResults = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CareerResult));
        
        setResults(fetchedResults);
      } catch (error) {
        console.error('Error fetching results:', error);
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Results History</h1>
          <Link
            to="/results"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View Latest Result
          </Link>
        </div>

        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
              <p className="text-gray-600">No results found yet.</p>
            </div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {result.recommendation.title}
                    </h2>
                    <p className="text-gray-600">{result.recommendation.description}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={result.timestamp}>
                      {new Date(result.timestamp).toLocaleDateString()}
                    </time>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span>Available Time: {result.assessment.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <LineChart className="w-5 h-5 text-indigo-600" />
                    <span>Budget: {result.assessment.budget}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>Timeline: {result.assessment.timeline}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {result.recommendation.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/results/${result.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};