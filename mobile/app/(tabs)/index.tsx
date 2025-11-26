import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, StatusBar } from 'react-native';
import { Match, AppState, AdStage } from '@/types';
import { fetchDailyMatches } from '@/services/geminiService';
import { MatchCard } from '@/components/MatchCard';
import { AdOverlay } from '@/components/AdOverlay';
import { Trophy, Lock, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState<AppState>(AppState.LOADING);
  const [refreshing, setRefreshing] = useState(false);
  const [adStage, setAdStage] = useState<AdStage>(AdStage.TIER_1);
  const [showAd, setShowAd] = useState<boolean>(false);

  const loadData = async () => {
    setStatus(AppState.LOADING);
    try {
      const data = await fetchDailyMatches(true);
      setMatches(data);
      setStatus(AppState.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(AppState.ERROR);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMatchClick = (match: Match) => {
    router.push(`/match/${match.id}` as any);
  };

  const handleUnlock = () => {
    setShowAd(true);
  };

  const handleAdComplete = () => {
    setShowAd(false);
    setAdStage((prev) => (prev === AdStage.TIER_1 ? AdStage.TIER_2 : AdStage.FULL_ACCESS));
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
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />

      {/* Sticky Header */}
      <BlurView intensity={80} tint="dark" className="absolute top-0 left-0 right-0 z-50 pt-12 pb-4 px-4 border-b border-white/5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-900/20">
              <Trophy size={24} color="white" />
            </View>
            <View>
              <Text className="text-xl font-bold text-white leading-none">BetAI</Text>
              <Text className="text-xs text-slate-400 font-medium mt-1">Daily Viral Picks</Text>
            </View>
          </View>
          {status === AppState.SUCCESS && (
            <TouchableOpacity
              onPress={loadData}
              className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center border border-white/5"
            >
              <RefreshCw size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 120, paddingBottom: 40, paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" progressViewOffset={120} />
        }
      >
        {status === AppState.LOADING && !refreshing && (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-slate-400 mt-4 font-medium">Scanning global leagues...</Text>
          </View>
        )}

        {status === AppState.ERROR && (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-16 h-16 bg-rose-500/10 rounded-full items-center justify-center mb-4">
              <Trophy size={32} color="#f43f5e" />
            </View>
            <Text className="text-white text-lg font-bold mb-2">Analysis Failed</Text>
            <Text className="text-slate-400 mb-6 text-center px-10">Gemini encountered an issue fetching the latest data.</Text>
            <TouchableOpacity
              onPress={loadData}
              className="bg-blue-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold">Retry Analysis</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === AppState.SUCCESS && (
          <View>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-slate-400 text-sm">
                Showing <Text className="text-white font-bold">{visibleMatches.length}</Text> of <Text className="text-white font-bold">{totalMatches}</Text> matches
              </Text>
              <View className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <Text className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Live Analysis</Text>
              </View>
            </View>

            {visibleMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onDetailClick={handleMatchClick}
              />
            ))}

            {/* Unlock Button Logic */}
            {remainingMatches > 0 && (
              <View className="mt-4 mb-8">
                <LinearGradient
                  colors={['rgba(59, 130, 246, 0.2)', 'rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="p-[1px] rounded-2xl"
                >
                  <TouchableOpacity
                    onPress={handleUnlock}
                    activeOpacity={0.9}
                    className="bg-slate-900 rounded-2xl p-6 items-center"
                  >
                    <View className="w-14 h-14 bg-slate-800 rounded-full items-center justify-center mb-4 shadow-lg">
                      <Lock size={24} color="#c084fc" />
                    </View>
                    <Text className="text-xl font-bold text-white mb-2">
                      Unlock {remainingMatches >= 3 ? 'Next 3' : 'Remaining'} Matches
                    </Text>
                    <Text className="text-slate-400 text-center text-sm mb-6 max-w-[250px]">
                      Watch a short message to reveal high-value predictions for the rest of the day.
                    </Text>
                    <View className="bg-white/10 px-6 py-3 rounded-xl">
                      <Text className="text-white font-bold text-sm">Tap to Unlock</Text>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}

            {matches.length === 0 && (
              <Text className="text-slate-400 text-center mt-10">No matches found for today.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {showAd && <AdOverlay onComplete={handleAdComplete} />}
    </View>
  );
}
