import React from 'react';
import { Rocket, Target, Sparkles, Users, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';

export const WhyEvolvyng: React.FC = () => {
  const [selectedReason, setSelectedReason] = React.useState<number | null>(null);

  const reasons = [
    {
      icon: Target,
      title: 'Precision Career Guidance',
      description: 'Our AI analyzes your unique story to provide tailored career recommendations that align with your goals and values.',
      details: {
        benefits: [
          'Personalized skill gap analysis',
          'Industry-specific recommendations',
          'Custom learning pathways',
          'Salary insights and negotiations guidance'
        ],
        quote: "The precision of Evolvyng's recommendations helped me identify exactly what I needed to focus on for my next career move.",
        stats: 'Users report 85% higher confidence in career decisions after using our precision guidance system.'
      }
    },
    {
      icon: Rocket,
      title: 'Future-Proof Your Career',
      description: 'Stay ahead of industry trends and adapt to the evolving job market with AI-powered insights and recommendations.',
      details: {
        benefits: [
          'Real-time industry trend analysis',
          'Emerging skills forecasting',
          'AI disruption impact assessment',
          'Adaptive career planning'
        ],
        quote: "Evolvyng helped me anticipate changes in my industry before they happened, allowing me to stay ahead of the curve.",
        stats: '93% of users feel better prepared for future industry changes after using our platform.'
      }
    },
    {
      icon: Sparkles,
      title: 'Unlock Your Potential',
      description: 'Discover hidden opportunities and skills that could lead to unexpected and rewarding career paths.',
      details: {
        benefits: [
          'Hidden skill discovery',
          'Alternative career path exploration',
          'Strength-based opportunity matching',
          'Personal brand development'
        ],
        quote: "I discovered talents I didn't even know I had, opening up entirely new career possibilities.",
        stats: 'Users discover an average of 7 new potential career paths based on their hidden talents.'
      }
    },
    {
      icon: Users,
      title: 'Community Insights',
      description: 'Learn from the experiences of professionals who successfully navigated similar career transitions.',
      details: {
        benefits: [
          'Peer success stories',
          'Industry mentor matching',
          'Collaborative learning opportunities',
          'Network expansion strategies'
        ],
        quote: "The community insights provided real-world perspective that was invaluable for my career transition.",
        stats: 'Our community members are 4x more likely to successfully complete their career transitions.'
      }
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-indigo-50/30 to-white/0"></div>
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Evolvyng?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Navigate your career evolution with confidence using our AI-powered platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedReason(index)}
            >
              <div className="flex items-start gap-4">
                <div className="bg-indigo-50 rounded-xl p-3 group-hover:scale-110 transition-transform duration-200">
                  <reason.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Modal
        isOpen={selectedReason !== null}
        onClose={() => setSelectedReason(null)}
      > 
        {selectedReason !== null && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 rounded-xl p-3">
                {React.createElement(reasons[selectedReason].icon, {
                  className: "w-8 h-8 text-indigo-600"
                })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {reasons[selectedReason].title}
              </h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              {reasons[selectedReason].description}
            </p>

            <div className="bg-indigo-50 rounded-xl p-6 mt-6">
              <blockquote className="text-lg italic text-gray-700">
                "{reasons[selectedReason].details.quote}"
              </blockquote>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Key Benefits</h4>
              <ul className="space-y-3">
                {reasons[selectedReason].details.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};