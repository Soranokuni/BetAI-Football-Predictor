import React from 'react';
import { Match } from '../types';
import { X, TrendingUp, Shield, Activity, BrainCircuit } from 'lucide-react';

interface Props {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<Props> = ({ match, isOpen, onClose }) => {
  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative w-full sm:max-w-2xl bg-slate-900 border-t sm:border border-slate-700 sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-transform duration-300 animate-slide-up">
            
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    AI Analysis
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Teams Header */}
                <div className="text-center mb-6">
                    <div className="text-sm text-slate-400 mb-1">{match.league} • {match.time}</div>
                    <div className="flex items-center justify-center gap-4 text-2xl font-bold text-white">
                        <span className="flex-1 text-right">{match.homeTeam}</span>
                        <span className="text-slate-600 text-sm font-normal">VS</span>
                        <span className="flex-1 text-left">{match.awayTeam}</span>
                    </div>
                </div>

                {/* Verdicts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                            <Shield className="w-4 h-4" />
                            Safe Option
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{match.safeBet.title}</div>
                        <div className="text-sm text-emerald-400/80 font-mono">@{match.safeBet.odds}</div>
                        <p className="text-xs text-slate-400 mt-2">{match.safeBet.description}</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-amber-500/20">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                            <TrendingUp className="w-4 h-4" />
                            Value Risk
                        </div>
                        <div className="text-xl font-bold text-white mb-1">{match.valueBet.title}</div>
                        <div className="text-sm text-amber-400/80 font-mono">@{match.valueBet.odds}</div>
                         <p className="text-xs text-slate-400 mt-2">{match.valueBet.description}</p>
                    </div>
                </div>

                {/* Reasoning */}
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        Match Reasoning
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {match.reasoning}
                    </p>
                </div>

                {/* Deep Stats */}
                <div className="space-y-4">
                    <h3 className="text-white font-semibold">Key Statistics</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                         <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                            <span className="block text-xs text-slate-500 uppercase mb-1">Form</span>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-300"><span className="text-white font-bold">{match.homeTeam}:</span> {match.stats.homeForm}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-1">
                                <span className="text-slate-300"><span className="text-white font-bold">{match.awayTeam}:</span> {match.stats.awayForm}</span>
                            </div>
                         </div>

                         <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                            <span className="block text-xs text-slate-500 uppercase mb-1">Head to Head</span>
                            <p className="text-sm text-slate-300">{match.stats.h2h}</p>
                         </div>

                         <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                            <span className="block text-xs text-slate-500 uppercase mb-1">Insights</span>
                            <p className="text-sm text-slate-300">{match.stats.keyInsights}</p>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};