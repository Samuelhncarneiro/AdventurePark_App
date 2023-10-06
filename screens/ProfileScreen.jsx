import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, firestore, signOut } from '../firebase.config';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');

  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Permission to access camera roll is required!');
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!pickerResult.cancelled) {
        setPhoto(pickerResult.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleLogout = async () => {
    navigation.navigate('Logout');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', auth.currentUser.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        setEmail(userData.email);
        setUsername(userData.username);
        setPassword(userData.password);
        setName(userData.name);
        setLastName(userData.lastName);
        setBirthdate(userData.birthdate);
        setAddress(userData.address);
        setPhoto(userData.photo);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', auth.currentUser.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;

      if (
        !username ||
        !email ||
        !password ||
        !name ||
        !lastName ||
        !birthdate ||
        !address ||
        !photo
      ) {
        Alert.alert('Error', 'Please fill in all the required fields.');
        return;
      }

      try {
        await updateDoc(userDocRef, {
          username,
          email,
          password,
          name,
          lastName,
          birthdate,
          address,
          photo,
        });

        console.log('Perfil atualizado com sucesso!');
        navigation.goBack();
      } catch (error) {
        console.log('Error updating user profile:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <ImageBackground source={require('../assets/Background/background.png')} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Editar Perfil</Text>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email: {email}</Text>
            </View>
            <View style={styles.formGroup}>
              <TouchableOpacity onPress={handleImagePicker}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.profileImage} />
                ) : (
                  <Text style={styles.imagePickerText}>Select Image</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.label}>Nome de utilizador:</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome:</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Apelido:</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Data de nascimento:</Text>
              <TextInput
                style={styles.input}
                value={birthdate}
                onChangeText={(text) => setBirthdate(text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Morada:</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={(text) => setAddress(text)}
              />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    padding: 1,
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: '#0066cc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#0066cc',
    alignSelf: 'center',
  },
  forgotPasswordText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0066cc',
    alignSelf: 'center',
  },
});

export default ProfileScreen;
