import React from 'react';
import { Match } from '../types';
import { ProbabilityBar } from './ProbabilityBar';
import { ChevronRight, Info } from 'lucide-react';

interface Props {
  match: Match;
  onDetailClick: (match: Match) => void;
}

export const MatchCard: React.FC<Props> = ({ match, onDetailClick }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg hover:border-slate-600 transition-all">
      {/* Header: League & Time */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-1 rounded">
          {match.league}
        </span>
        <span className="text-xs text-slate-400 font-mono">{match.time} UTC</span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-white leading-tight">{match.homeTeam}</h3>
        </div>
        <div className="px-3 text-slate-500 text-xs font-bold">VS</div>
        <div className="flex-1 text-right">
            <h3 className="text-lg font-bold text-white leading-tight">{match.awayTeam}</h3>
        </div>
      </div>

      {/* Probabilities */}
      <ProbabilityBar prediction={match.prediction} />

      {/* Quick Bets */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 rounded p-2 border border-emerald-900/30">
            <p className="text-[10px] text-emerald-500 font-bold uppercase">Safe Bet</p>
            <p className="text-sm text-slate-200 truncate">{match.safeBet.title}</p>
            <p className="text-xs text-slate-500">{match.safeBet.odds}</p>
        </div>
        <div className="bg-slate-900/50 rounded p-2 border border-amber-900/30">
            <p className="text-[10px] text-amber-500 font-bold uppercase">Value Bet</p>
            <p className="text-sm text-slate-200 truncate">{match.valueBet.title}</p>
            <p className="text-xs text-slate-500">{match.valueBet.odds}</p>
        </div>
      </div>

      {/* Action */}
      <button 
        onClick={() => onDetailClick(match)}
        className="w-full mt-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 group"
      >
        <Info className="w-4 h-4" />
        Analysis & Reasoning
        <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
};