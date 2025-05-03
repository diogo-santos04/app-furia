// components/Header.js
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Header() {
    return (
        <View style={styles.header}>
            <Image source={require("../../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />
            <TouchableOpacity style={styles.notificationButton}>
                <Feather name="bell" size={22} color="#000000" />
                <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>2</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    headerLogo: {
        width: 100,
        height: 40,
    },
    notificationButton: {
        position: "relative",
        padding: 5,
    },
    notificationBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#FF0000",
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationBadgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "bold",
    },
});