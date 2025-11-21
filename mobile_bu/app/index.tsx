import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MatchCard } from '../components/MatchCard';
import { GradientBackground } from '../components/ui/GradientBackground';
import { DisplayText, LabelText } from '../components/ui/Typography';
import { fetchMatches, Match } from '../services/api';

export default function Home() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadMatches = async () => {
        const data = await fetchMatches();
        setMatches(data);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMatches();
        setRefreshing(false);
    };

    useEffect(() => {
        loadMatches();
    }, []);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <LabelText style={styles.date}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</LabelText>
                    <DisplayText>BetAI Predictor</DisplayText>
                </View>

                <FlatList
                    data={matches}
                    renderItem={({ item }) => <MatchCard match={item} />}
                    keyExtractor={(item) => item.id || `${item.homeTeam}-${item.awayTeam}`}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <LabelText>No matches found today</LabelText>
                        </View>
                    }
                />
            </SafeAreaView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    date: {
        marginBottom: 4,
        color: '#60a5fa',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
});
