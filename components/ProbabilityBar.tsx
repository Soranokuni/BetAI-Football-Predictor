import React from 'react';
import { Prediction } from '../types';

interface Props {
  prediction: Prediction;
}

export const ProbabilityBar: React.FC<Props> = ({ prediction }) => {
  // Ensure stats add up to 100 for visual consistency
  const total = prediction.homeWin + prediction.draw + prediction.awayWin;
  const hw = (prediction.homeWin / total) * 100;
  const d = (prediction.draw / total) * 100;
  const aw = (prediction.awayWin / total) * 100;

  return (
    <div className="w-full mt-3">
      <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">
        <span>1 ({Math.round(hw)}%)</span>
        <span>X ({Math.round(d)}%)</span>
        <span>2 ({Math.round(aw)}%)</span>
      </div>
      <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-slate-700">
        <div 
          className="h-full bg-emerald-500" 
          style={{ width: `${hw}%` }} 
        />
        <div 
          className="h-full bg-slate-400" 
          style={{ width: `${d}%` }} 
        />
        <div 
          className="h-full bg-rose-500" 
          style={{ width: `${aw}%` }} 
        />
      </div>
    </div>
  );
};