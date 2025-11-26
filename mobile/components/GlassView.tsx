import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    children: React.ReactNode;
}

export const GlassView: React.FC<GlassViewProps> = ({
    intensity = 20,
    tint = 'dark',
    children,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
            <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    content: {
        padding: 16,
    },
});
