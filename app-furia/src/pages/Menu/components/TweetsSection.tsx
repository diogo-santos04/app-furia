import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Linking } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";

interface Tweet {
    id: string;
    text: string;
    created_at: string;
}

interface TweetsSectionProps {
    tweets: Tweet[];
    loading: boolean;
    onRefresh: () => void;
    scrollX: Animated.Value;
    width: number;
}

const TweetsSection: React.FC<TweetsSectionProps> = ({ tweets, loading, onRefresh, scrollX, width }) => {
    const renderTweetItem = ({ item }: { item: Tweet }) => (
        <TouchableOpacity style={styles.tweetCard} onPress={() => openTwitter(item.id)}>
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

    const openTwitter = (tweetId: string) => {
        const twitterUrl = `https://twitter.com/FURIA/status/${tweetId}`;
        Linking.openURL(twitterUrl);
    };

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Últimos Tweets</Text>
                <TouchableOpacity onPress={onRefresh}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    tweetCarouselContainer: {
        paddingRight: 16,
    },
    tweetCard: {
        width: Dimensions.get("window").width - 80,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    tweetHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    tweetAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    tweetName: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#000000",
    },
    tweetHandle: {
        fontSize: 12,
        color: "#777777",
    },
    twitterIcon: {
        marginLeft: "auto",
    },
    tweetText: {
        fontSize: 14,
        color: "#333333",
        lineHeight: 20,
        marginBottom: 12,
    },
    tweetDate: {
        fontSize: 12,
        color: "#777777",
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: 100,
    },
    loadingText: {
        fontSize: 14,
        color: "#777777",
    },
});

export default TweetsSection;