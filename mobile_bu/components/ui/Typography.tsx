import { Text, TextProps, StyleSheet } from 'react-native';

export function DisplayText({ children, style, ...props }: TextProps) {
    return (
        <Text style={[styles.display, style]} {...props}>
            {children}
        </Text>
    );
}

export function BodyText({ children, style, ...props }: TextProps) {
    return (
        <Text style={[styles.body, style]} {...props}>
            {children}
        </Text>
    );
}

export function LabelText({ children, style, ...props }: TextProps) {
    return (
        <Text style={[styles.label, style]} {...props}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    display: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: -0.5,
    },
    body: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.6)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
