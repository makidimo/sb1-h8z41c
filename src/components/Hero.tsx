import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Compass, LineChart } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto relative">
        <div className="relative z-20 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
            Navigate Your Career in the
            <span className="hero-text-gradient"> AI Age</span>
          </h1>
          <p className="mt-8 text-xl text-gray-600 leading-relaxed">
            Transform your professional journey through personalized, narrative-driven guidance.
            Let AI help you discover and evolve your career path in an ever-changing landscape.
          </p>
          <div className="mt-12 flex gap-6 justify-center">
            <Link
              to="/story"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Start Your Journey
            </Link>
            <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-lg text-lg font-medium border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg hover:scale-105">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 relative z-20">
          {[
            {
              title: 'AI-Powered Insights',
              description:
                'Advanced algorithms analyze your story and skills to provide personalized career guidance.',
              image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
            },
            {
              title: 'Narrative Approach',
              description:
                'Share your professional story and let us help you write the next chapter of your career.',
              image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
            },
            {
              title: 'Resource-Aware Planning',
              description:
                'Get actionable recommendations that consider your time, budget, and personal constraints.',
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="absolute inset-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover filter blur-[2px] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              </div>
              <div className="relative p-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/90">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};