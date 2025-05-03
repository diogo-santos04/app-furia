import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, SafeAreaView } from "react-native";
import { Feather, FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

interface Player {
    id: string;
    nick: string;
    role: string;
    avatar: string;
}

interface TeamLineup {
    game: string;
    players: Player[];
}

interface News {
    id: string;
    title: string;
    summary: string;
    image: string;
    date: string;
}

interface Streamer {
    id: string;
    user_name: string;
    game_name: string;
    title: string;
    viewer_count: number;
    thumbnail_url: string;
    avatar_url: string;
    is_live: boolean;
}

const GAMES = [
    { id: "cs2", name: "CS2" },
    { id: "lol", name: "LoL" },
    { id: "valorant", name: "VALORANT" },
    { id: "freefire", name: "Free Fire" },
    { id: "dota2", name: "Dota 2" },
];

const LINEUPS: { [key: string]: TeamLineup } = {
    cs2: {
        game: "CS2",
        players: [
            { id: "1", nick: "FalleN", role: "IGL / AWP", avatar: require("../../../assets/cs2/fallen.png") },
            { id: "2", nick: "kscerato", role: "Rifler", avatar: require("../../../assets/cs2/kscerato.png") },
            { id: "3", nick: "yuurih", role: "Rifler", avatar: require("../../../assets/cs2/yuurih.png") },
            { id: "4", nick: "YEKINDAR", role: "Entry Fragger", avatar: require("../../../assets/cs2/yekindar.png") },
            { id: "5", nick: "molodoy", role: "AWP", avatar: require("../../../assets/cs2/molodoy.png") },
        ],
    },
    lol: {
        game: "League of Legends",
        players: [
            { id: "6", nick: "Guigo", role: "Top", avatar: "https://via.placeholder.com/50" },
            { id: "7", nick: "Tatu", role: "Jungle", avatar: "https://via.placeholder.com/50" },
            { id: "8", nick: "Tutsz", role: "Mid", avatar: "https://via.placeholder.com/50" },
            { id: "9", nick: "Ayu", role: "ADC", avatar: "https://via.placeholder.com/50" },
            { id: "10", nick: "JoJo", role: "Support", avatar: "https://via.placeholder.com/50" },
        ],
    },
    valorant: {
        game: "VALORANT",
        players: [
            { id: "11", nick: "Raafa", role: "Iniciador", avatar: require("../../../assets/valorant/raafa.png") },
            { id: "12", nick: "Khalil", role: "Controlador", avatar: require("../../../assets/valorant/khalil.png") },
            { id: "13", nick: "Heat", role: "Duelista", avatar: require("../../../assets/valorant/heat.png") },
            { id: "14", nick: "Havoc", role: "Duelista", avatar: require("../../../assets/valorant/havoc.png") },
            { id: "15", nick: "Raafa", role: "Flex", avatar: "https://via.placeholder.com/50" },
        ],
    },
    freefire: {
        game: "Free Fire",
        players: [
            { id: "16", nick: "Level", role: "Captain", avatar: "https://via.placeholder.com/50" },
            { id: "17", nick: "Martins", role: "Fragger", avatar: "https://via.placeholder.com/50" },
            { id: "18", nick: "Teix", role: "Rusher", avatar: "https://via.placeholder.com/50" },
            { id: "19", nick: "Grego", role: "Support", avatar: "https://via.placeholder.com/50" },
        ],
    },
};

const NEWS = [
    {
        id: "1",
        title: "FURIA derrota Liquid na estreia da BLAST Premier",
        summary: "Time brasileiro vence com placar de 2-1 em série emocionante",
        image: require("../../../assets/furia-major.png"),
        date: "2025-04-23",
    },
    {
        id: "2",
        title: "FURIA anuncia nova line-up para VALORANT",
        summary: "Equipe se prepara para o VCT Americas com novas contratações",
        image: require("../../../assets/FURIA-VALORANT-2025.png"),
        date: "2025-04-20",
    },
    {
        id: "3",
        title: "FalleN completa marca de 10.000 abates na carreira",
        summary: "Lenda do CS brasileiro atinge novo recorde em sua trajetória",
        image: require("../../../assets/fallen-ad.png"),
        date: "2025-04-18",
    },
];

const MATCHES = [
    {
        id: "1",
        game: "CS2",
        opponent: "NAVI",
        opponentLogo: require("../../../assets/oponentes/navi.png"),
        date: "2025-04-24",
        status: "live",
        score: "FURIA 12 - 10 NAVI",
    },
    {
        id: "2",
        game: "CS2",
        opponent: "Liquid",
        opponentLogo: require("../../../assets/oponentes/liquid.png"),
        date: "2025-04-23",
        status: "victory",
        score: "FURIA 2 - 1 Liquid",
    },
    {
        id: "3",
        game: "VALORANT",
        opponent: "Sentinels",
        opponentLogo: require("../../../assets/oponentes/sentinels.png"),
        date: "2025-04-22",
        status: "defeat",
        score: "FURIA 0 - 2 Sentinels",
    },
    {
        id: "4",
        game: "LoL",
        opponent: "paiN Gaming",
        opponentLogo: require("../../../assets/oponentes/pain.png"),
        date: "2025-04-26",
        status: "upcoming",
    },
];

const FOOTBALL_PLAYERS = [
    {
        id: "f1",
        name: "Guilherme Monagatti",
        position: "Atacante",
        number: 9,
        avatar: require("../../../assets/kingsleague/guilherme.png"),
    },
    {
        id: "f2",
        name: "Caio Catroca",
        position: "Meia",
        number: 3,
        avatar: require("../../../assets/kingsleague/caio.png"),
    },
    {
        id: "f3",
        name: "Murilo Donato",
        position: "Atacante",
        number: 8,
        avatar: require("../../../assets/kingsleague/murilo.png"),
    },
    {
        id: "f4",
        name: "Andrey Batata",
        position: "Meia",
        number: 5,
        avatar: require("../../../assets/kingsleague/andrey.png"),
    },
];

const FOOTBALL_MATCHES = [
    {
        id: "fm1",
        opponent: "NYVELADOS FC",
        opponentLogo: require("../../../assets/kingsleague/nyvelados.png"),
        date: "2025-04-25",
        competition: "Kings League",
        venue: "Oreo Arena",
        status: "upcoming",
    },
    {
        id: "fm2",
        opponent: "G3X FC",
        opponentLogo: require("../../../assets/kingsleague/g3x-fc.png"),
        date: "2025-04-20",
        competition: "Kings League",
        venue: "",
        status: "victory",
        score: "FURIA FC 5 - 3 G3X FC",
    },
];

export default function Explore() {
    const [selectedGame, setSelectedGame] = useState<string>("cs2");
    const [selectedSection, setSelectedSection] = useState<string>("games");
    const [lineup, setLineup] = useState<TeamLineup | null>(LINEUPS[selectedGame]);
    const [news, setNews] = useState<News[]>(NEWS);
    const [matches, setMatches] = useState(MATCHES);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [onlineStreamers, setOnlineStreamers] = useState<Streamer[]>([]);
    const [furiaStreamers, setFuriaStreamers] = useState<Streamer[]>([]);

    const { signOut } = useContext(AuthContext);

    useEffect(() => {
        setLineup(LINEUPS[selectedGame]);
        //todo - tentar achar alguma api que traga dados dos jogos
    }, [selectedGame]);

    useEffect(() => {
        async function fetchStreamers() {
            try {
                const response = await api.get("/twitch/streams");

                if (response.data && Array.isArray(response.data)) {
                    const allStreamers = response.data;

                    const liveStreamers = allStreamers.filter((streamer) => streamer.is_live);

                    setFuriaStreamers(allStreamers);
                    setOnlineStreamers(liveStreamers);

                    console.log(`total ${allStreamers.length} streamers, ${liveStreamers.length} ao vivo`);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchStreamers();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "live":
                return "#FF0000";
            case "victory":
                return "#4CAF50";
            case "defeat":
                return "#F44336";
            default:
                return "#9E9EB3";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "live":
                return "AO VIVO";
            case "victory":
                return "VITÓRIA";
            case "defeat":
                return "DERROTA";
            default:
                return "EM BREVE";
        }
    };

    const renderContent = () => {
        switch (selectedSection) {
            case "games":
                return renderGamesContent();
            case "streamers":
                return renderStreamersContent();
            case "football":
                return renderFootballContent();
            default:
                return renderGamesContent();
        }
    };

    const renderGamesContent = () => (
        <>
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {GAMES.map((game) => (
                        <TouchableOpacity key={game.id} style={[styles.filterButton, selectedGame === game.id && styles.filterButtonActive]} onPress={() => setSelectedGame(game.id)}>
                            <Text style={[styles.filterText, selectedGame === game.id && styles.filterTextActive]}>{game.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {lineup && (
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>LINE-UP {lineup.game}</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>Ver todos</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lineupContainer}>
                            {lineup.players.map((player) => (
                                <TouchableOpacity
                                    key={player.id}
                                    style={styles.playerCard}
                                    // onPress={() => navigation.navigate('PlayerProfile', { playerId: player.id })}
                                >
                                    <Image source={typeof player.avatar === "string" ? { uri: player.avatar } : player.avatar} style={styles.playerAvatar} />
                                    <Text style={styles.playerNick}>{player.nick}</Text>
                                    <Text style={styles.playerRole}>{player.role}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>NOTÍCIAS</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>

                    {news.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.newsCard}
                            // onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}
                        >
                            <Image source={typeof item.image === "string" ? { uri: item.image } : item.image} style={styles.newsImage} />
                            <View style={styles.newsContent}>
                                <Text style={styles.newsTitle}>{item.title}</Text>
                                <Text style={styles.newsSummary}>{item.summary}</Text>
                                <Text style={styles.newsDate}>{item.date}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>ÚLTIMAS PARTIDAS</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Ver histórico</Text>
                        </TouchableOpacity>
                    </View>

                    {matches.map((match) => (
                        <View key={match.id} style={styles.matchCard}>
                            <View style={styles.matchInfo}>
                                <Text style={styles.matchGame}>{match.game}</Text>
                                <View style={styles.matchTeams}>
                                    <View style={styles.teamContainer}>
                                        <Image source={require("../../../assets/logo-furia-2.png")} style={styles.teamLogo} resizeMode="contain" />
                                        <Text style={styles.teamName}>FURIA</Text>
                                    </View>

                                    <Text style={styles.versusText}>VS</Text>

                                    <View style={styles.teamContainer}>
                                        <Image source={typeof match.opponentLogo === "string" ? { uri: match.opponentLogo } : match.opponentLogo} style={styles.teamLogo} />
                                        <Text style={styles.teamName}>{match.opponent}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.matchStatus}>
                                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(match.status) }]}>
                                    <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
                                </View>
                                {match.score && <Text style={styles.scoreText}>{match.score}</Text>}
                                <Text style={styles.matchDate}>{match.date}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </>
    );

    const renderStreamersContent = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>STREAMERS AO VIVO</Text>
                </View>

                {onlineStreamers.length > 0 ? (
                    onlineStreamers.map((streamer) => (
                        <TouchableOpacity key={streamer.user_name} style={styles.streamerCard}>
                            {streamer.avatar_url ? (
                                <Image
                                    source={{
                                        uri: streamer.avatar_url,
                                        cache: "force-cache",
                                    }}
                                    style={styles.streamerAvatar}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={[styles.streamerAvatar, { backgroundColor: "#ccc" }]} />
                            )}

                            <View style={styles.streamerInfo}>
                                <Text style={styles.streamerName}>{streamer.user_name}</Text>
                                <Text style={styles.streamerGame}>{streamer.game_name}</Text>
                                <Text style={styles.streamerViewers}>{streamer.viewer_count?.toLocaleString()} espectadores</Text>
                            </View>

                            <View style={styles.liveIndicator}>
                                <Text style={styles.liveText}>AO VIVO</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noStreamersText}>Nenhum streamer ao vivo no momento</Text>
                )}
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>CONHEÇA OS STREAMERS DA FURIA</Text>
                </View>

                {furiaStreamers.map((streamer) => (
                    <TouchableOpacity key={streamer.user_name} style={styles.streamerCard}>
                        <Image
                            source={
                                streamer.avatar_url ? { uri: streamer.avatar_url } : require("../../../assets/logo-furia-1.png") // Default avatar
                            }
                            style={styles.streamerAvatar}
                        />
                        <View style={styles.streamerInfo}>
                            <Text style={styles.streamerName}>{streamer.user_name}</Text>
                            {streamer.is_live ? (
                                <>
                                    <Text style={styles.streamerGame}>{streamer.game_name}</Text>
                                    <Text style={styles.streamerViewers}>{streamer.viewer_count?.toLocaleString()} espectadores</Text>
                                </>
                            ) : (
                                <Text style={styles.streamerOffline}>Offline</Text>
                            )}
                        </View>
                        {streamer.is_live && (
                            <View style={styles.liveIndicator}>
                                <Text style={styles.liveText}>AO VIVO</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderFootballContent = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>PRÓXIMA PARTIDA</Text>
                </View>

                {FOOTBALL_MATCHES.filter((match) => match.status === "upcoming").map((match) => (
                    <View key={match.id} style={styles.footballMatchCard}>
                        <Text style={styles.matchCompetition}>{match.competition}</Text>
                        <View style={styles.matchTeams}>
                            <View style={styles.teamContainer}>
                                <Image source={require("../../../assets/furia-fc.png")} style={styles.teamLogo} resizeMode="contain" />
                                <Text style={styles.teamName}>FURIA FC</Text>
                            </View>

                            <Text style={styles.versusText}>VS</Text>

                            <View style={styles.teamContainer}>
                                <Image source={typeof match.opponentLogo === "string" ? { uri: match.opponentLogo } : match.opponentLogo} style={styles.teamLogo} />
                                <Text style={styles.teamName}>{match.opponent}</Text>
                            </View>
                        </View>
                        <View style={styles.matchDetails}>
                            <Text style={styles.matchVenue}>{match.venue}</Text>
                            <Text style={styles.matchDate}>{match.date}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>ELENCO</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lineupContainer}>
                    {FOOTBALL_PLAYERS.map((player) => (
                        <TouchableOpacity key={player.id} style={styles.playerCard}>
                            <View style={styles.jerseyNumber}>
                                <Text style={styles.jerseyNumberText}>{player.number}</Text>
                            </View>
                            <Image source={typeof player.avatar === "string" ? { uri: player.avatar } : player.avatar} style={styles.playerAvatar} />
                            <Text style={styles.playerNick}>{player.name}</Text>
                            <Text style={styles.playerRole}>{player.position}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>HISTÓRICO DE PARTIDAS</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                {FOOTBALL_MATCHES.filter((match) => match.status !== "upcoming").map((match) => (
                    <View key={match.id} style={styles.footballMatchCard}>
                        <Text style={styles.matchCompetition}>{match.competition}</Text>
                        <View style={styles.matchTeams}>
                            <View style={styles.teamContainer}>
                                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.teamLogo} resizeMode="contain" />
                                <Text style={styles.teamName}>FURIA FC</Text>
                            </View>

                            <Text style={styles.versusText}>VS</Text>

                            <View style={styles.teamContainer}>
                                <Image source={typeof match.opponentLogo === "string" ? { uri: match.opponentLogo } : match.opponentLogo} style={styles.teamLogo} />
                                <Text style={styles.teamName}>{match.opponent}</Text>
                            </View>
                        </View>
                        <View style={styles.matchStatus}>
                            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(match.status) }]}>
                                <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
                            </View>
                            {match.score && <Text style={styles.scoreText}>{match.score}</Text>}
                            <Text style={styles.matchDate}>{match.date}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <View style={styles.header}>
                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />
            </View>

            <View style={styles.sectionNavContainer}>
                <TouchableOpacity style={[styles.sectionNavItem, selectedSection === "games" && styles.sectionNavItemActive]} onPress={() => setSelectedSection("games")}>
                    <FontAwesome name="gamepad" size={20} color={selectedSection === "games" ? "#FFFFFF" : "#333333"} />
                    <Text style={[styles.sectionNavText, selectedSection === "games" && styles.sectionNavTextActive]}>FURIA Games</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sectionNavItem, selectedSection === "streamers" && styles.sectionNavItemActive]} onPress={() => setSelectedSection("streamers")}>
                    <Feather name="video" size={20} color={selectedSection === "streamers" ? "#FFFFFF" : "#333333"} />
                    <Text style={[styles.sectionNavText, selectedSection === "streamers" && styles.sectionNavTextActive]}>FURIA Streamers</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sectionNavItem, selectedSection === "football" && styles.sectionNavItemActive]} onPress={() => setSelectedSection("football")}>
                    <Ionicons name="football" size={20} color={selectedSection === "football" ? "#FFFFFF" : "#333333"} />
                    <Text style={[styles.sectionNavText, selectedSection === "football" && styles.sectionNavTextActive]}>FURIA FC</Text>
                </TouchableOpacity>
            </View>

            {renderContent()}

            <View style={styles.bottomNavContainer}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Menu")}>
                    <Feather name="home" size={22} color="#9E9EB3" />
                    <Text style={styles.navText}>Início</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => {navigation.navigate("Explore")}}>
                    <Feather name="compass" size={22} color="#000000" />
                    <Text style={[styles.navText, styles.navTextActive]}>Explorar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Loja")}>
                    <Feather name="shopping-bag" size={22} color="#9E9EB3" />
                    <Text style={styles.navText}>Loja</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Perfil")}>
                    <Feather name="user" size={22} color="#9E9EB3" />
                    <Text style={styles.navText}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("LiveGame")}>
                    <Entypo name="chat" size={24} color="#777777" />
                    <Text style={styles.navText}>Live Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={signOut}>
                    <Feather name="log-out" size={24} color="#9E9EB3" />
                    <Text style={styles.navText}>Sair</Text>
                </TouchableOpacity>
            </View>
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
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    headerLogo: {
        width: 80,
        height: 30,
    },
    sectionNavContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    sectionNavItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#F7F7F7",
        flex: 1,
        marginHorizontal: 5,
        justifyContent: "center",
    },
    sectionNavItemActive: {
        backgroundColor: "#000000",
    },
    sectionNavText: {
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 5,
        color: "#333333",
    },
    sectionNavTextActive: {
        color: "#FFFFFF",
    },
    filterContainer: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    filterScroll: {
        paddingHorizontal: 15,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: "#F7F7F7",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    filterButtonActive: {
        backgroundColor: "#000000",
        borderColor: "#000000",
    },
    filterText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333333",
    },
    filterTextActive: {
        color: "#FFFFFF",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionContainer: {
        padding: 20,
        borderBottomWidth: 8,
        borderBottomColor: "#F0F0F0",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333333",
        letterSpacing: 0.5,
    },
    seeAllText: {
        fontSize: 14,
        color: "#9E9EB3",
    },
    lineupContainer: {
        paddingVertical: 10,
    },
    playerCard: {
        alignItems: "center",
        marginRight: 20,
        width: 80,
    },
    playerAvatar: {
        width: 60,
        height: 65,
        borderRadius: 30,
        marginBottom: 5,
    },
    playerNick: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 2,
    },
    playerRole: {
        fontSize: 12,
        color: "#9E9EB3",
    },
    jerseyNumber: {
        position: "absolute",
        top: -5,
        right: 10,
        backgroundColor: "#FF5500",
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    jerseyNumberText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    newsCard: {
        flexDirection: "row",
        marginBottom: 20,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#F9F9F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    newsImage: {
        width: 150,
        height: 120,
    },
    newsContent: {
        flex: 1,
        padding: 10,
    },
    newsTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 5,
    },
    newsSummary: {
        fontSize: 12,
        color: "#666666",
        marginBottom: 8,
    },
    newsDate: {
        fontSize: 11,
        color: "#9E9EB3",
    },
    matchCard: {
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#F9F9F9",
        borderLeftWidth: 3,
        borderLeftColor: "#000000",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    footballMatchCard: {
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#F9F9F9",
        borderLeftWidth: 3,
        borderLeftColor: "#FF5500",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    matchInfo: {
        marginBottom: 10,
    },
    matchGame: {
        fontSize: 12,
        fontWeight: "500",
        color: "#9E9EB3",
        marginBottom: 10,
    },
    matchCompetition: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 10,
    },
    matchTeams: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    teamContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    teamLogo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    teamName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333333",
    },
    versusText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#9E9EB3",
        paddingHorizontal: 10,
    },
    matchStatus: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
    },
    matchDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },
    matchVenue: {
        fontSize: 12,
        color: "#666666",
    },
    statusIndicator: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    scoreText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#333333",
    },
    matchDate: {
        fontSize: 12,
        color: "#9E9EB3",
    },
    // Estilos para Streamers
    streamerCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#F9F9F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    streamerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    streamerInfo: {
        flex: 1,
    },
    streamerName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 3,
    },
    streamerGame: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 3,
    },
    streamerViewers: {
        fontSize: 12,
        color: "#9E9EB3",
    },
    streamerOffline: {
        fontSize: 14,
        color: "#9E9EB3",
    },
    noStreamersText: {
        padding: 16,
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
    },
    liveIndicator: {
        backgroundColor: "#FF0000",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
    liveText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    bottomNavContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: "#F7F7F7",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        paddingBottom: 10,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    navText: {
        color: "#000000",
        fontSize: 12,
        marginTop: 4,
        fontWeight: "500",
    },
    navTextActive: {
        color: "#777777",
        fontSize: 12,
        marginTop: 4,
    },
});
