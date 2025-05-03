import React, { useContext, useState, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type UserProfileData = {
    id: string;
    name: string;
    email: string;
    token: string;
    cpf?: string;
    pais?: string;
    estado?: string;
    interesses?: string[];
    atividades?: string[];
    eventos?: string[];
};

export default function Profile() {
    const { user, signOut } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);

    useEffect(() => {
        setProfileData(user);
        console.log("dados do usuario",user)
        setIsLoading(false);
    }, [user]);


    function handleEditProfile(): void {
        Alert.alert("Editar Perfil", "Funcionalidade em desenvolvimento");
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
                <View style={styles.profileHeader}>
                    <View style={styles.profileImageContainer}>
                        <Image 
                            source={require("../../../assets/logo-furia-1.png")} 
                            style={styles.profileImage} 
                            resizeMode="cover" 
                        />
                    </View>
                    <Text style={styles.profileName}>{profileData?.name}</Text>
                    <Text style={styles.profileEmail}>{profileData?.email}</Text>
                    {profileData?.pais && profileData.estado && (
                        <Text style={styles.location}>{profileData.estado}, {profileData.pais}</Text>
                    )}
                    
                    <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                        <Feather name="edit-2" size={16} color="#FFFFFF" />
                        <Text style={styles.editButtonText}>Editar perfil</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meus interesses</Text>
                    <View style={styles.interestsContainer}>
                        {profileData?.interesses && profileData.interesses.length > 0 ? (
                            profileData.interesses.map((interesse, index) => (
                                <View key={index} style={styles.interestTag}>
                                    <Text style={styles.interestText}>{interesse}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyStateText}>Nenhum interesse adicionado ainda.</Text>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Atividades recentes</Text>
                    {profileData?.atividades && profileData.atividades.length > 0 ? (
                        profileData.atividades.map((atividade, index) => (
                            <View key={index} style={styles.activityItem}>
                                <View style={styles.activityIconContainer}>
                                    <Feather name="check-circle" size={20} color="#000000" />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityName}>{atividade}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyStateText}>Nenhuma atividade recente.</Text>
                    )}
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meus eventos</Text>
                    {profileData?.eventos && profileData.eventos.length > 0 ? (
                        profileData.eventos.map((evento, index) => (
                            <View key={index} style={styles.eventItem}>
                                <View style={styles.eventIconContainer}>
                                    <Feather name="calendar" size={20} color="#000000" />
                                </View>
                                <View style={styles.eventContent}>
                                    <Text style={styles.eventName}>{evento}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyStateText}>Nenhum evento registrado.</Text>
                    )}
                </View>
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

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Loja")}>
                    <Feather name="shopping-bag" size={24} color="#777777" />
                    <Text style={styles.navTextInactive}>Loja</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Feather name="user" size={24} color="#000000" />
                    <Text style={styles.navText}>Perfil</Text>
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
    location: {
        fontSize: 14,
        color: "#777777",
        marginBottom: 4,
    },
    emptyStateText: {
        fontSize: 14,
        color: "#999999",
        fontStyle: "italic",
        paddingVertical: 8,
    },
    eventItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    eventIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    eventContent: {
        flex: 1,
    },
    eventName: {
        fontSize: 16,
        color: "#000000",
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#777777",
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
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    profileHeader: {
        alignItems: "center",
        paddingVertical: 24,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: 120,
        height: 120,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 16,
        color: "#777777",
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 14,
        color: "#999999",
        marginBottom: 16,
    },
    editButton: {
        flexDirection: "row",
        backgroundColor: "#000000",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: "center",
    },
    editButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 6,
    },
    section: {
        padding: 16,
        borderTopWidth: 8,
        borderTopColor: "#F7F7F7",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 16,
    },
    interestsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -4,
    },
    interestTag: {
        backgroundColor: "#F0F0F0",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        margin: 4,
    },
    interestText: {
        fontSize: 14,
        color: "#000000",
    },
    activityItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    activityIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityName: {
        fontSize: 16,
        color: "#000000",
        marginBottom: 2,
    },
    activityDate: {
        fontSize: 14,
        color: "#999999",
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