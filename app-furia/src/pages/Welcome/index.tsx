import { StackNavigationState } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Welcome: undefined;
    SignIn: undefined;
    Register: undefined;
  };
  
  type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
  
  interface WelcomeProps {
    navigation: WelcomeScreenNavigationProp;
  }

export default function Welcome({ navigation }: WelcomeProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header com logo pequena */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logo-furia-2.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>
      
      {/* Conteúdo principal */}
      <View style={styles.mainContent}>
        {/* Logo principal grande */}
        <Image
          source={require("../../../assets/logo-furia-1.png")}
          style={styles.mainLogo}
          resizeMode="contain"
        />
        
        {/* Mensagens de boas-vindas */}
        <Text style={styles.welcomeTitle}>BEM-VINDO</Text>
        <Text style={styles.welcomeSubtitle}>Faça parte do time e acompanhe todas as novidades da FURIA</Text>
      </View>
      
      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation && navigation.navigate('SignIn')}
        >
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation && navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>CRIAR CONTA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerLogo: {
    width: 80,
    height: 30,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  mainLogo: {
    width: 240,
    height: 150,
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#000000',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});