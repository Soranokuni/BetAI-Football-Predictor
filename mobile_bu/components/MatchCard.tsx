import { StyleSheet, View } from 'react-native';
import { GlassView } from './ui/GlassView';
import { BodyText, DisplayText, LabelText } from './ui/Typography';
import { Match } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

interface MatchCardProps {
    match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
    const isViral = (match.viralScore || 0) > 80;

    return (
        <GlassView style={styles.container} intensity={40} tint="dark">
            <View style={styles.header}>
                <LabelText style={styles.league}>{match.league}</LabelText>
                {isViral && (
                    <LinearGradient
                        colors={['#ec4899', '#8b5cf6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.viralBadge}
                    >
                        <LabelText style={styles.viralText}>VIRAL</LabelText>
                    </LinearGradient>
                )}
            </View>

            <View style={styles.teamsContainer}>
                <View style={styles.team}>
                    <BodyText style={styles.teamName}>{match.homeTeam}</BodyText>
                </View>
                <View style={styles.vsContainer}>
                    <LabelText style={styles.vs}>VS</LabelText>
                    <LabelText style={styles.time}>{match.time}</LabelText>
                </View>
                <View style={styles.team}>
                    <BodyText style={styles.teamName}>{match.awayTeam}</BodyText>
                </View>
            </View>

            <View style={styles.predictionContainer}>
                <View style={styles.predictionLabel}>
                    <LabelText>AI PREDICTION</LabelText>
                </View>
                <View style={styles.predictionContent}>
                    <DisplayText style={styles.score}>{match.prediction.score}</DisplayText>
                    <View style={styles.winnerContainer}>
                        <BodyText style={styles.winnerText}>
                            {match.prediction.winner === 'Home' ? match.homeTeam :
                                match.prediction.winner === 'Away' ? match.awayTeam : 'Draw'}
                        </BodyText>
                        <LabelText style={styles.probability}>
                            {Math.round(match.prediction.probability * 100)}% CONFIDENCE
                        </LabelText>
                    </View>
                </View>
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    league: {
        opacity: 0.8,
    },
    viralBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    viralText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    teamsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    team: {
        flex: 1,
        alignItems: 'center',
    },
    teamName: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#fff',
    },
    vsContainer: {
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    vs: {
        fontSize: 10,
        opacity: 0.5,
        marginBottom: 4,
    },
    time: {
        color: '#60a5fa',
    },
    predictionContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    predictionLabel: {
        marginBottom: 8,
    },
    predictionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    score: {
        fontSize: 24,
        marginRight: 16,
        color: '#34d399', // Emerald 400
    },
    winnerContainer: {
        flex: 1,
    },
    winnerText: {
        fontWeight: '600',
        color: '#fff',
    },
    probability: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 2,
    },
});
