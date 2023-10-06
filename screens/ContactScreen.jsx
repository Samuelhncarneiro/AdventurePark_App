import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase.config';

const ContactScreen = () => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const handleMessageSubmit = async () => {
    if (!username || !message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      const messageData = {
        message,
        username,
      };
  
      const docRef = await addDoc(collection(firestore, 'messages'), messageData);
  
      console.log('Message sent with ID:', docRef.id);
  
      setMessage('');
      setUsername('');
      Alert.alert('Success', 'Message sent successfully.');
    } catch (error) {
      console.log('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };
  return (
    <ImageBackground source={require('../assets/Background/background.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>Phone: 123-456-7890</Text>
        <Text style={styles.subtitle}>Email: contact@example.com</Text>
        <Text style={styles.subtitle}>Address: 123 Street, City, Country</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your message"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleMessageSubmit}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    padding: 5,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactScreen;
