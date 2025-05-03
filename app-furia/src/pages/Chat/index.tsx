import React, { useState, useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    SafeAreaView, 
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Types for messages
type FanMessageType = {
    id: string;
    text: string;
    username: string;
    avatar: string | null;
    timestamp: Date;
    reactions: {
        type: string;
        count: number;
    }[];
    isLive?: boolean;
};

// Reaction type definition
type ReactionType = {
    type: string;
    count: number;
};

// Dummy fan avatars and names for simulation
const FANS = [
    { username: "Fan 1", avatar: null },
    { username: "Fan 2", avatar: null },
    { username: "Fan 3", avatar: null },
    { username: "Fan 4", avatar: null },
    { username: "fan 5", avatar: null },
    { username: "Fan 6", avatar: null },
    { username: "Fan 7", avatar: null },
];

// Random fan messages for auto-generation
const FAN_MESSAGES = [
    "VAMOS FURIA! 🔥",
    "Que jogada incrível!",
    "Esse time não para! 💪",
    "Sempre contigo, FURIA!",
    "Mais um ponto, vamos!",
    "Não aguento de ansiedade 😬",
    "Alguém viu aquela jogada?",
    "Precisamos melhorar essa defesa",
    "Essa estratégia está funcionando!",
    "Esse vai ser nosso ano! 🏆",
    "Quem mais está vibrando aqui?",
    "Não tô aguentando esse jogo!",
    "VAMOS GANHAR HOJE! ⚡️",
    "Estamos com vocês!",
    "Que partida emocionante!",
];

// Game status types
type GameStatus = {
    isLive: boolean;
    opponent: string;
    score: string;
    timeElapsed: string;
    tournament: string;
    highlights: string[];
};

export default function FanChat() {
    const navigation = useNavigation();
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<FanMessageType[]>([]);
    const [autoSimulation, setAutoSimulation] = useState<boolean>(true);
    const flatListRef = useRef<FlatList>(null);
    const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    // Mock game status (in real app, would come from API)
    const [gameStatus, setGameStatus] = useState<GameStatus>({
        isLive: true,
        opponent: "NAVI",
        score: "FURIA 7 - 5 NAVI",
        timeElapsed: "23:15",
        tournament: "ESL Pro League",
        highlights: [
            "Kscerato com 3 abates na rodada anterior!",
            "FURIA recuperou a vantagem econômica"
        ]
    });

    useEffect(() => {
        // Initial messages
        const initialMessages: FanMessageType[] = [
            {
                id: "1",
                text: "Bem-vindo à sala de torcida da FURIA! Converse com outros torcedores durante o jogo. 🔥",
                username: "ChatAdmin",
                avatar: null,
                timestamp: new Date(),
                reactions: [
                    { type: "🔥", count: 5 },
                    { type: "👍", count: 3 }
                ],
                isLive: true
            },
            {
                id: "2",
                text: gameStatus.isLive 
                    ? `JOGO AO VIVO: ${gameStatus.score}` 
                    : "Não há jogos acontecendo no momento. Fique para conversar com outros torcedores!",
                username: "Sistema",
                avatar: null,
                timestamp: new Date(),
                reactions: [],
                isLive: true
            }
        ];
        
        setMessages(initialMessages);
        
        if (autoSimulation) {
            startSimulation();
        }
        
        return () => {
            if (simulationTimerRef.current) {
                clearInterval(simulationTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const startSimulation = () => {
        if (simulationTimerRef.current) {
            clearInterval(simulationTimerRef.current);
        }
        
        simulationTimerRef.current = setInterval(() => {
            const delay = Math.floor(Math.random() * (15000 - 5000) + 5000);
            
            setTimeout(() => {
                addRandomFanMessage();
                
                if (gameStatus.isLive && Math.random() < 0.2) {
                    addGameUpdate();
                }
            }, delay);
        }, 7000);
    };

    // Add random message from simulated fan
    const addRandomFanMessage = () => {
        const randomFan = FANS[Math.floor(Math.random() * FANS.length)];
        const randomMessage = FAN_MESSAGES[Math.floor(Math.random() * FAN_MESSAGES.length)];
        
        const newMessage: FanMessageType = {
            id: Date.now().toString(),
            text: randomMessage,
            username: randomFan.username,
            avatar: randomFan.avatar,
            timestamp: new Date(),
            reactions: [],
        };
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    // Add game update message
    const addGameUpdate = () => {
        // Random game updates
        const updates = [
            "FURIA ganha mais uma rodada! 🔥",
            "Time adversário recuperando...",
            `${gameStatus.score} - Jogo equilibrado!`,
            "Timeout pedido pela FURIA",
            "Kscerato com outro abate incrível!"
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        
        const updateMessage: FanMessageType = {
            id: Date.now().toString(),
            text: randomUpdate,
            username: "Sistema",
            avatar: null,
            timestamp: new Date(),
            reactions: [],
            isLive: true
        };
        
        setMessages(prevMessages => [...prevMessages, updateMessage]);
        
        // Update game status occasionally
        if (Math.random() < 0.3) {
            const newScore = gameStatus.score.includes("7 - 5") 
                ? "FURIA 8 - 5 Team Liquid" 
                : "FURIA 8 - 6 Team Liquid";
                
            const newTimeElapsed = `${parseInt(gameStatus.timeElapsed.split(":")[0]) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`;
            
            const newHighlights = [
                ...gameStatus.highlights.slice(-1),
                Math.random() < 0.5 
                    ? "FURIA com vantagem numérica nesta rodada" 
                    : "Timeout estratégico chamado"
            ];
            
            setGameStatus(prev => ({
                ...prev,
                score: newScore,
                timeElapsed: newTimeElapsed,
                highlights: newHighlights
            }));
        }
    };

    // Send user message
    const sendMessage = () => {
        if (message.trim() === "") return;
        
        const userMessage: FanMessageType = {
            id: Date.now().toString(),
            text: message.trim(),
            username: "VocêFã", // Replace with actual user's username from auth
            avatar: null,
            timestamp: new Date(),
            reactions: []
        };
        
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setMessage("");
    };

    // Add reaction to message
    const addReaction = (messageId: string, reactionType: string) => {
        setMessages(prevMessages => 
            prevMessages.map(msg => {
                if (msg.id === messageId) {
                    const existingReaction = msg.reactions.find(r => r.type === reactionType);
                    
                    if (existingReaction) {
                        // Increase count of existing reaction
                        return {
                            ...msg,
                            reactions: msg.reactions.map(r => 
                                r.type === reactionType ? { ...r, count: r.count + 1 } : r
                            )
                        };
                    } else {
                        // Add new reaction
                        return {
                            ...msg,
                            reactions: [...msg.reactions, { type: reactionType, count: 1 }]
                        };
                    }
                }
                return msg;
            })
        );
    };

    // Format timestamp
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString().slice(0, 5);
    };

    // Toggle auto simulation
    const toggleSimulation = () => {
        if (autoSimulation) {
            if (simulationTimerRef.current) {
                clearInterval(simulationTimerRef.current);
                simulationTimerRef.current = null;
            }
        } else {
            startSimulation();
        }
        
        setAutoSimulation(prev => !prev);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Conversa de Torcida</Text>
                <TouchableOpacity onPress={toggleSimulation}>
                    <Feather 
                        name={autoSimulation ? "pause-circle" : "play-circle"} 
                        size={24} 
                        color={autoSimulation ? "#f04" : "#080"} 
                    />
                </TouchableOpacity>
            </View>

            {/* Live Game Status Banner */}
            {gameStatus.isLive && (
                <View style={styles.gameStatusBanner}>
                    <View style={styles.gameStatusHeader}>
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveIndicatorDot} />
                            <Text style={styles.liveText}>AO VIVO</Text>
                        </View>
                        <Text style={styles.tournamentText}>{gameStatus.tournament}</Text>
                    </View>
                    
                    <Text style={styles.scoreText}>{gameStatus.score}</Text>
                    <Text style={styles.timeText}>{gameStatus.timeElapsed}</Text>
                    
                    <View style={styles.highlightsContainer}>
                        {gameStatus.highlights.map((highlight: string, index: number) => (
                            <Text key={index} style={styles.highlightText}>
                                • {highlight}
                            </Text>
                        ))}
                    </View>
                </View>
            )}

            {/* Chat Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                style={styles.messageList}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <View style={styles.messageBubble}>
                            <View style={styles.messageHeader}>
                                <Text style={styles.username}>{item.username}</Text>
                                <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
                            </View>
                            
                            <Text style={[
                                styles.messageText,
                                item.isLive && styles.systemMessage
                            ]}>
                                {item.text}
                            </Text>
                            
                            {/* Reactions */}
                            {item.reactions.length > 0 && (
                                <View style={styles.reactionsContainer}>
                                    {item.reactions.map((reaction: ReactionType, index: number) => (
                                        <TouchableOpacity 
                                            key={index}
                                            style={styles.reactionBubble}
                                            onPress={() => addReaction(item.id, reaction.type)}
                                        >
                                            <Text style={styles.reactionEmoji}>{reaction.type}</Text>
                                            <Text style={styles.reactionCount}>{reaction.count}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            
                            {/* Reaction buttons */}
                            <View style={styles.actionButtons}>
                                <TouchableOpacity onPress={() => addReaction(item.id, "👍")}>
                                    <Text style={styles.actionButton}>👍</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => addReaction(item.id, "🔥")}>
                                    <Text style={styles.actionButton}>🔥</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => addReaction(item.id, "❤️")}>
                                    <Text style={styles.actionButton}>❤️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.messagesContentContainer}
            />

            {/* Input Field */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.inputContainer}
                keyboardVerticalOffset={100}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Compartilhe sua torcida..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                <TouchableOpacity 
                    style={styles.sendButton} 
                    onPress={sendMessage}
                    disabled={message.trim() === ""}
                >
                    <Feather name="send" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
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
    gameStatusBanner: {
        backgroundColor: "#F4F4F4",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    gameStatusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    liveIndicator: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFE0E0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveIndicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF0000",
        marginRight: 4,
    },
    liveText: {
        color: "#FF0000",
        fontWeight: "bold",
        fontSize: 12,
    },
    tournamentText: {
        fontSize: 12,
        color: "#666666",
    },
    scoreText: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 4,
    },
    timeText: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 8,
    },
    highlightsContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 8,
    },
    highlightText: {
        fontSize: 13,
        color: "#222222",
        marginVertical: 2,
    },
    messageList: {
        flex: 1,
        padding: 16,
    },
    messagesContentContainer: {
        paddingBottom: 16,
    },
    messageContainer: {
        marginBottom: 16,
    },
    messageBubble: {
        backgroundColor: "#F7F7F7",
        borderRadius: 12,
        padding: 12,
        maxWidth: "100%",
    },
    messageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    username: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#333333",
    },
    messageTime: {
        fontSize: 12,
        color: "#999999",
    },
    messageText: {
        fontSize: 15,
        color: "#222222",
    },
    systemMessage: {
        fontWeight: "500",
        color: "#000000",
    },
    reactionsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    reactionBubble: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEEEEE",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 4,
    },
    reactionEmoji: {
        fontSize: 14,
        marginRight: 4,
    },
    reactionCount: {
        fontSize: 12,
        color: "#666666",
    },
    actionButtons: {
        flexDirection: "row",
        marginTop: 8,
    },
    actionButton: {
        fontSize: 16,
        marginRight: 14,
    },
    inputContainer: {
        flexDirection: "row",
        padding: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        backgroundColor: "#FFFFFF",
    },
    input: {
        flex: 1,
        backgroundColor: "#F0F0F0",
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 100,
        marginRight: 12,
    },
    sendButton: {
        backgroundColor: "#000000",
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
});
