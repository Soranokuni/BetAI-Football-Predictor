import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';

export default function MatchDetailScreen() {
    const { id } = useLocalSearchParams();

    return (
        <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
            <Stack.Screen options={{ title: 'Match Details', headerBackTitle: 'Back' }} />
            <Text className="text-white text-xl font-bold">Match ID: {id}</Text>
            <Text className="text-slate-400 mt-2">Details implementation coming soon...</Text>
        </SafeAreaView>
    );
}
