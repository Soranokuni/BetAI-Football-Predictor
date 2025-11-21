import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import { Match, AppState } from '@/types';
import { fetchDailyMatches } from '@/services/geminiService';
import { MatchCard } from '@/components/MatchCard';
import { Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState<AppState>(AppState.LOADING);
  const [refreshing, setRefreshing] = useState(false);

  // ... (loadData and onRefresh remain same)

  const loadData = async () => {
    setStatus(AppState.LOADING);
    try {
      const data = await fetchDailyMatches();
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

  // ... (inside component)

  return (
    <SafeAreaView className="flex-1 bg-slate-950" style={{ backgroundColor: '#020617' }}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0.8)']}
        className="px-4 py-4 border-b border-slate-800 flex-row items-center gap-3"
      >
        <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-900/20">
          <Trophy size={24} color="white" />
        </View>
        <View>
          <Text className="text-xl font-bold text-white leading-none">BetAI</Text>
          <Text className="text-xs text-slate-400 font-medium mt-1">Daily Viral Picks</Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {status === AppState.LOADING && !refreshing && (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-slate-400 mt-4">Loading matches...</Text>
          </View>
        )}

        {status === AppState.ERROR && (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-rose-500 text-lg font-bold mb-2">Failed to load matches</Text>
            <Text className="text-slate-400 mb-4">Please check your connection</Text>
          </View>
        )}

        {status === AppState.SUCCESS && (
          <View className="pb-10">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onDetailClick={handleMatchClick}
              />
            ))}
            {matches.length === 0 && (
              <Text className="text-slate-400 text-center mt-10">No matches found for today.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
