import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from '../AuthContext';

const adminEmail = "admin@admin.com";
const adminPassword = "123456789";

const firebaseConfig = {
  apiKey: "AIzaSyCaV_ikT4HTCXVnw64g9GNVjxnJG3ZlmuU",
  authDomain: "adventure-park-10111.firebaseapp.com",
  projectId: "adventure-park-10111",
  storageBucket: "adventure-park-10111.appspot.com",
  messagingSenderId: "41906163361",
  appId: "1:41906163361:web:75b9b20d4fd2de13f1aae0"
};


const LoginScreen = ({ navigation }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const adminEmail = "admin@admin.com";
const adminPassword = "Admin123456789";

  const { login } = useContext(AuthContext); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async () => {
    console.log("Email:", email);
    console.log("Password:", password);

    if (email === adminEmail && password === adminPassword) {
      handleAdminLogin();
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User SignIn:", user);
        login(user); 
        navigation.navigate('Home');
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("SignIn Error:", errorCode, errorMessage);
        Alert.alert('Sign In Error.');
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleAdminLogin = () => {
    Alert.alert('Admin SignIn!');
    navigation.navigate('Admin');
  };

  return (
    <ImageBackground source={require('../assets/Background/background.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Introduza o seu Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Introduza a sua Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#0066cc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#0066cc",
  },
  logo: {
    width: '50%',
    alignSelf: 'center',
  },
});

export default LoginScreen;