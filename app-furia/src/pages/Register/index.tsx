import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, ScrollView, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

interface UserData {
    name: string;
    email: string;
    password: string;
    cpf: string;
    pais: string;
    estado: string;
    interesses: string[];
    atividades: string[];
    eventos: string[];
}

interface PersonalInfoStepProps {
    userData: UserData;
    updateUserData: (field: keyof UserData, value: string) => void;
}

interface OptionsStepProps {
    userData: UserData;
    toggleItem: (item: string) => void;
}


export default function SignUp() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const { register, loadingAuth } = useContext(AuthContext);

    const [currentStep, setCurrentStep] = useState<number>(1);

    const [userData, setUserData] = useState<UserData>({
        name: "",
        email: "",
        password: "",
        cpf: "",
        pais: "",
        estado: "",
        interesses: [],
        atividades: [],
        eventos: [],
    });

    const updateUserData = (field: keyof UserData, value: string): void => {
        setUserData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleArrayItem = (field: "interesses" | "atividades" | "eventos", item: string): void => {
        setUserData((prev) => {
            const currentArray = prev[field];
            const exists = currentArray.includes(item);

            if (exists) {
                return {
                    ...prev,
                    [field]: currentArray.filter((i) => i !== item),
                };
            } else {
                return {
                    ...prev,
                    [field]: [...currentArray, item],
                };
            }
        });
    };

    const nextStep = (): void => {
        if (currentStep === 1) {
            if (!userData.name || !userData.email || !userData.password || !userData.cpf || !userData.pais || !userData.estado) {
                Alert.alert("Atenção", "Por favor, preencha todos os campos");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                Alert.alert("Atenção", "Por favor, insira um email válido");
                return;
            }

            if (userData.password.length < 6) {
                Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres");
                return;
            }
        }

        if (currentStep === 2 && userData.interesses.length === 0) {
            Alert.alert("Atenção", "Por favor, selecione pelo menos um interesse");
            return;
        }

        if (currentStep === 3 && userData.atividades.length === 0) {
            Alert.alert("Atenção", "Por favor, selecione pelo menos uma atividade");
            return;
        }

        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            finishRegistration();
        }
    };

    const prevStep = (): void => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigation.goBack();
        }
    };

    const finishRegistration = async (): Promise<void> => {
        try {
            await register(userData);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Ocorreu um erro ao criar sua conta. Tente novamente.");
        }
    };

    const renderStepTitle = (): string => {
        switch (currentStep) {
            case 1:
                return "Informações Pessoais";
            case 2:
                return "Jogos";
            case 3:
                return "Interesses";
            case 4:
                return "Eventos de Interesse";
            default:
                return "";
        }
    };

    const renderStepContent = (): React.ReactNode => {
        switch (currentStep) {
            case 1:
                return <PersonalInfoStep userData={userData} updateUserData={updateUserData} />;
            case 2:
                return <InterestsStep userData={userData} toggleItem={(item) => toggleArrayItem("interesses", item)} />;
            case 3:
                return <ActivitiesStep userData={userData} toggleItem={(item) => toggleArrayItem("atividades", item)} />;
            case 4:
                return <EventsStep userData={userData} toggleItem={(item) => toggleArrayItem("eventos", item)} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                    <Feather name="arrow-left" size={24} color="#9e9eb3" />
                </TouchableOpacity>

                <Image source={require("../../../assets/logo-furia-2.png")} style={styles.headerLogo} resizeMode="contain" />

                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.stepIndicator}>
                        {[1, 2, 3, 4].map((step) => (
                            <View key={step} style={[styles.stepDot, currentStep === step ? styles.activeDot : {}, currentStep > step ? styles.completedDot : {}]} />
                        ))}
                    </View>

                    <Text style={styles.stepTitle}>{renderStepTitle()}</Text>

                    {renderStepContent()}

                    <TouchableOpacity style={styles.button} onPress={nextStep} disabled={loadingAuth}>
                        {loadingAuth ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.buttonText}>{currentStep === 4 ? "FINALIZAR" : "CONTINUAR"}</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ userData, updateUserData }) => {
    return (
        <View style={styles.stepContainer}>
            <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#999" value={userData.name} onChangeText={(text) => updateUserData("name", text)} />

            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={userData.email} onChangeText={(text) => updateUserData("email", text)} keyboardType="email-address" autoCapitalize="none" />

            <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999" value={userData.password} onChangeText={(text) => updateUserData("password", text)} secureTextEntry={true} />

            <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#999" value={userData.cpf} onChangeText={(text) => updateUserData("cpf", text)} keyboardType="numeric" />

            <TextInput style={styles.input} placeholder="País" placeholderTextColor="#999" value={userData.pais} onChangeText={(text) => updateUserData("pais", text)} />

            <TextInput style={styles.input} placeholder="Estado" placeholderTextColor="#999" value={userData.estado} onChangeText={(text) => updateUserData("estado", text)} />
        </View>
    );
};

