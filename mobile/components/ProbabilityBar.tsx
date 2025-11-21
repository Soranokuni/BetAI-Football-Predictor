import React from 'react';
import { View, Text } from 'react-native';
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
        <View className="w-full mt-3">
            <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-slate-400 font-medium uppercase tracking-wider">1 ({Math.round(hw)}%)</Text>
                <Text className="text-xs text-slate-400 font-medium uppercase tracking-wider">X ({Math.round(d)}%)</Text>
                <Text className="text-xs text-slate-400 font-medium uppercase tracking-wider">2 ({Math.round(aw)}%)</Text>
            </View>
            <View className="flex-row w-full h-2.5 rounded-full overflow-hidden bg-slate-700">
                <View
                    className="h-full bg-emerald-500"
                    style={{ width: `${hw}%` }}
                />
                <View
                    className="h-full bg-slate-400"
                    style={{ width: `${d}%` }}
                />
                <View
                    className="h-full bg-rose-500"
                    style={{ width: `${aw}%` }}
                />
            </View>
        </View>
    );
};
