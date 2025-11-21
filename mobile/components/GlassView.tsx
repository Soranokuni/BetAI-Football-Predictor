import React from 'react';
import { View, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({ children, style, intensity = 30 }) => {
    // On Android, BlurView support can be limited or look different.
    // We use a semi-transparent dark gradient as a base for the "glass" feel.

    return (
        <View style={[{ borderRadius: 24, overflow: 'hidden', backgroundColor: 'transparent' }, style]}>
            {/* Background Gradient / Glass Effect */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {/* Base dark layer */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)' }} />

                {Platform.OS === 'ios' ? (
                    <BlurView intensity={intensity} tint="dark" style={{ flex: 1 }} />
                ) : (
                    // Fallback for Android (simulated glass)
                    <LinearGradient
                        colors={['rgba(30, 41, 59, 0.7)', 'rgba(15, 23, 42, 0.9)']}
                        style={{ flex: 1 }}
                    />
                )}

                {/* Subtle Gradient Border Overlay */}
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24 }}
                    pointerEvents="none"
                />
            </View>

            {/* Content */}
            <View style={{ padding: 20 }}>
                {children}
            </View>
        </View>
    );
};
