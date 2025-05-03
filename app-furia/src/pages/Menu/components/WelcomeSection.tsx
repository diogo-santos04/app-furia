// components/WelcomeSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserProps } from "../../../contexts/AuthContext";

export default function WelcomeSection({ name }: UserProps) {
    return (
        <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
                Olá, <Text style={styles.usernameText}>{name}</Text>!
            </Text>
            <Text style={styles.subText}>Acompanhe as novidades da FURIA</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    welcomeSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeText: {
        color: "#000000",
        fontSize: 22,
        fontWeight: "bold",
    },
    usernameText: {
        color: "#000000",
    },
    subText: {
        color: "#777777",
        fontSize: 16,
        marginTop: 5,
    },
});
