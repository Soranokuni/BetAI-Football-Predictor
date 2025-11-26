import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

interface Props {
    onComplete: () => void;
}

export const AdOverlay: React.FC<Props> = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Modal transparent animationType="fade">
            <View className="flex-1 items-center justify-center bg-black/90">
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

                <View className="w-[90%] max-w-md p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
                    <Text className="text-xs text-slate-400 uppercase tracking-widest mb-2 text-center">
                        Advertisement
                    </Text>
                    <Text className="text-2xl font-bold text-white mb-4 text-center">
                        Premium Analytics
                    </Text>
                    <Text className="text-slate-300 mb-6 text-center leading-5">
                        Unlock deep insights, expected goals (xG), and professional handicapper trends.
                    </Text>

                    <View className="w-full h-48 bg-slate-700 rounded-xl mb-6 items-center justify-center border border-slate-600">
                        <Text className="text-slate-500 font-medium">Ad Placeholder Video</Text>
                    </View>

                    <TouchableOpacity
                        onPress={onComplete}
                        disabled={timeLeft > 0}
                        className={`w-full py-4 rounded-xl items-center justify-center ${timeLeft > 0 ? 'bg-slate-700' : 'bg-white'
                            }`}
                    >
                        <Text className={`font-bold text-lg ${timeLeft > 0 ? 'text-slate-500' : 'text-black'}`}>
                            {timeLeft > 0 ? `Skip in ${timeLeft}s` : 'Skip to Predictions'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
