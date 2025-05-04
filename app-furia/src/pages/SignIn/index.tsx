import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes"; 

export default function SignIn() {
    const { signIn, loadingAuth } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        if (email === "" || password === "") {
            return;
        }
    
        try {
            await signIn({ email, password });
        } catch (error) {
            console.log(error);
        }
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#9e9eb3" />
                </TouchableOpacity>

                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />

                <View style={styles.placeholder} />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.topContent}>
                    <Text style={styles.welcomeTitle}>Bem vindo de volta</Text>

                </View>

                <View style={styles.middleContent}>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.bottomContent}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loadingAuth}>
                        {loadingAuth ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.buttonText}>ENTRAR</Text>}
                    </TouchableOpacity>
                </View>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 10,
    },
    backButton: {
        padding: 15,
        borderRadius: 50,
        backgroundColor: "#F7F7F7",
    },
    headerLogo: {
        width: 140,
        height: 50,
    },
    placeholder: {
        width: 54, 
    },
    contentContainer: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    topContent: {
        alignItems: "center",
        paddingTop: 30,
    },
    middleContent: {
        width: "100%",
        paddingVertical: 20,
    },
    bottomContent: {
        width: "100%",
        paddingBottom: 20,
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#333333",
    },
    googleButton: {
        flexDirection: "row",
        width: "100%",
        height: 55,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    googleButtonText: {
        fontSize: 16,
        color: "#333333",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    dividerText: {
        paddingHorizontal: 10,
        color: "#999999",
    },
    input: {
        width: "100%",
        height: 55,
        backgroundColor: "#F7F7F7",
        marginBottom: 18,
        borderRadius: 8,
        paddingHorizontal: 15,
        color: "#333333",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        width: "100%",
        height: 55,
        backgroundColor: "#000000",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 1,
    },
});
