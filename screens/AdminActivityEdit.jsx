import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase.config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const AdminActivityEdit = ({ route, navigation }) => {
  const { activityId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [spots, setSpots] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const activityDoc = doc(firestore, 'activity', activityId);
      const activitySnapshot = await getDoc(activityDoc);
      if (activitySnapshot.exists()) {
        const activityData = activitySnapshot.data();
        setTitle(activityData.title);
        setDescription(activityData.description);
        setAge(activityData.age);
        setWeight(activityData.weight);
        setDate(activityData.date.toDate());
        setHour(activityData.hour.toDate());
        setSpots(activityData.spots);
        setSelectedCategory(activityData.category);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const handleUpdateActivity = async () => {
    try {
      const activityDoc = doc(firestore, 'activity', activityId);
      await updateDoc(activityDoc, {
        title,
        description,
        age,
        weight,
        date,
        hour,
        spots,
        category: selectedCategory,
      });

      console.log('Activity updated successfully.');

      navigation.goBack();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHour(selectedTime);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

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
      <TouchableOpacity style={styles.input} onPress={showDatePickerModal}>
        <Text>{date ? date.toDateString() : 'Select Date'}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Hour:</Text>
      <TouchableOpacity style={styles.input} onPress={showTimePickerModal}>
        <Text>{hour ? hour.toLocaleTimeString() : 'Select Time'}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={hour || new Date()}
          mode="time"
          display="default"
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

      <TouchableOpacity style={styles.button} onPress={handleUpdateActivity}>
        <Text style={styles.buttonText}>Update Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminActivityEdit;