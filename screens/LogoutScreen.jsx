import React, { useContext } from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { AuthContext } from '../AuthContext';

const LogoutScreen = ({ navigation }) => {
  const { logout, isLoggedIn } = useContext(AuthContext); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logout bem-sucedido');
      logout();
      console.log('Status do usuário logado:', isLoggedIn); 
      navigation.navigate('Guest');
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout Screen</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogoutScreen;
