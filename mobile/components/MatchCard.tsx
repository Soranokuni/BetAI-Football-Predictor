import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Match } from '../types';
import { ProbabilityBar } from './ProbabilityBar';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { GlassView } from './GlassView';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    match: Match;
    onDetailClick: (match: Match) => void;
}

export const MatchCard: React.FC<Props> = ({ match, onDetailClick }) => {
    return (
        <GlassView style={{ marginBottom: 24 }}>
            {/* Header: League & Time */}
            <View className="flex-row justify-between items-center mb-6">
                <View className="bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    <Text className="text-[10px] font-bold text-white uppercase tracking-widest shadow-sm">
                        {match.league}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <Text className="text-xs text-slate-300 font-medium font-mono">{match.time} UTC</Text>
                </View>
            </View>

            {/* Teams - Large & Centered */}
            <View className="flex-row items-center justify-between mb-8">
                <View className="flex-1 items-center">
                    <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 items-center justify-center mb-2 border border-white/10">
                        <Text className="text-xl font-bold text-white">{match.homeTeam.charAt(0)}</Text>
                    </View>
                    <Text className="text-base font-bold text-white text-center leading-tight shadow-md" numberOfLines={2}>
                        {match.homeTeam}
                    </Text>
                </View>

                <View className="px-2 items-center justify-center">
                    <Text className="text-2xl font-thin text-white/40 italic">VS</Text>
                </View>

                <View className="flex-1 items-center">
                    <View className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20 items-center justify-center mb-2 border border-white/10">
                        <Text className="text-xl font-bold text-white">{match.awayTeam.charAt(0)}</Text>
                    </View>
                    <Text className="text-base font-bold text-white text-center leading-tight shadow-md" numberOfLines={2}>
                        {match.awayTeam}
                    </Text>
                </View>
            </View>

            {/* AI Insight Chip */}
            <View className="mb-4 items-center">
                <LinearGradient
                     colors={['rgba(59, 130, 246, 0.2)', 'rgba(147, 51, 234, 0.2)']}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 0 }}
                     className="flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-white/10"
                >
                    <Sparkles size={12} color="#c084fc" />
                    <Text className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                        AI Confidence: {Math.max(match.prediction.homeWin, match.prediction.awayWin)}%
                    </Text>
                </LinearGradient>
            </View>

            {/* Probabilities */}
            <ProbabilityBar prediction={match.prediction} />

            {/* Action Button - Futuristic */}
            <TouchableOpacity
                onPress={() => onDetailClick(match)}
                activeOpacity={0.8}
                className="w-full mt-6"
            >
                <LinearGradient
                    colors={['#3b82f6', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    style={{ borderRadius: 16 }}
                >
                    <Text className="text-sm font-bold text-white tracking-wide">VIEW ANALYSIS</Text>
                    <ChevronRight size={16} color="white" strokeWidth={3} />
                </LinearGradient>
            </TouchableOpacity>
        </GlassView>
    );
};
