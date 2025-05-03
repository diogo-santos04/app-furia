import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "../pages/Menu";
import Explore from "../pages/Explore";
import Loja from "../pages/Loja";
import Chatbot from "../pages/Chatbot";
import Perfil from "../pages/Perfil";
import LiveGame from "../pages/Livegame";
import FanChat from "../pages/Chat";

const Stack = createNativeStackNavigator();

export type StackParamsList = {
    Menu: undefined;
    Explore: undefined;
    Loja: undefined;
    Chatbot: undefined;
    Perfil: undefined;
    LiveGame: undefined;
    FanChat: undefined;
};


function AppRoutes() {
    return (
        <Stack.Navigator initialRouteName="Menu">
            <Stack.Screen
                name="Menu"
                component={Menu}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Explore"
                component={Explore}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Loja"
                component={Loja}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Chatbot"
                component={Chatbot}
                options={{ headerShown: false }}
            />
             <Stack.Screen
                name="LiveGame"
                component={LiveGame}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Perfil"
                component={Perfil}
                options={{ headerShown: false }}
            />
             <Stack.Screen
                name="FanChat"
                component={FanChat}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default AppRoutes;