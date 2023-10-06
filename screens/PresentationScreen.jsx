import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

const PresentationScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/Background/background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Apresentação do Parque</Text>
        <Text style={styles.description}>
          Bem-vindo ao nosso parque de aventura! Aqui você encontrará diversas atividades emocionantes para todas as idades. Venha desafiar seus limites e se divertir em um ambiente seguro e acolhedor.
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', 
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
});

export default PresentationScreen;
