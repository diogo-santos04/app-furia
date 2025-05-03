import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { AuthContext } from "../contexts/AuthContext";

function Routes() {
    const { isAuthenticated, loading, loadingAuth } = useContext(AuthContext);
    
    if(loading || loadingAuth) {
        return(
            <View style={{
                flex: 1, 
                backgroundColor: "#FFFFFF", 
                justifyContent: "center", 
                alignItems: "center"
            }}>
                <ActivityIndicator size={60} color="#000000"/>
            </View>
        );
    }

    return isAuthenticated ? <AppRoutes /> : <AuthRoutes />
}

export default Routes;