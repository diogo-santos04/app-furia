import React, { useContext, useState, useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    Image, 
    TouchableOpacity, 
    SafeAreaView, 
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    ActivityIndicator,
    Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type MessageType = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
};

export default function ChatBot() {
    const { user, signOut } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<MessageType[]>([
        {
            id: "1",
            text: "Olá! Eu sou o assistente virtual da FURIA. Como posso ajudar você hoje?",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (message.trim() === "") return;

        const userMessage: MessageType = {
            id: Date.now().toString(),
            text: message.trim(),
            isUser: true,
            timestamp: new Date()
        };

        const userMessageText = message.trim();
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setMessage("");
        
        setIsLoading(true);
        
        try {
            const response = await fetch('http://192.168.100.139:8000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mensagem: userMessageText }),
            });
            
            if (!response.ok) {
                throw new Error('Falha na comunicação com o chatbot');
            }
            
            const data = await response.json();
            
            // Adiciona resposta do bot
            const botResponse: MessageType = {
                id: Date.now().toString(),
                text: data.resposta || 'Desculpe, tive um problema ao processar sua mensagem.',
                isUser: false,
                timestamp: new Date()
            };
            
            setMessages(prevMessages => [...prevMessages, botResponse]);
        } catch (error) {
            console.error('Erro ao comunicar com API de chatbot:', error);
            
            // Adiciona mensagem de erro como resposta do bot
            const errorResponse: MessageType = {
                id: Date.now().toString(),
                text: "Desculpe, estou enfrentando problemas técnicos no momento. Tente novamente mais tarde.",
                isUser: false,
                timestamp: new Date()
            };
            
            setMessages(prevMessages => [...prevMessages, errorResponse]);
        } finally {
            // Desativa indicador de loading
            setIsLoading(false);
        }
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString().slice(0, 5);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />
            </View>

            {/* Chat Title */}
            <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>ChatBot FURIA</Text>
                <Text style={styles.chatSubtitle}>Assistente Virtual</Text>
            </View>

            {/* Chat Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                style={styles.messageList}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageContainer,
                        item.isUser ? styles.userMessageContainer : styles.botMessageContainer
                    ]}>
                        {!item.isUser && (
                            <View style={styles.botAvatarContainer}>
                                <Image 
                                    source={require("../../../assets/logo-furia-2.png")} 
                                    style={styles.botAvatar} 
                                    resizeMode="contain" 
                                />
                            </View>
                        )}
                        <View style={[
                            styles.messageBubble,
                            item.isUser ? styles.userMessage : styles.botMessage
                        ]}>
                            <Text style={[
                                styles.messageText,
                                item.isUser ? styles.userMessageText : styles.botMessageText
                            ]}>
                                {item.text}
                            </Text>
                            <Text style={styles.messageTime}>
                                {formatTime(item.timestamp)}
                            </Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.messagesContentContainer}
                ListFooterComponent={
                    isLoading ? (
                        <View style={styles.loadingContainer}>
                            <View style={styles.loadingBubble}>
                                <ActivityIndicator size="small" color="#000000" />
                                <Text style={styles.loadingText}>FURIA está pensando...</Text>
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* Input Field */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.inputContainer}
                keyboardVerticalOffset={100}
            >
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    editable={!isLoading}
                />
                <TouchableOpacity 
                    style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
                    onPress={sendMessage}
                    disabled={isLoading || message.trim() === ""}
                >
                    <Feather name="send" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </KeyboardAvoidingView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Menu")}>	
                    <Feather name="home" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={()=> navigation.navigate("Explore")}>
                    <Feather name="compass" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Explorar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={()=>navigation}>
                    <Feather name="shopping-bag" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Loja</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Feather name="user" size={24} color="#777777" onPress={() => navigation.navigate("Perfil")}/>
                    <Text style={styles.navText}>Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={signOut}>
                    <Feather name="log-out" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Sair</Text>
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
        width: 100,
        height: 40,
    },
    chatHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        alignItems: "center"
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000000",
    },
    chatSubtitle: {
        fontSize: 14,
        color: "#777777",
    },
    messageList: {
        flex: 1,
        padding: 16,
    },
    messagesContentContainer: {
        paddingBottom: 16,
    },
    messageContainer: {
        flexDirection: "row",
        marginBottom: 16,
        alignItems: "flex-end",
    },
    userMessageContainer: {
        justifyContent: "flex-end",
    },
    botMessageContainer: {
        justifyContent: "flex-start",
    },
    botAvatarContainer: {
        marginRight: 8,
        backgroundColor: "#F0F0F0",
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    botAvatar: {
        width: 24,
        height: 24,
    },
    messageBubble: {
        maxWidth: "75%",
        borderRadius: 20,
        padding: 12,
    },
    userMessage: {
        backgroundColor: "#000000",
        borderBottomRightRadius: 4,
        marginLeft: "auto",
    },
    botMessage: {
        backgroundColor: "#F0F0F0",
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: "#FFFFFF",
    },
    botMessageText: {
        color: "#000000",
    },
    messageTime: {
        fontSize: 10,
        color: "#999999",
        marginTop: 4,
        alignSelf: "flex-end",
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
    sendButtonDisabled: {
        backgroundColor: "#999999",
    },
    loadingContainer: {
        padding: 8,
        marginBottom: 16,
        alignItems: "flex-start",
    },
    loadingBubble: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
        borderRadius: 20,
        padding: 12,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 4,
    },
    loadingText: {
        fontSize: 14,
        color: "#555555",
        marginLeft: 8,
    },
    bottomNav: {
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
    navTextInactive: {
        color: "#777777",
        fontSize: 12,
        marginTop: 4,
    },
});