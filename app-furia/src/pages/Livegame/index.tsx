import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, RefreshControl, Animated, Dimensions } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type Player = {
    id: number;
    name: string;
    nickname: string;
    avatar: string | null;
    stats: {
        kills: number;
        deaths: number;
        assists: number;
        adr: number; 
        rating: number;
    };
};

type Round = {
    id: number;
    winner: string; 
    scoreFuria: number;
    scoreOpponent: number;
    highlights: string | null;
};

type GameData = {
    id: number;
    status: "upcoming" | "live" | "finished";
    opponent: string;
    opponentLogo: string | null;
    tournament: string;
    tournamentLogo: string | null;
    date: string;
    time: string;
    map: string;
    scoreFuria: number;
    scoreOpponent: number;
    currentRound: number;
    timeRemaining: string | null;
    players: Player[];
    rounds: Round[];
    livestreamUrl: string | null;
};

export default function LiveGame() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const screenWidth = Dimensions.get("window").width;

    const [gameData, setGameData] = useState<GameData>({
        id: 1,
        status: "live",
        opponent: "NAVI",
        opponentLogo: null, 
        tournament: "ESL Pro League Season 16",
        tournamentLogo: null, 
        date: "30/04/2025",
        time: "16:00",
        map: "Mirage",
        scoreFuria: 8,
        scoreOpponent: 6,
        currentRound: 15,
        timeRemaining: "1:25",
        players: [
            {
                id: 1,
                name: "Yuri Boian",
                nickname: "yuurih",
                avatar: null,
                stats: {
                    kills: 12,
                    deaths: 8,
                    assists: 3,
                    adr: 92.4,
                    rating: 1.27,
                },
            },
            {
                id: 2,
                name: "Kaike Cerato",
                nickname: "KSCERATO",
                avatar: null,
                stats: {
                    kills: 15,
                    deaths: 6,
                    assists: 2,
                    adr: 105.7,
                    rating: 1.43,
                },
            },
            {
                id: 3,
                name: "Danil Golubenko",
                nickname: "molodoy",
                avatar: null,
                stats: {
                    kills: 9,
                    deaths: 7,
                    assists: 5,
                    adr: 75.2,
                    rating: 1.12,
                },
            },
            {
                id: 4,
                name: "Mareks Gaļinskis ",
                nickname: "YEKINDAR",
                avatar: null,
                stats: {
                    kills: 11,
                    deaths: 9,
                    assists: 1,
                    adr: 88.3,
                    rating: 1.18,
                },
            },
            {
                id: 5,
                name: "Gabriel Toledo",
                nickname: "FalleN",
                avatar: null,
                stats: {
                    kills: 8,
                    deaths: 8,
                    assists: 7,
                    adr: 67.9,
                    rating: 1.05,
                },
            },
        ],
        rounds: Array.from({ length: 14 }, (_, i) => ({
            id: i + 1,
            winner: i % 2 === 0 ? "FURIA" : "NAVI",
            scoreFuria: Math.floor(i / 2) + (i % 2 === 0 ? 1 : 0),
            scoreOpponent: Math.floor(i / 2) + (i % 2 === 1 ? 1 : 0),
            highlights: i === 5 ? "Clutch por KSCERATO!" : i === 10 ? "YEKINDAR faz 3 abates!" : null,
        })),
        livestreamUrl: "https://www.twitch.tv/furiatv",
    });

    // Start pulse animation for live indicator
    useEffect(() => {
        if (gameData.status === "live") {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.5,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }

        // Auto-update simulation
        const interval = setInterval(() => {
            if (gameData.status === "live") {
                updateGameData();
            }
        }, 15000); // Update every 15 seconds

        return () => clearInterval(interval);
    }, [gameData]);

    // Simulate game data updates
    const updateGameData = () => {
        setGameData((prev) => {
            let newTimeRemaining: string | null = null;
            if (prev.timeRemaining) {
                const [mins, secs] = prev.timeRemaining.split(":").map(Number);
                let totalSecs = mins * 60 + secs - 15;
                if (totalSecs < 0) totalSecs = 105; // Reset to 1:45
                const newMins = Math.floor(totalSecs / 60);
                const newSecs = totalSecs % 60;
                newTimeRemaining = `${newMins}:${newSecs.toString().padStart(2, "0")}`;
            }

            let newRounds = [...prev.rounds];
            let newScoreFuria = prev.scoreFuria;
            let newScoreOpponent = prev.scoreOpponent;
            let newCurrentRound = prev.currentRound;

            if (Math.random() < 0.1) {
                const furiaWins = Math.random() < 0.55; 

                if (furiaWins) {
                    newScoreFuria += 1;
                } else {
                    newScoreOpponent += 1;
                }

                newRounds.push({
                    id: prev.rounds.length + 1,
                    winner: furiaWins ? "FURIA" : "NAVI",
                    scoreFuria: newScoreFuria,
                    scoreOpponent: newScoreOpponent,
                    highlights: Math.random() < 0.3 ? (furiaWins ? ["KSCERATO clutch 1v2!", "FalleN com AWP decisivo!", "art abre o bomb site!"][Math.floor(Math.random() * 3)] : null) : null,
                });

                newCurrentRound += 1;
                newTimeRemaining = "1:55"; 
            }

            const newPlayers = prev.players.map((player) => {
                if (Math.random() < 0.3) {
                    return {
                        ...player,
                        stats: {
                            ...player.stats,
                            kills: player.stats.kills + (Math.random() < 0.7 ? 1 : 0),
                            deaths: player.stats.deaths + (Math.random() < 0.4 ? 1 : 0),
                            assists: player.stats.assists + (Math.random() < 0.3 ? 1 : 0),
                            adr: parseFloat((player.stats.adr + (Math.random() * 4 - 2)).toFixed(1)),
                            rating: parseFloat((player.stats.rating + (Math.random() * 0.1 - 0.05)).toFixed(2)),
                        },
                    };
                }
                return player;
            });

            return {
                ...prev,
                scoreFuria: newScoreFuria,
                scoreOpponent: newScoreOpponent,
                currentRound: newCurrentRound,
                timeRemaining: newTimeRemaining,
                players: newPlayers,
                rounds: newRounds,
            };
        });
    };

    const onRefresh = () => {
        setRefreshing(true);

        setTimeout(() => {
            updateGameData();
            setRefreshing(false);
        }, 1500);
    };

    const goToFanChat = () => {
        navigation.navigate("FanChat");
    };

    const sortedPlayers = [...gameData.players].sort((a, b) => b.stats.rating - a.stats.rating);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Partida ao Vivo</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#000000"]} />}>
                <View style={styles.gameHeader}>
                    <View style={styles.teamContainer}>
                        <Image source={require("../../../assets/logo-furia-2.png")} style={styles.teamLogo} resizeMode="contain" />
                        <Text style={styles.teamName}>FURIA</Text>
                    </View>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.score}>{gameData.scoreFuria}</Text>
                        <View style={styles.vsContainer}>
                            <Animated.View
                                style={[
                                    styles.liveIndicator,
                                    {
                                        transform: [
                                            {
                                                scale: pulseAnim,
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <View style={styles.liveDot} />
                            </Animated.View>
                            <Text style={styles.vs}>VS</Text>
                        </View>
                        <Text style={styles.score}>{gameData.scoreOpponent}</Text>
                    </View>

                    <View style={styles.teamContainer}>
                        <Image
                            source={require("../../../assets/oponentes/navi.png")}
                            style={styles.teamLogo}
                            resizeMode="contain"
                            defaultSource={require("../../../assets/oponentes/navi.png")}
                        />
                        <Text style={styles.teamName}>{gameData.opponent}</Text>
                    </View>
                </View>

                {/* Game Info */}
                <View style={styles.gameInfo}>
                    <View style={styles.infoRow}>
                        <Feather name="map" size={16} color="#666" />
                        <Text style={styles.infoText}>Mapa: {gameData.map}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Feather name="calendar" size={16} color="#666" />
                        <Text style={styles.infoText}>{gameData.tournament}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Feather name="clock" size={16} color="#666" />
                        <Text style={styles.infoText}>
                            Round {gameData.currentRound}
                            {gameData.timeRemaining ? ` • ${gameData.timeRemaining}` : ""}
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={goToFanChat}>
                        <Feather name="message-circle" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>Chat de Torcida</Text>
                    </TouchableOpacity>

                    {gameData.livestreamUrl && (
                        <TouchableOpacity style={styles.actionButton}>
                            <Feather name="video" size={18} color="#fff" />
                            <Text style={styles.actionButtonText}>Assistir Live</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={[styles.tab, activeTab === "overview" && styles.activeTab]} onPress={() => setActiveTab("overview")}>
                        <Text style={[styles.tabText, activeTab === "overview" && styles.activeTabText]}>Visão Geral</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.tab, activeTab === "players" && styles.activeTab]} onPress={() => setActiveTab("players")}>
                        <Text style={[styles.tabText, activeTab === "players" && styles.activeTabText]}>Jogadores</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.tab, activeTab === "rounds" && styles.activeTab]} onPress={() => setActiveTab("rounds")}>
                        <Text style={[styles.tabText, activeTab === "rounds" && styles.activeTabText]}>Rounds</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === "overview" && (
                        <View>
                            {/* Current Stats Overview */}
                            <View style={styles.statsOverview}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{gameData.players.reduce((sum, p) => sum + p.stats.kills, 0)}</Text>
                                    <Text style={styles.statLabel}>Abates Totais</Text>
                                </View>

                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{sortedPlayers[0]?.nickname || "-"}</Text>
                                    <Text style={styles.statLabel}>Melhor Jogador</Text>
                                </View>

                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{gameData.rounds.filter((r) => r.winner === "FURIA").length}</Text>
                                    <Text style={styles.statLabel}>Rounds Ganhos</Text>
                                </View>
                            </View>

                            {/* Performance Graph - Simple Bar Representation */}
                            <View style={styles.performanceContainer}>
                                <Text style={styles.sectionTitle}>Desempenho por Round</Text>
                                <View style={styles.performanceGraph}>
                                    {gameData.rounds.slice(-10).map((round, index) => (
                                        <View
                                            key={round.id}
                                            style={[
                                                styles.roundBar,
                                                {
                                                    backgroundColor: round.winner === "FURIA" ? "#000000" : "#CCCCCC",
                                                },
                                            ]}
                                        >
                                            <Text style={styles.roundNumber}>{round.id}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.graphLegend}>
                                    <View style={styles.legendItem}>
                                        <View
                                            style={[
                                                styles.legendColor,
                                                {
                                                    backgroundColor: "#000000",
                                                },
                                            ]}
                                        />
                                        <Text style={styles.legendText}>FURIA</Text>
                                    </View>
                                    <View style={styles.legendItem}>
                                        <View
                                            style={[
                                                styles.legendColor,
                                                {
                                                    backgroundColor: "#CCCCCC",
                                                },
                                            ]}
                                        />
                                        <Text style={styles.legendText}>{gameData.opponent}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Quick Stats */}
                            <View style={styles.quickStats}>
                                <Text style={styles.sectionTitle}>Estatísticas Rápidas</Text>
                                <View style={styles.quickStatRow}>
                                    <Text style={styles.quickStatLabel}>Win Rate CT:</Text>
                                    <Text style={styles.quickStatValue}>{Math.round((gameData.rounds.filter((r) => r.winner === "FURIA").length / gameData.rounds.length) * 100)}%</Text>
                                </View>
                                <View style={styles.quickStatRow}>
                                    <Text style={styles.quickStatLabel}>ADR Médio:</Text>
                                    <Text style={styles.quickStatValue}>{(gameData.players.reduce((sum, p) => sum + p.stats.adr, 0) / gameData.players.length).toFixed(1)}</Text>
                                </View>
                                <View style={styles.quickStatRow}>
                                    <Text style={styles.quickStatLabel}>Maior Sequência:</Text>
                                    <Text style={styles.quickStatValue}>
                                        {(() => {
                                            let maxStreak = 0;
                                            let currentStreak = 0;
                                            gameData.rounds.forEach((r) => {
                                                if (r.winner === "FURIA") {
                                                    currentStreak++;
                                                    maxStreak = Math.max(maxStreak, currentStreak);
                                                } else {
                                                    currentStreak = 0;
                                                }
                                            });
                                            return maxStreak;
                                        })()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === "players" && (
                        <View style={styles.playersContainer}>
                            <Text style={styles.sectionTitle}>Desempenho dos Jogadores</Text>

                            {sortedPlayers.map((player, index) => (
                                <View key={player.id} style={styles.playerCard}>
                                    <View style={styles.playerHeader}>
                                        <View style={styles.playerInfo}>
                                            <View style={styles.playerAvatar}>
                                                <Text style={styles.playerInitial}>{player.nickname.charAt(0).toUpperCase()}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.playerNickname}>{player.nickname}</Text>
                                                <Text style={styles.playerName}>{player.name}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.playerRating}>{player.stats.rating}</Text>
                                    </View>

                                    <View style={styles.playerStats}>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statItemValue}>{player.stats.kills}</Text>
                                            <Text style={styles.statItemLabel}>Abates</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statItemValue}>{player.stats.deaths}</Text>
                                            <Text style={styles.statItemLabel}>Mortes</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statItemValue}>{player.stats.assists}</Text>
                                            <Text style={styles.statItemLabel}>Assistências</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statItemValue}>{player.stats.adr}</Text>
                                            <Text style={styles.statItemLabel}>ADR</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {activeTab === "rounds" && (
                        <View style={styles.roundsContainer}>
                            <Text style={styles.sectionTitle}>Histórico de Rounds</Text>

                            {gameData.rounds
                                .slice()
                                .reverse()
                                .map((round) => (
                                    <View key={round.id} style={styles.roundItem}>
                                        <View
                                            style={[
                                                styles.roundWinner,
                                                {
                                                    backgroundColor: round.winner === "FURIA" ? "#000000" : "#CCCCCC",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.roundWinnerText,
                                                    {
                                                        color: round.winner === "FURIA" ? "#FFFFFF" : "#000000",
                                                    },
                                                ]}
                                            >
                                                {round.winner}
                                            </Text>
                                        </View>

                                        <View style={styles.roundDetails}>
                                            <Text style={styles.roundScore}>
                                                Round {round.id} • FURIA {round.scoreFuria} - {round.scoreOpponent} {gameData.opponent}
                                            </Text>
                                            {round.highlights && <Text style={styles.roundHighlight}>{round.highlights}</Text>}
                                        </View>
                                    </View>
                                ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    scrollView: {
        flex: 1,
    },
    gameHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#F7F7F7",
    },
    teamContainer: {
        alignItems: "center",
        width: "30%",
    },
    teamLogo: {
        width: 60,
        height: 60,
    },
    teamName: {
        fontWeight: "bold",
        marginTop: 8,
    },
    scoreContainer: {
        alignItems: "center",
        width: "40%",
        flexDirection: "row",
        justifyContent: "center",
    },
    score: {
        fontSize: 32,
        fontWeight: "bold",
        paddingHorizontal: 12,
    },
    vsContainer: {
        alignItems: "center",
    },
    vs: {
        fontSize: 14,
        color: "#666666",
    },
    liveIndicator: {
        marginBottom: 4,
    },
    liveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FF0000",
    },
    gameInfo: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        color: "#444444",
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    actionButton: {
        backgroundColor: "#000000",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontWeight: "500",
        marginLeft: 8,
    },
    tabsContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#000000",
    },
    tabText: {
        color: "#666666",
    },
    activeTabText: {
        color: "#000000",
        fontWeight: "500",
    },
    tabContent: {
        padding: 16,
    },
    statsOverview: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    statBox: {
        alignItems: "center",
        width: "30%",
        backgroundColor: "#F7F7F7",
        padding: 12,
        borderRadius: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
    },
    statLabel: {
        color: "#666666",
        marginTop: 4,
        textAlign: "center",
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    performanceContainer: {
        marginBottom: 24,
    },
    performanceGraph: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 100,
        marginBottom: 12,
    },
    roundBar: {
        flex: 1,
        marginHorizontal: 2,
        justifyContent: "flex-end",
        alignItems: "center",
        borderRadius: 4,
    },
    roundNumber: {
        color: "#FFFFFF",
        fontSize: 10,
        padding: 4,
    },
    graphLegend: {
        flexDirection: "row",
        justifyContent: "center",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 12,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: "#666666",
    },
    quickStats: {
        backgroundColor: "#F7F7F7",
        padding: 16,
        borderRadius: 8,
    },
    quickStatRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    quickStatLabel: {
        color: "#666666",
    },
    quickStatValue: {
        fontWeight: "bold",
    },
    playersContainer: {
        marginBottom: 16,
    },
    playerCard: {
        backgroundColor: "#F7F7F7",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    playerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    playerInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    playerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    playerInitial: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 18,
    },
    playerNickname: {
        fontWeight: "bold",
        fontSize: 16,
    },
    playerName: {
        color: "#666666",
        fontSize: 12,
    },
    playerRating: {
        backgroundColor: "#000000",
        color: "#FFFFFF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: "bold",
    },
    playerStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statItem: {
        alignItems: "center",
    },
    statItemValue: {
        fontWeight: "bold",
        fontSize: 16,
    },
    statItemLabel: {
        color: "#666666",
        fontSize: 12,
    },
    roundsContainer: {
        marginBottom: 16,
    },
    roundItem: {
        flexDirection: "row",
        marginBottom: 12,
    },
    roundWinner: {
        width: 70,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
    },
    roundWinnerText: {
        fontWeight: "bold",
        fontSize: 12,
    },
    roundDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    roundScore: {
        fontSize: 14,
    },
    roundHighlight: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
    },
});
