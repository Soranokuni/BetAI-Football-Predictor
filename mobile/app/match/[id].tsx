import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMatchById } from '@/services/geminiService';
import { Match } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView } from '@/components/GlassView';
import { ArrowLeft, TrendingUp, ShieldCheck, BrainCircuit, BarChart3 } from 'lucide-react-native';

export default function MatchDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMatch = async () => {
            if (typeof id === 'string') {
                const data = await getMatchById(id);
                setMatch(data || null);
            }
            setLoading(false);
        };
        loadMatch();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 bg-slate-950 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!match) {
        return (
            <View className="flex-1 bg-slate-950 items-center justify-center p-6">
                <GlassView>
                    <Text className="text-white text-center font-bold text-lg">Match not found</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-white/10 p-3 rounded-xl">
                        <Text className="text-white text-center">Go Back</Text>
                    </TouchableOpacity>
                </GlassView>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-950">
            {/* Background Gradient Mesh */}
            <LinearGradient
                colors={['#0f172a', '#1e1b4b', '#020617']}
                className="absolute inset-0"
            />
            <View className="absolute top-0 left-0 w-full h-[300px] bg-blue-600/10 blur-[100px] rounded-full translate-y-[-150px]" />
            <View className="absolute bottom-0 right-0 w-full h-[300px] bg-purple-600/10 blur-[100px] rounded-full translate-y-[100px]" />

            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="px-4 py-2 flex-row items-center justify-between z-10">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white/10 items-center justify-center backdrop-blur-md border border-white/5"
                    >
                        <ArrowLeft size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg tracking-wide opacity-80">MATCH ANALYSIS</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Matchup Header */}
                    <GlassView style={{ marginTop: 10, marginBottom: 20, alignItems: 'center' }} intensity={40}>
                        <Text className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-4">{match.league}</Text>
                        <View className="flex-row items-center justify-between w-full px-2">
                            <View className="flex-1 items-center">
                                <Text className="text-2xl font-bold text-white text-center mb-1">{match.homeTeam}</Text>
                            </View>
                            <Text className="text-slate-500 font-thin text-2xl px-4 italic">VS</Text>
                            <View className="flex-1 items-center">
                                <Text className="text-2xl font-bold text-white text-center mb-1">{match.awayTeam}</Text>
                            </View>
                        </View>
                        <View className="mt-4 bg-slate-900/50 px-4 py-1 rounded-full border border-white/5">
                            <Text className="text-xs text-slate-400 font-mono">{match.time} UTC</Text>
                        </View>
                    </GlassView>

                    {/* AI Reasoning */}
                    <View className="mb-6">
                        <View className="flex-row items-center gap-2 mb-3 px-1">
                            <BrainCircuit size={18} color="#60a5fa" />
                            <Text className="text-blue-400 font-bold uppercase text-xs tracking-widest">AI Reasoning</Text>
                        </View>
                        <GlassView>
                            <Text className="text-slate-200 leading-7 text-base font-medium">
                                {match.reasoning}
                            </Text>
                        </GlassView>
                    </View>

                    {/* Betting Options Grid */}
                    <View className="flex-row gap-4 mb-6">
                        {/* Safe Bet */}
                        <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-3 px-1">
                                <ShieldCheck size={18} color="#34d399" />
                                <Text className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Safe Bet</Text>
                            </View>
                            <GlassView style={{ flex: 1, backgroundColor: 'rgba(6, 78, 59, 0.2)' }}>
                                <Text className="text-white font-bold text-lg mb-1">{match.safeBet.odds}</Text>
                                <Text className="text-emerald-100 font-semibold text-sm mb-2">{match.safeBet.title}</Text>
                                <Text className="text-slate-400 text-xs leading-5">{match.safeBet.description}</Text>
                            </GlassView>
                        </View>

                        {/* Value Bet */}
                        <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-3 px-1">
                                <TrendingUp size={18} color="#fbbf24" />
                                <Text className="text-amber-400 font-bold uppercase text-[10px] tracking-widest">Value Bet</Text>
                            </View>
                            <GlassView style={{ flex: 1, backgroundColor: 'rgba(69, 26, 3, 0.2)' }}>
                                <Text className="text-white font-bold text-lg mb-1">{match.valueBet.odds}</Text>
                                <Text className="text-amber-100 font-semibold text-sm mb-2">{match.valueBet.title}</Text>
                                <Text className="text-slate-400 text-xs leading-5">{match.valueBet.description}</Text>
                            </GlassView>
                        </View>
                    </View>

                    {/* Stats & Insights */}
                    <View className="mb-8">
                        <View className="flex-row items-center gap-2 mb-3 px-1">
                            <BarChart3 size={18} color="#a78bfa" />
                            <Text className="text-purple-400 font-bold uppercase text-xs tracking-widest">Key Stats</Text>
                        </View>
                        <GlassView>
                            <View className="mb-4">
                                <Text className="text-slate-500 text-xs font-bold uppercase mb-1">Home Form</Text>
                                <Text className="text-slate-200 text-sm">{match.stats.homeForm}</Text>
                            </View>
                            <View className="mb-4">
                                <Text className="text-slate-500 text-xs font-bold uppercase mb-1">Away Form</Text>
                                <Text className="text-slate-200 text-sm">{match.stats.awayForm}</Text>
                            </View>
                            <View className="mb-4">
                                <Text className="text-slate-500 text-xs font-bold uppercase mb-1">Head to Head</Text>
                                <Text className="text-slate-200 text-sm">{match.stats.h2h}</Text>
                            </View>
                            <View>
                                <Text className="text-slate-500 text-xs font-bold uppercase mb-1">Key Insight</Text>
                                <Text className="text-white font-medium text-sm italic border-l-2 border-purple-500 pl-3 py-1">
                                    "{match.stats.keyInsights}"
                                </Text>
                            </View>
                        </GlassView>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
