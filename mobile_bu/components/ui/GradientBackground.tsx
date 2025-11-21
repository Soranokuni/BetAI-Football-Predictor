import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewProps } from 'react-native';

export function GradientBackground({ children, style }: ViewProps) {
    return (
        <LinearGradient
            // Deep, rich colors for that "Liquid Glass" depth
            // Midnight Blue -> Deep Violet -> Black
            colors={['#0f172a', '#1e1b4b', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
