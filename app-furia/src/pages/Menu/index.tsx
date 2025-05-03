import React, { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Linking, Dimensions, Animated, FlatList } from "react-native";
import { AntDesign, Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {styles} from "./styles";

interface Tweet {
    created_at: string;
    text: string;
    id: string;
    edit_history_tweet_ids: string[];
}
type TabKey = "games" | "streamers" | "fc";
type PromoAction = "shop" | "event";
interface TabData {
    key: TabKey;
    data: any[]; 
}
interface CachedData {
    tweets: Tweet[];
    timestamp: number;
}

interface LiveMatch {
    id: string;
    time: string;
    team1: string;
    team1Logo: any;
    team2: string;
    team2Logo: any;
    score1: number;
    score2: number;
    tournament: string;
    tournamentLogo: any;
    isLive: boolean;
}

interface TabData {
    key: TabKey;
    title: string;
    icon: any;
    data: any[];
}

interface PromoItem {
    id: string | number;
    image: any;
    title: string;
    description: string;
    action: PromoAction;
    buttonText: string;
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

const TWEETS_CACHE_KEY = "@furia-app:tweets-cache";
const CACHE_EXPIRATION = 60 * 60 * 1000;

const { width } = Dimensions.get("window");


export default function Menu() {
    const { user, signOut } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("games");
    const scrollX = useRef(new Animated.Value(0)).current;
    const [animatedWidth] = useState(new Animated.Value(0));
    const [engagement, setEngagement] = useState(0);
    const [onlineStreamers, setOnlineStreamers] = useState<Streamer[]>([]);

    const interpolatedWidth = animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });

    const liveMatch: LiveMatch = {
        id: "1",
        time: "AGORA",
        team1: "FURIA",
        team1Logo: require("../../../assets/logo-furia-2.png"),
        team2: "NAVI",
        team2Logo: require("../../../assets/oponentes/navi.png"),
        score1: 1,
        score2: 0,
        tournament: "IEM Dallas 2025",
        tournamentLogo: require("../../../assets/esl.png"),
        isLive: true,
    };

    const mainHighlight = {
        id: "0",
        title: "BEM VINDO À #FURIACS, yek1ndar",
        description: "O jogador se juntará a nós como stand-in para a disputa da PGL Astana, IEM Dallas e BLAST Austin Major 2025.",
        image: require("../../../assets/furia-ad-2.png"),
    };

    const tabsData: TabData[] = [
        {
            key: "games",
            title: "FURIA Games",
            icon: "gamepad",
            data: [
                {
                    id: "1",
                    title: "CS2",
                    upcoming: "vs NAVI - IEM Dallas - Hoje 19:00",
                    lastResult: "FURIA 2 x 0 MIBR - BLAST Premier",
                    image: require("../../../assets/cs2.jpg"),
                },
                {
                    id: "2",
                    title: "VALORANT",
                    upcoming: "vs Sentinels - VCT Americas - Amanhã 15:00",
                    lastResult: "FURIA 1 x 2 LOUD - VCT Americas",
                    image: require("../../../assets/valorant.png"),
                },
            ],
        },
        {
            key: "streamers",
            title: "Streamers",
            icon: "video",
            data: [
                {
                    id: "1",
                    name: "guerri",
                    game: "Counter-Strike 2",
                    viewers: "3.2K",
                    image: require("../../../assets/logo-furia-1.png"),
                    isLive: true,
                },
                {
                    id: "2",
                    name: "KSCERATO",
                    game: "Just Chatting",
                    viewers: "1.8K",
                    image: require("../../../assets/logo-furia-1.png"),
                    isLive: true,
                },
            ],
        },
        {
            key: "fc",
            title: "FURIA FC",
            icon: "soccer-ball",
            data: [
                {
                    id: "1",
                    title: "Kings League",
                    match: "FURIA FC x DENDELE FC",
                    nextMatch: "29/04 - 16:00",
                    image: require("../../../assets/furia-fc.png"),
                },
            ],
        },
    ];

    const topFans = [
        { id: "1", name: "Fã 1", points: 2450, avatar: require("../../../assets/logo-furia-1.png") },
        { id: "2", name: "Fã 2", points: 2320, avatar: require("../../../assets/logo-furia-1.png") },
        { id: "3", name: "Fã 3", points: 2180, avatar: require("../../../assets/logo-furia-1.png") },
        { id: "4", name: "Fã 4", points: 1950, avatar: require("../../../assets/logo-furia-1.png") },
        { id: "5", name: "Fã 5", points: 1820, avatar: require("../../../assets/logo-furia-1.png") },
    ];

    const promoEvents = [
        {
            id: "1",
            title: "Nova coleção de uniformes",
            description: "A coleção 2025 já está disponível na loja oficial",
            image: require("../../../assets/furia-ad.png"),
            buttonText: "Comprar agora",
            action: "shop",
        },
        {
            id: "2",
            title: "FURIA Experience",
            description: "Evento presencial em São Paulo dias 15-17 de maio",
            image: require("../../../assets/furia-evento.jpg"),
            buttonText: "Reservar lugar",
            action: "event",
        },
    ];

    const saveTweetsToCache = async (tweetsData: Tweet[]) => {
        try {
            const dataToCache: CachedData = {
                tweets: tweetsData,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(TWEETS_CACHE_KEY, JSON.stringify(dataToCache));
            console.log("Tweets salvos no cache com sucesso");
        } catch (error) {
            console.error("Erro ao salvar tweets no cache:", error);
        }
    };

    const getTweetsFromCache = async (): Promise<Tweet[] | null> => {
        try {
            const cachedData = await AsyncStorage.getItem(TWEETS_CACHE_KEY);

            if (cachedData) {
                const parsedData: CachedData = JSON.parse(cachedData);

                const now = Date.now();
                if (now - parsedData.timestamp < CACHE_EXPIRATION) {
                    return parsedData.tweets;
                } else {
                    console.log("Cache expirado, buscando novos tweets");
                    return null;
                }
            }

            console.log("Nenhum cache encontrado");
            return null;
        } catch (error) {
            console.error("Erro ao recuperar tweets do cache:", error);
            return null;
        }
    };

    const fetchTweets = async () => {
        setLoading(true);

        try {
            const cachedTweets = await getTweetsFromCache();

            if (cachedTweets) {
                setTweets(cachedTweets);
                setLoading(false);
                return;
            }

            const response = await api.post("/twitter-tweets", { username: "FURIA", max_results: 5 });
            const newTweets = response.data.tweets || [];

            setTweets(newTweets);

            await saveTweetsToCache(newTweets);
        } catch (error) {
            console.error("Erro ao buscar tweets:", error);

            try {
                const cachedData = await AsyncStorage.getItem(TWEETS_CACHE_KEY);
                if (cachedData) {
                    const parsedData: CachedData = JSON.parse(cachedData);
                    setTweets(parsedData.tweets);
                    console.log("Usando cache expirado devido a erro na API");
                }
            } catch (cacheError) {
                console.error("Erro ao usar cache de emergência:", cacheError);
            }
        } finally {
            setLoading(false);
        }
    };
    //ideia descartada por enqunto
    const fetchEngagement = async () => {
        console.log("hit engajamento");
        try {
            const response = await api.post("/engagement", { username: "FURIA", max_results: 5 });
            console.log("RESULTADO ENGAJAMENTO", response.data);
            const data = response.data;
            console.log("Status:", data.status);

            if (data.status === "success") {
                const total = data.total_engagement;

                let percentage = Math.min((total / 1000) * 100, 100);

                setEngagement(percentage);

                Animated.timing(animatedWidth, {
                    toValue: percentage,
                    duration: 800,
                    useNativeDriver: false,
                }).start();
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function fetchStreamers() {
        try {
            const response = await api.get("/twitch/streams");

            if (response.data && Array.isArray(response.data)) {
                const allStreamers = response.data;

                const liveStreamers = allStreamers.filter((streamer) => streamer.is_live);

                setOnlineStreamers(liveStreamers);

                console.log(`${liveStreamers.length} ao vivo`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchTweets();
        fetchStreamers();
    }, []);

    function handleTabChange(tabKey: TabKey) {
        setActiveTab(tabKey);
    }

    function openTwitter(tweetId: number) {
        const twitterUrl = `https://twitter.com/FURIA/status/${tweetId}`;
        Linking.openURL(twitterUrl);
    }

    // function formatDate(dateString: string) {
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString("pt-BR", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //     });
    // }

    function handlePromoAction(action: PromoAction) {
        if (action === "shop") {
            navigation.navigate("Loja");
        } else if (action === "event") {
            navigation.navigate("Explore");
        }
    }

    function getDaysUntilEvent(date: string | Date): number {
        const eventDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(eventDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const renderTabContent = () => {
        const activeTabData: TabData | undefined = tabsData.find((tab: TabData) => tab.key === activeTab);
        if (!activeTabData) return null;
        if (activeTab === "games") {
            return (
                <View style={styles.tabContent}>
                    {activeTabData.data.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.gameCard}>
                            <Image source={item.image} style={styles.gameImage} />
                            <View style={styles.gameInfo}>
                                <Text style={styles.gameTitle}>{item.title}</Text>
                                <Text style={styles.upcomingMatch}>{item.upcoming}</Text>
                                <Text style={styles.lastResult}>{item.lastResult}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.exploreMoreButton}>
                        <Text style={styles.exploreMoreText}>Explorar mais</Text>
                        <Feather name="arrow-right" size={16} color="#0000000" />
                    </TouchableOpacity>
                </View>
            );
        } else if (activeTab === "streamers") {
            return (
                <View style={styles.tabContent}>
                    {onlineStreamers.map((streamer) => (
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
                    ))}

                    <TouchableOpacity style={styles.exploreMoreButton}>
                        <Text style={styles.exploreMoreText}>Ver todos streamers</Text>
                        <Feather name="arrow-right" size={16} color="#000000" />
                    </TouchableOpacity>
                </View>
            );
        } else if (activeTab === "fc") {
            return (
                <View style={styles.tabContent}>
                    {activeTabData.data.map((item: any) => (
                        <TouchableOpacity key={item.id} style={styles.fcCard}>
                            <Image source={item.image} style={styles.fcImage} />
                            <View style={styles.fcInfo}>
                                <Text style={styles.fcTitle}>{item.title}</Text>
                                <Text style={styles.fcMatch}>{item.match}</Text>
                                <Text style={styles.fcNextMatch}>{item.nextMatch}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.exploreMoreButton}>
                        <Text style={styles.exploreMoreText}>Ver mais do FURIA FC</Text>
                        <Feather name="arrow-right" size={16} color="#00000" />
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    const renderTweetItem = ({ item }: { item: Tweet }) => {
        return (
            <TouchableOpacity style={styles.tweetCard} onPress={() => openTwitter(Number(item.id))}>
                <View style={styles.tweetHeader}>
                    <Image source={require("../../../assets/logo-furia-1.png")} style={styles.tweetAvatar} resizeMode="contain" />
                    <View>
                        <Text style={styles.tweetName}>FURIA</Text>
                        <Text style={styles.tweetHandle}>@FURIA</Text>
                    </View>
                    <FontAwesome6 name="x-twitter" size={18} color="#000000" style={styles.twitterIcon} />
                </View>
                <Text style={styles.tweetText}>{item.text.length > 120 ? item.text.substring(0, 120) + "..." : item.text}</Text>
                <Text style={styles.tweetDate}>{item.created_at}</Text>
            </TouchableOpacity>
        );
    };

    const renderPromoItem = ({ item }: { item: PromoItem }) => {
        return (
            <View style={styles.promoCard}>
                <Image source={item.image} style={styles.promoImage} />
                <View style={styles.promoContent}>
                    <Text style={styles.promoTitle}>{item.title}</Text>
                    <Text style={styles.promoDescription}>{item.description}</Text>
                    <TouchableOpacity style={styles.promoButton} onPress={() => handlePromoAction(item.action)}>
                        <Text style={styles.promoButtonText}>{item.buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />
                <TouchableOpacity style={styles.notificationButton}>
                    <Feather name="bell" size={22} color="#000000" />
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>2</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>
                        Olá, <Text style={styles.usernameText}>{user.name}</Text>!
                    </Text>
                    <Text style={styles.subText}>Acompanhe as novidades da FURIA</Text>
                </View>

                <TouchableOpacity style={styles.liveMatchCard}>
                    <View style={styles.liveMatchHeader}>
                        <View style={styles.liveIndicatorContainer}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>AO VIVO</Text>
                        </View>
                        <View style={styles.tournamentContainer}>
                            <Image source={liveMatch.tournamentLogo} style={styles.tournamentLogo} resizeMode="contain" />
                            <Text style={styles.tournamentName}>{liveMatch.tournament}</Text>
                        </View>
                    </View>

                    <View style={styles.teamsContainer}>
                        <View style={styles.teamSection}>
                            <Image source={liveMatch.team1Logo} style={styles.teamLogo} resizeMode="contain" />
                            <Text style={styles.teamName}>{liveMatch.team1}</Text>
                        </View>

                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreText}>{liveMatch.score1}</Text>
                            <Text style={styles.scoreDivider}>:</Text>
                            <Text style={styles.scoreText}>{liveMatch.score2}</Text>
                        </View>

                        <View style={styles.teamSection}>
                            <Image source={liveMatch.team2Logo} style={styles.teamLogo} resizeMode="contain" />
                            <Text style={styles.teamName}>{liveMatch.team2}</Text>
                        </View>
                    </View>

                    <View style={styles.watchButtonContainer}>
                        <TouchableOpacity style={styles.watchButton}>
                            <FontAwesome6 name="play-circle" size={16} color="#FFFFFF" />
                            <Text style={styles.watchButtonText}>Assistir agora</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.watchButtonWatchParty}>
                            <FontAwesome6 name="twitch" size={16} color="#FFFFFF" />
                            <Text style={styles.watchButtonText}>WatchParty</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Destaque</Text>
                </View>
                <TouchableOpacity style={styles.mainCard}>
                    <Image source={mainHighlight.image} style={styles.mainCardImage} />
                    <View style={styles.mainCardContent}>
                        <Text style={styles.mainCardTitle}>{mainHighlight.title}</Text>
                        <Text style={styles.mainCardDescription}>{mainHighlight.description}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.tabsContainer}>
                    <View style={styles.tabsHeader}>
                        {tabsData.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                                onPress={() => handleTabChange(tab.key)}
                            >
                                <FontAwesome6 name={tab.icon} size={16} color={activeTab === tab.key ? "#000000" : "#777777"} />
                                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {renderTabContent()}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Últimos Tweets</Text>
                    <TouchableOpacity onPress={fetchTweets}>
                        <Feather name="refresh-cw" size={16} color="#777777" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Carregando tweets...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={tweets.slice(0, 3)}
                        renderItem={renderTweetItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tweetCarouselContainer}
                        snapToInterval={width - 80}
                        decelerationRate="fast"
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                    />
                )}


                <View style={styles.engagementContainer}>
                    <Text style={styles.engagementlabel}>🔥 Engajamento nas redes da FURIA</Text>
                    <View style={styles.barBackground}>
                        <Animated.View style={[styles.barFill, { width: interpolatedWidth }]} />
                    </View>
                    <Text style={styles.percentage}>{Math.round(engagement)}%</Text>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Fãs da Semana</Text>
                </View>
                <View style={styles.fansRankingContainer}>
                    <View style={styles.userRankingContainer}>
                        <View style={styles.yourRankingCard}>
                            <View style={styles.yourRankingInfo}>
                                <Image source={require("../../../assets/logo-furia-1.png")} style={styles.userAvatar} />
                                <View>
                                    <Text style={styles.yourRankingText}>Seu ranking</Text>
                                    <Text style={styles.yourRankingPosition}>23º Lugar</Text>
                                </View>
                            </View>
                            <View style={styles.yourPointsContainer}>
                                <Text style={styles.yourPoints}>950</Text>
                                <Text style={styles.pointsLabel}>pontos</Text>
                            </View>
                        </View>
                    </View>

                    {topFans.map((fan, index) => (
                        <View key={fan.id} style={styles.fanRankingRow}>
                            <Text style={styles.fanRanking}>{index + 1}</Text>
                            <Image source={fan.avatar} style={styles.fanAvatar} />
                            <Text style={styles.fanName}>{fan.name}</Text>
                            <Text style={styles.fanPoints}>{fan.points} pts</Text>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.viewFullRankingButton}>
                        <Text style={styles.viewFullRankingText}>Ver Ranking Completo</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", marginTop: 4 }}>Countdown para o proximo evento</Text>
                <View style={styles.countdownContainer}>
                    <Image source={require("../../../assets/austin-major-2.png")} style={styles.countdownBackground} />

                    <View style={styles.countdownOverlay} />

                    <Text style={styles.countdownTitle}>BLAST AUSTIN MAJOR 2025</Text>

                    <View style={styles.countdownRow}>
                        <Text style={styles.countdownText}>Começa em:</Text>
                        <Text style={styles.countdownDays}>{getDaysUntilEvent("2025-06-03")} dias</Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Promoções e Eventos</Text>
                </View>
                <FlatList
                    data={promoEvents as PromoItem[]} 
                    renderItem={renderPromoItem}
                    keyExtractor={(item: PromoItem) => item.id.toString()} 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.promoCarouselContainer}
                    snapToInterval={width - 60}
                    decelerationRate="fast"
                />
                <View style={{ height: 80 }} />
            </ScrollView>

            <TouchableOpacity style={styles.furiaBot} onPress={()=>navigation.navigate("Chatbot")}>
                <Feather name="message-circle" size={24} color="#FFFFFF" />
                <Text style={styles.furiaBotText}>FURIA Bot</Text>
            </TouchableOpacity>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="home" size={24} color="#000000" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate("Explore")}>
                    <Feather name="compass" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Explorar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate("Loja")}>
                    <Feather name="shopping-bag" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Loja</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="user" size={24} color="#777777" onPress={()=>navigation.navigate("Perfil")}/>
                    <Text style={styles.navTextInactive}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate("LiveGame")}>
                    <Entypo name="chat" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Live Game</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={signOut}>
                    <Feather name="log-out" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Sair</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

