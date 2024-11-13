import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="w-4 h-6 bg-indigo-400 rounded-sm"></div>
      <div className="w-5 h-6 bg-indigo-500 rounded-sm"></div>
      <div className="w-6 h-6 bg-indigo-600 rounded-sm"></div>
      <span className="ml-2 text-xl font-semibold text-gray-800">evolvyng</span>
    </div>
  );
};