import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from '../firebase.config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const AdminActivityScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hour, setHour] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [spots, setSpots] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Radical');

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Permission to access camera roll is required!');
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!pickerResult.cancelled) {
        setImage(pickerResult.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleMultiImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Permission to access camera roll is required!');
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
      });

      if (!pickerResult.cancelled) {
        setImages(pickerResult.assets.map((asset) => asset.uri));
      }
    } catch (error) {
      console.error('Error picking images:', error);
    }
  };

  const handleSaveActivity = async () => {
    try {
      const activityData = {
        title,
        description,
        age,
        weight,
        date,
        hour,
        image,
        images,
        spots,
        category: selectedCategory,
      };

      const docRef = await addDoc(collection(firestore, 'activity'), activityData);

      const imageUri = image;
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageName = `${docRef.id}.jpg`;
        const storageRef = storage.ref().child(`activityImages/${imageName}`);
        await storageRef.put(blob);
        const imageUrl = await storageRef.getDownloadURL();

        await docRef.update({ image: imageUrl });
      }

      const imagePromises = images.map(async (imagesUri, index) => {
        const response = await fetch(imagesUri);
        const blob = await response.blob();
        const imagesName = `${docRef.id}_${index}.jpg`;
        const storageRef = storage.ref().child(`activityImages/${imagesName}`);
        await storageRef.put(blob);
        const imagesUrl = await storageRef.getDownloadURL();

        await addDoc(collection(firestore, `activity/${docRef.id}/images`), { imagesUrl });
      });

      await Promise.all(imagePromises);

      console.log('Activity saved with ID:', docRef.id);

      setTitle('');
      setDescription('');
      setAge('');
      setWeight('');
      setDate(new Date());
      setHour(new Date());
      setImage(null);
      setImages([]);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
    navigation.navigate('Admin')
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    setDate(currentDate);
    console.log(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || hour;
    setShowTimePicker(false);
    setHour(currentTime);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
        <Text style={styles.buttonText}>Select Main Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Text style={styles.label}>Title:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Weight:</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Date:</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Hour:</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text>{hour.toString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={hour}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

    <Text style={styles.label}>Spots:</Text>
      <TextInput
        style={styles.input}
        value={spots}
        onChangeText={setSpots}
        keyboardType="numeric"
      />
    <Text style={styles.label}>Category:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Radical" value="Radical" />
        <Picker.Item label="Air" value="Air" />
        <Picker.Item label="Aquatic" value="Aquatic" />
        <Picker.Item label="Family" value="Family" />
      </Picker>

      {images.map((imageUri, index) => (
        <Image key={index} source={{ uri: imageUri }} style={styles.image} />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleMultiImagePicker}>
        <Text style={styles.buttonText}>Select Activity Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSaveActivity}>
        <Text style={styles.buttonText}>Save Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});

export default AdminActivityScreen;