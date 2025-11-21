import { BlurView } from 'expo-blur';
import { StyleSheet, View, ViewProps } from 'react-native';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default' | 'prominent' | 'systemThinMaterial' | 'systemMaterial' | 'systemThickMaterial' | 'systemChromeMaterial' | 'systemUltraThinMaterial' | 'systemThinMaterialLight' | 'systemMaterialLight' | 'systemThickMaterialLight' | 'systemChromeMaterialLight' | 'systemUltraThinMaterialLight' | 'systemThinMaterialDark' | 'systemMaterialDark' | 'systemThickMaterialDark' | 'systemChromeMaterialDark' | 'systemUltraThinMaterialDark';
    borderOpacity?: number;
}

export function GlassView({
    children,
    style,
    intensity = 50,
    tint = 'dark',
    borderOpacity = 0.2,
    ...props
}: GlassViewProps) {
    return (
        <View style={[styles.container, { borderColor: `rgba(255, 255, 255, ${borderOpacity})` }, style]} {...props}>
            <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle surface color
    },
    content: {
        zIndex: 1,
    },
});
