import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, TouchableOpacity } from 'react-native';
import { Match } from '../types';
import { ProbabilityBar } from './ProbabilityBar';
import { ChevronRight, Info } from 'lucide-react-native';



interface Props {
    match: Match;
    onDetailClick: (match: Match) => void;
}

export const MatchCard: React.FC<Props> = ({ match, onDetailClick }) => {
    return (
        <View className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-4 shadow-sm" style={{ elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, backgroundColor: '#1e293b' }}>
            {/* Header: League & Time */}
            <View className="flex-row justify-between items-center mb-4">
                <View className="bg-slate-900 px-2 py-1 rounded border border-slate-700" style={{ backgroundColor: '#0f172a' }}>
                    <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                        {match.league}
                    </Text>
                </View>
                <Text className="text-xs text-slate-400 font-mono" style={{ color: '#94a3b8' }}>{match.time} UTC</Text>
            </View>

            {/* Teams */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1 items-start">
                    <Text className="text-lg font-bold text-white leading-tight" style={{ color: '#ffffff' }}>{match.homeTeam}</Text>
                </View>
                <View className="px-3">
                    <Text className="text-slate-500 text-xs font-bold" style={{ color: '#64748b' }}>VS</Text>
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-lg font-bold text-white leading-tight" style={{ color: '#ffffff' }}>{match.awayTeam}</Text>
                </View>
            </View>

            {/* Probabilities */}
            <ProbabilityBar prediction={match.prediction} />



            {/* Quick Bets */}
            <View className="mt-4 flex-row gap-3">
                <LinearGradient
                    colors={['rgba(15, 23, 42, 0.5)', 'rgba(6, 78, 59, 0.2)']}
                    className="flex-1 rounded p-2 border border-emerald-900/30"
                >
                    <Text className="text-[10px] text-emerald-500 font-bold uppercase">Safe Bet</Text>
                    <Text className="text-sm text-slate-200 font-medium" numberOfLines={1}>{match.safeBet.title}</Text>
                    <Text className="text-xs text-slate-500">{match.safeBet.odds}</Text>
                </LinearGradient>
                <LinearGradient
                    colors={['rgba(15, 23, 42, 0.5)', 'rgba(120, 53, 15, 0.2)']}
                    className="flex-1 rounded p-2 border border-amber-900/30"
                >
                    <Text className="text-[10px] text-amber-500 font-bold uppercase">Value Bet</Text>
                    <Text className="text-sm text-slate-200 font-medium" numberOfLines={1}>{match.valueBet.title}</Text>
                    <Text className="text-xs text-slate-500">{match.valueBet.odds}</Text>
                </LinearGradient>
            </View>

            {/* Action */}
            <TouchableOpacity
                onPress={() => onDetailClick(match)}
                className="w-full mt-4 py-3 bg-slate-700 rounded-lg flex-row items-center justify-center gap-2 active:bg-slate-600 border border-slate-600"
            >
                <Info size={16} color="#94a3b8" />
                <Text className="text-sm font-medium text-white">Analysis & Reasoning</Text>
                <ChevronRight size={16} color="#94a3b8" />
            </TouchableOpacity>
        </View>
    );
};
