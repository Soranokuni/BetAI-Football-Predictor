import React, { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const AdOverlay: React.FC<Props> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-6 animate-fade-in">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Advertisement</p>
          <h3 className="text-2xl font-bold text-white mb-4">Premium Analytics</h3>
          <p className="text-slate-300 mb-4">Unlock deep insights, expected goals (xG), and professional handicapper trends.</p>
          <div className="w-full h-48 bg-slate-700 rounded-lg animate-pulse flex items-center justify-center">
             <span className="text-slate-500 font-medium">Ad Placeholder Video</span>
          </div>
        </div>
        
        <button
          onClick={onComplete}
          disabled={timeLeft > 0}
          className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
            timeLeft > 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-white text-black hover:bg-slate-200 transform hover:scale-105'
          }`}
        >
          {timeLeft > 0 ? `Skip in ${timeLeft}s` : 'Skip to Predictions'}
        </button>
      </div>
    </div>
  );
};