const InterestsStep: React.FC<OptionsStepProps> = ({ userData, toggleItem }) => {
    const interests = ["CS2", "LOL", "PUBG", "Valorant", "FURIA FC"];

    return (
        <View style={styles.optionsContainer}>
            <Text style={styles.instructionText}>Selecione as categorias que você deseja acompanhar na FURIA</Text>

            {interests.map((interest) => (
                <TouchableOpacity key={interest} style={[styles.optionButton, userData.interesses.includes(interest) ? styles.selectedOption : {}]} onPress={() => toggleItem(interest)}>
                    <Text style={[styles.optionText, userData.interesses.includes(interest) ? styles.selectedOptionText : {}]}>{interest}</Text>
                    {userData.interesses.includes(interest) && <Feather name="check" size={18} color="#FFFFFF" />}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const ActivitiesStep: React.FC<OptionsStepProps> = ({ userData, toggleItem }) => {
    const activities = ["Campeonatos", "Loja", "Streamers", "Notícias"];

    return (
        <View style={styles.optionsContainer}>
            <Text style={styles.instructionText}>O que você quer acompanhar na FURIA ?</Text>

            {activities.map((activity) => (
                <TouchableOpacity key={activity} style={[styles.optionButton, userData.atividades.includes(activity) ? styles.selectedOption : {}]} onPress={() => toggleItem(activity)}>
                    <Text style={[styles.optionText, userData.atividades.includes(activity) ? styles.selectedOptionText : {}]}>{activity}</Text>
                    {userData.atividades.includes(activity) && <Feather name="check" size={18} color="#FFFFFF" />}
                </TouchableOpacity>
            ))}
        </View>
    );
};

const EventsStep: React.FC<OptionsStepProps> = ({ userData, toggleItem }) => {
    const events = ["VCT Americas", "CBLOL", "Major"];

    return (
        <View style={styles.optionsContainer}>
            <Text style={styles.instructionText}>Quais eventos você acompanha?</Text>

            {events.map((event) => (
                <TouchableOpacity key={event} style={[styles.optionButton, userData.eventos.includes(event) ? styles.selectedOption : {}]} onPress={() => toggleItem(event)}>
                    <Text style={[styles.optionText, userData.eventos.includes(event) ? styles.selectedOptionText : {}]}>{event}</Text>
                    {userData.eventos.includes(event) && <Feather name="check" size={18} color="#FFFFFF" />}
                </TouchableOpacity>
            ))}
        </View>
    );
};

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
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    stepIndicator: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 30,
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 6,
    },
    activeDot: {
        backgroundColor: "#000000",
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    completedDot: {
        backgroundColor: "#4CAF50",
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: "#333333",
    },
    stepContainer: {
        width: "100%",
        marginBottom: 20,
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
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 1,
    },
    optionsContainer: {
        width: "100%",
        marginBottom: 20,
    },
    instructionText: {
        fontSize: 16,
        color: "#666666",
        marginBottom: 20,
        textAlign: "center",
    },
    optionButton: {
        flexDirection: "row",
        width: "100%",
        height: 60,
        backgroundColor: "#F7F7F7",
        borderRadius: 8,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    selectedOption: {
        backgroundColor: "#000000",
        borderColor: "#000000",
    },
    optionText: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "500",
    },
    selectedOptionText: {
        color: "#FFFFFF",
    },
});
