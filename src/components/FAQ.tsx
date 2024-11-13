import React from 'react';
import { Plus, Minus } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: 'How does Evolvyng use AI to guide career decisions?',
      answer: 'Evolvyng uses advanced AI algorithms to analyze your professional narrative, skills, and goals. It then combines this with market trends and industry insights to provide personalized career guidance and actionable recommendations.'
    },
    {
      question: 'Is Evolvyng suitable for career changers?',
      answer: 'Absolutely! Evolvyng is especially valuable for professionals considering career changes. Our platform helps identify transferable skills and provides structured paths for transitioning into new roles or industries.'
    },
    {
      question: 'How does the narrative-driven approach work?',
      answer: 'Instead of just analyzing your resume, Evolvyng encourages you to share your professional story, including your motivations, challenges, and aspirations. This narrative approach helps our AI understand the context behind your career decisions.'
    },
    {
      question: 'What makes Evolvyng different from traditional career counseling?',
      answer: 'Evolvyng combines the personal touch of traditional career counseling with AI-powered insights and data-driven recommendations. Our platform considers your resource constraints and provides actionable, realistic career paths.'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about Evolvyng
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center gap-4"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                )}
              </button>
              <div
                className={`px-8 transition-all duration-200 ease-in-out ${
                  openIndex === index ? 'pb-6 max-h-96' : 'max-h-0 overflow-hidden'
                }`}
              >
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};