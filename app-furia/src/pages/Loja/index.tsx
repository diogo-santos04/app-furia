import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, ImageSourcePropType } from "react-native";
import { Feather,Entypo } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type ProductType = {
    id: string;
    name: string;
    price: string;
    image: ImageSourcePropType;
    isFavorite: boolean;
};

type CategoryType = {
    id: string;
    name: string;
};

type FavoritesState = {
    [key: string]: boolean;
};

export default function Shop() {
    const { user, signOut } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [activeCategory, setActiveCategory] = useState<string>("shop all");

    const shopBanner = {
        title: "FURIA X ADIDAS",
        description: "Adquira já os novos uniformes oficiais da FURIA",
        image: require("../../../assets/furia-ad.png"),
    };

    const categories: CategoryType[] = [
        { id: "1", name: "shop all" },
        { id: "2", name: "collections" },
        { id: "3", name: "outlet" },
    ];

    const products: ProductType[] = [
        {
            id: "1",
            name: "Camiseta Oficial 2025",
            price: "R$ 249,90",
            image: require("../../../assets/furia-camiseta-2.png"),
            isFavorite: false,
        },
        {
            id: "2",
            name: "Moletom FURIA",
            price: "R$ 299,90",
            image: require("../../../assets/moletom-furia.png"),
            isFavorite: true,
        },
        {
            id: "3",
            name: "Camiseta FURIA",
            price: "R$ 129,90",
            image: require("../../../assets/furia-camiseta-2.png"),
            isFavorite: false,
        },
        {
            id: "4",
            name: "Camiseta FURIA",
            price: "R$ 89,90",
            image: require("../../../assets/furia-camiseta-2.png"),
            isFavorite: false,
        },
    ];

    const [favorites, setFavorites] = useState<FavoritesState>(
        products.reduce<FavoritesState>((acc, product) => {
            acc[product.id] = product.isFavorite;
            return acc;
        }, {})
    );

    const toggleFavorite = (productId: string): void => {
        setFavorites((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.shopBanner}>
                    <Image source={shopBanner.image} style={styles.bannerImage} />
                    <View style={styles.bannerOverlay}>
                        <Text style={styles.bannerTitle}>{shopBanner.title}</Text>
                        <Text style={styles.bannerDescription}>{shopBanner.description}</Text>
                        <TouchableOpacity style={styles.shopNowButton}>
                            <Text style={styles.shopNowText}>COMPRAR AGORA</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={styles.categoryNavigation}>
                    {categories.map((category) => (
                        <TouchableOpacity key={category.id} style={[styles.categoryTab, activeCategory === category.name && styles.activeCategory]} onPress={() => setActiveCategory(category.name)}>
                            <Text style={[styles.categoryText, activeCategory === category.name && styles.activeCategoryText]}>{category.name.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>PRODUTOS EM DESTAQUE</Text>
                <View style={styles.productsGrid}>
                    {products.map((product) => (
                        <View key={product.id} style={styles.productCard}>
                            <View style={styles.productImageContainer}>
                                <Image source={product.image} style={styles.productImage} />
                                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(product.id)}>
                                    <Feather name={favorites[product.id] ? "heart" : "heart"} size={22} color={favorites[product.id] ? "#FF0000" : "#999999"} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>{product.price}</Text>
                            </View>
                            <TouchableOpacity style={styles.addToCartButton}>
                                <Text style={styles.addToCartText}>ADICIONAR AO CARRINHO</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Menu")}>
                    <Feather name="home" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Explore")}>
                    <Feather name="compass" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Explorar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Feather name="shopping-bag" size={24} color="#000000" />
                    <Text style={styles.navText}>Loja</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Perfil")}>
                    <Feather name="user" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("LiveGame")}>
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
        borderBottomColor: "#FFFFFF",
    },
    headerLogo: {
        width: 100,
        height: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    shopBanner: {
        height: 200,
        marginBottom: 24,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
    },
    bannerImage: {
        width: "100%",
        height: "100%",
    },
    bannerOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    bannerTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    bannerDescription: {
        color: "#FFFFFF",
        fontSize: 16,
        marginBottom: 12,
    },
    shopNowButton: {
        backgroundColor: "rgba(48, 44, 44, 0.5)",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignSelf: "flex-start",
    },
    shopNowText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
    categoryNavigation: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    categoryTab: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        flex: 1,
        alignItems: "center",
    },
    activeCategory: {
        borderBottomWidth: 2,
        borderBottomColor: "#000000",
    },
    categoryText: {
        fontSize: 14,
        color: "#777777",
    },
    activeCategoryText: {
        color: "#000000",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 16,
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    productCard: {
        width: "48%",
        backgroundColor: "#F7F7F7",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    productImageContainer: {
        position: "relative",
        height: 150,
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    favoriteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        color: "#000000",
        fontWeight: "500",
    },
    addToCartButton: {
        backgroundColor: "#000000",
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 8,
    },
    addToCartText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    bottomSpace: {
        height: 80,
    },
    bottomNav: {
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
    navTextInactive: {
        color: "#777777",
        fontSize: 12,
        marginTop: 4,
    },
});
