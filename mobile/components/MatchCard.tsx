import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Match } from '../types';
import { ChevronRight, Info } from 'lucide-react-native';
import { GlassView } from './GlassView';

interface Props {
    match: Match;
    onDetailClick: (match: Match) => void;
}

export const MatchCard: React.FC<Props> = ({ match, onDetailClick }) => {
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => onDetailClick(match)} className="mb-4">
            <GlassView intensity={30} className="w-full">
                {/* Header: League & Time */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-slate-900/80 px-2 py-1 rounded">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {match.league}
                        </Text>
                    </View>
                    <Text className="text-xs text-slate-400 font-mono">{match.time} UTC</Text>
                </View>

                {/* Teams */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-white leading-tight" numberOfLines={2}>
                            {match.homeTeam}
                        </Text>
                    </View>
                    <View className="px-3">
                        <Text className="text-slate-500 text-xs font-bold">VS</Text>
                    </View>
                    <View className="flex-1 items-end">
                        <Text className="text-lg font-bold text-white leading-tight text-right" numberOfLines={2}>
                            {match.awayTeam}
                        </Text>
                    </View>
                </View>

                {/* Quick Bets */}
                <View className="flex-row gap-3 mt-2">
                    <View className="flex-1 bg-slate-900/50 rounded p-2 border border-emerald-900/30">
                        <Text className="text-[10px] text-emerald-500 font-bold uppercase">Safe Bet</Text>
                        <Text className="text-sm text-slate-200 font-medium" numberOfLines={1}>
                            {match.safeBet.title}
                        </Text>
                        <Text className="text-xs text-slate-500">{match.safeBet.odds}</Text>
                    </View>
                    <View className="flex-1 bg-slate-900/50 rounded p-2 border border-amber-900/30">
                        <Text className="text-[10px] text-amber-500 font-bold uppercase">Value Bet</Text>
                        <Text className="text-sm text-slate-200 font-medium" numberOfLines={1}>
                            {match.valueBet.title}
                        </Text>
                        <Text className="text-xs text-slate-500">{match.valueBet.odds}</Text>
                    </View>
                </View>

                {/* Action */}
                <View className="w-full mt-4 py-3 bg-white/5 rounded-lg flex-row items-center justify-center gap-2">
                    <Info size={16} color="#94a3b8" />
                    <Text className="text-sm font-medium text-slate-200">Analysis & Reasoning</Text>
                    <ChevronRight size={16} color="#94a3b8" />
                </View>
            </GlassView>
        </TouchableOpacity>
    );
};
