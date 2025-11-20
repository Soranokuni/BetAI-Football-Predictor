import React, { useState, useEffect } from 'react';
import { fetchDailyMatches } from './services/geminiService';
import { Match, AppState, AdStage } from './types';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { AdOverlay } from './components/AdOverlay';
import { Trophy, Loader2, Lock, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState<AppState>(AppState.LOADING);
  const [adStage, setAdStage] = useState<AdStage>(AdStage.TIER_1);
  const [showAd, setShowAd] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setStatus(AppState.LOADING);
    try {
      // In the future, this can be replaced with fetch('https://my-github-pages/matches.json')
      // for the Cron Job implementation.
      const data = await fetchDailyMatches();
      setMatches(data);
      setStatus(AppState.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(AppState.ERROR);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUnlock = () => {
    setShowAd(true);
  };

  const handleAdComplete = () => {
    setShowAd(false);
    setAdStage((prev) => (prev === AdStage.TIER_1 ? AdStage.TIER_2 : AdStage.FULL_ACCESS));
  };

  const openDetail = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const getVisibleMatches = () => {
    if (status !== AppState.SUCCESS) return [];
    
    if (adStage === AdStage.TIER_1) {
      return matches.slice(0, 3);
    } else if (adStage === AdStage.TIER_2) {
      return matches.slice(0, 6);
    }
    return matches;
  };

  const visibleMatches = getVisibleMatches();
  const totalMatches = matches.length;
  const remainingMatches = totalMatches - visibleMatches.length;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">BetAI</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Daily Viral Picks</p>
          </div>
        </div>
        {status === AppState.SUCCESS && (
            <button onClick={loadData} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                <RefreshCw className="w-5 h-5" />
            </button>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        
        {status === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 animate-pulse">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-500" />
            <p className="text-sm font-medium">Scanning global leagues...</p>
            <p className="text-xs opacity-70 mt-2">Analyzing H2H, form, and viral sentiment</p>
          </div>
        )}

        {status === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
            <div className="bg-rose-900/20 p-4 rounded-full mb-4">
                <Trophy className="w-12 h-12 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
            <p className="text-slate-400 mb-6">Gemini encountered an issue fetching the latest data. Please try again.</p>
            <button 
              onClick={loadData}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Retry Analysis
            </button>
          </div>
        )}

        {status === AppState.SUCCESS && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Showing <strong className="text-white">{visibleMatches.length}</strong> of <strong className="text-white">{totalMatches}</strong> top matches</span>
                <span className="text-emerald-400 font-mono text-xs bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">LIVE ANALYSIS</span>
            </div>

            {visibleMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onDetailClick={openDetail} 
              />
            ))}

            {/* Unlock Button Logic */}
            {remainingMatches > 0 && (
              <div className="py-8 text-center">
                <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                    <button 
                        onClick={handleUnlock}
                        className="relative w-full bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group-hover:bg-slate-800 transition-colors"
                    >
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                            <Lock className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            Unlock {remainingMatches >= 4 ? 'Next 3' : 'Remaining'} Matches
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            Watch a short message to reveal high-value predictions for the rest of the day.
                        </p>
                    </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAd && <AdOverlay onComplete={handleAdComplete} />}
      <MatchDetailModal 
        match={selectedMatch} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default App;