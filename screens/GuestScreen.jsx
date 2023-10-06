import React ,  { useContext } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

const GuestScreen = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handlePresentation = () => {
    navigation.navigate('Presentation');
  };

  const handleContact = () => {
    navigation.navigate('Contact');
  };

  const handleGuest = () => {
    navigation.navigate('Guest');
  };

  const handleTest = () => {
    navigation.navigate('Home');
  };

  return (
    <ImageBackground source={require('../assets/Background/background.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Parque Aventura!</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>

        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    marginBottom: 11,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  smallButton: {
    width: 150,
    marginTop: 20,
  },
});

export default GuestScreen;
