import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import "../global.css";

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar style="light" translucent />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                    animation: 'fade',
                }}
            />
        </View>
    );
}
