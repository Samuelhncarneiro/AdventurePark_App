import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground, Keyboard, Pressable, Platform } from 'react-native';
import InputBox from '../components/InputBox';
import { auth, firestore } from '../firebase.config.js';
import { collection, query, querySnapshot, where, getDocs, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterScreen = () => {
  const [inputs, setInputs] = useState({
    photo: '',
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
    name: '',
    lastName: '',
    birthDate: new Date(),
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setbirthDate] = useState(new Date());

  const handleOnChange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleDateChange = (event, selectedDate) => {
    // const currentDate = selectedDate;
    // setDate(birthDate);
    
    if (selectedDate){
      setbirthDate(selectedDate);
    }
    setShowDatePicker(false);
    console.log(birthDate);
  };

  const handleDateToString = (date) => {
    return date.toDateString();
  }

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        alert('Permissão para acessar a biblioteca de mídia foi negada!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setInputs((prevState) => ({ ...prevState, photo: result.uri }));
      }
    } catch (error) {
      console.error('Erro ao selecionar a imagem:', error);
    }
  };

  const registerUser = async () => {
    const { address, birthDate, email, lastName, name, password, photo, username } = inputs;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, username);
  
      const user = {
        photo,
        username,
        email,
        password,
        name,
        lastName,
        birthDate: birthDate.toISOString(),
        address,
      };
  
      await addDoc(collection(firestore, 'users'), user);
      console.log('Registered: ', user);
  
      setInputs({
        photo: '',
        username: '',
        email: '',
        password: '',
        name: '',
        lastName: '',
        setbirthDate: '',
        address: '',
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(error);
        Alert.alert('Email já utilizado!', 'Por favor, use outro email.');
      } else {
        console.error('Erro ao registrar o usuário: ', error);
        Alert.alert('Erro', 'Falha ao registrar o usuário. Por favor, tente novamente.');
      }
    }
  }  

  const checkUsernameAvailable = async (username) => {
    try {
      const usersRef = collection(firestore, 'users');
      const usersQuery = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(usersQuery);

      return querySnapshot.empty;

    } catch (error) {
      console.error('Erro ao verificar o nome de usuário:', error);
      return false;
    }
  };

  const checkEmailAvailable = async (email) => {
    try {
      const usersRef = collection(firestore, 'users');
      const usersQuery = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(usersQuery);

      return querySnapshot.empty;

    } catch (error) {
      console.error('Erro ao verificar o email:', error);
      return false;
    }
  };

  const checkEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
    return (
      password.length >= 6 &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password) &&
      specialCharRegex.test(password)
    );
  };

  const handleRegister = async () => {
    let valid = true;
    const newErrors = {};
    let alertFlag = false;

    if (!inputs.photo) {
      newErrors.photo = 'Porfavor intruduzir foto';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor adicionar foto.');
        alertFlag = true;
      }
    }
    
    if (!inputs.username) {
      newErrors.username = 'Porfavor intruduzir username';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor preencher username.');
        alertFlag = true;
      } else {
        const isUsernameAvailable = await checkUsernameAvailable(inputs.username);
        if (!isUsernameAvailable) {
          newErrors.username = 'Nome de usuario ja registado!';
          valid = false;
          if (!alertFlag) {
            Alert.alert('Nome de usuario indisponivel!', 'Porfavor, escolha outro username');
            alertFlag = true;
          }
        }
      } 
    }

    if (!inputs.email) {
      newErrors.email = 'Porfavor intruduzir email';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor preencher email.');
        alertFlag = true;
      }
    } else if (!checkEmailFormat(inputs.email)) {
      newErrors.email = 'Porfavor introduzir email valido';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor introduzir email válido.');
        alertFlag = true;
      }
    } 

    if (!inputs.password) {
      newErrors.password = 'Porfavor intruduzir password';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor introduzir password.');
        alertFlag = true;
      }
    } else if (!checkPasswordStrength(inputs.password)) {
      newErrors.password = 'Tamanho minimo de 6 caracteres, uma letra minuscula, uma letra maiscula, um numero e um caracter especial';
      valid = false;
      if (!alertFlag){
        Alert.alert('Password invalida!', 'Minimo de 6 caracteres, uma letra minuscula, uma letra maiscula, um numero e um caracter especial.');
        alertFlag = true;
      }
    }

    if (inputs.password !== inputs.confirmpassword) {
      newErrors.password = 'Passwords não condizem';
      valid = false;
      if (!alertFlag){
        Alert.alert('Passwords nao condizem!', 'Porfavor volte a introduzir as passwords.');
        alertFlag = true;
      }
    }

    if (!inputs.name) {
      newErrors.name = 'Porfavor intruduzir nome';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor introduzir nome.');
        alertFlag = true;
      }
    }

    if (!inputs.lastName) {
      newErrors.lastName = 'Porfavor intruduzir sobrenome';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor introduzir sobrenome.');
        alertFlag = true;
      }
    }

    if (!inputs.birthDate) {
      newErrors.birthDate = 'Porfavor intruduzir data de nascimento';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor introduzir data de nascimento.');
        alertFlag = true;
      }
    }

    if (!inputs.address) {
      newErrors.address = 'Porfavor intruduzir endereço';
      valid = false;
      if (!alertFlag){
        Alert.alert('Erro de Registo!', 'Porfavor preencher endereço.');
        alertFlag = true;
      }
    }

    setErrors(newErrors);

    if (valid) {
      registerUser();
    }

    Keyboard.dismiss()
  };

  return (
    <ImageBackground source={require('../assets/Background/background.png')} style={styles.background}>
      <ScrollView style={styles.container}>

        <Text style={styles.title}>Registro de Usuário</Text>

        <TouchableOpacity style={styles.photoContainer} onPress={selectImage}>
          {inputs.photo ? (
            <ImageBackground style={styles.photo} source={{ uri: inputs.photo }} />
          ) : (
            <Text style={styles.addPhotoText}>Adicionar Foto</Text>
          )}
        </TouchableOpacity>

        <InputBox
          placeholder="Nome de utilizador" 
          value={inputs.username}
          onChangeText={(text) => handleOnChange(text, 'username')} />
        <InputBox
          placeholder="Email"
          value={inputs.email}
          onChangeText={(text) => handleOnChange(text, 'email')} />
        <InputBox
          placeholder="Senha"
          secureTextEntry
          value={inputs.password}
          onChangeText={(text) => handleOnChange(text, 'password')} />
        <InputBox
          placeholder="Confirmar Senha"
          secureTextEntry
          value={inputs.confirmpassword}
          onChangeText={(text) => handleOnChange(text, 'confirmpassword')} />
        <InputBox
          placeholder="Nome" 
          value={inputs.name} 
          onChangeText={(text) => handleOnChange(text, 'name')} />
        <InputBox 
          placeholder="Sobrenome" 
          value={inputs.lastName} 
          onChangeText={(text) => handleOnChange(text, 'lastName')} />
        
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>{handleDateToString(birthDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange} />
        )}
        <InputBox 
          placeholder="Morada: Rua" 
          value={inputs.address} 
          onChangeText={(text) => handleOnChange(text, 'address')} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>

      </ScrollView>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  addPhotoText: {
    fontSize: 30,
    color: 'black',
    marginTop: 10,
    fontWeight: 'bold',
  },
  datePickerText: {
    width: '100%',
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'auto',
  }
});

export default RegisterScreen;
