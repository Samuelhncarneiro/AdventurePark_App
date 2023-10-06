import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, addDoc,onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase.config';

const Reserve = ({ route }) => {
  const { activity } = route.params;
  const [activityData, setActivityData] = useState(null);
  const [isReserved, setIsReserved] = useState(false); 
  const [spotsLeft, setSpotsLeft] = useState(0); 

  useEffect(() => {
    fetchActivityData();
    setupRealtimeSpotsUpdate();
  }, []);

  useEffect(() => {
    checkReservationStatus(); 
  }, [activityData]); 
  const fetchActivityData = async () => {
    try {
      const activityDoc = doc(firestore, 'activity', activity);
      const activitySnapshot = await getDoc(activityDoc);
      if (activitySnapshot.exists()) {
        const activityData = activitySnapshot.data();
        setActivityData(activityData);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  };

  const checkReservationStatus = async () => {
    if (activityData) {
      try {
        const reservationQuery = query(
          collection(firestore, 'reservation'),
          where('email', '==', auth.currentUser.email),
          where('title', '==', activityData.title)
        );
        const reservationSnapshot = await getDocs(reservationQuery);

        if (!reservationSnapshot.empty) {
          setIsReserved(true);
        } else {
          setIsReserved(false);
        }
      } catch (error) {
        console.error('Error checking reservation status:', error);
      }
    }
  };

  const setupRealtimeSpotsUpdate = () => {
    const activityDoc = doc(firestore, 'activity', activity);
    onSnapshot(activityDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const currentSpots = docSnapshot.data().spots;
        setSpotsLeft(currentSpots);
      }
    });
  };

  const handleGetSpot = async () => {
    try {
      const reservationCollection = collection(firestore, 'reservation');
      const reservationData = {
        email: auth.currentUser.email,
        title: activityData.title,
      };
      await addDoc(reservationCollection, reservationData);

      const activityDoc = doc(firestore, 'activity', activity);
      const activitySnapshot = await getDoc(activityDoc);
      if (activitySnapshot.exists()) {
        const currentSpots = activitySnapshot.data().spots;
        setSpotsLeft((prevSpotsLeft) => prevSpotsLeft - 1);
        await updateDoc(activityDoc, {currentSpots});
      }

      setIsReserved(true);
      Alert.alert('Reservation added successfully!');
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  };

  const handleCancelReservation = async () => {
    try {
      const reservationQuery = query(
        collection(firestore, 'reservation'),
        where('email', '==', auth.currentUser.email),
        where('title', '==', activityData.title)
      );
      const reservationSnapshot = await getDocs(reservationQuery);

      if (!reservationSnapshot.empty) {
        const reservationDoc = reservationSnapshot.docs[0].ref;
        await deleteDoc(reservationDoc);

        const activityDoc = doc(firestore, 'activity', activity);
        const activitySnapshot = await getDoc(activityDoc);
        if (activitySnapshot.exists()) {
          const currentSpots = activitySnapshot.data().spots;
          setSpotsLeft((prevSpotsLeft) => prevSpotsLeft + 1);
          await updateDoc(activityDoc, {currentSpots});
        }

        setIsReserved(false);
        Alert.alert('Reservation canceled successfully!');
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
    
    }
  };

  const isCancelButtonDisabled = () => {
    if (activityData && activityData.date && activityData.hour) {
      const activityDateTime = new Date(
        activityData.date.toDate().getFullYear(),
        activityData.date.toDate().getMonth(),
        activityData.date.toDate().getDate(),
        activityData.hour.toDate().getHours(),
        activityData.hour.toDate().getMinutes()
      );
      const currentTime = new Date();
      const timeDifference = activityDateTime.getTime() - currentTime.getTime();
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000; 
      return timeDifference <= twentyFourHoursInMs;
    }
    return false; 
  };

  if (!activityData) {
    return (
      <View style={styles.container}>
        <Text>Loading activity data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: activityData.image }} style={styles.mainimage} />
      <Text style={styles.title}>{activityData.title}</Text>

      <Text style={styles.text}>{activityData.description}</Text>

      <Text style={styles.label}>Age Limit:</Text>
      <Text style={styles.text}>{activityData.age}y</Text>

      <Text style={styles.label}>Start Date:</Text>
      <Text style={styles.text}>{activityData.date.toDate().toDateString()}</Text>

      <Text style={styles.label}>At:</Text>
      <Text style={styles.text}>{activityData.hour.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h</Text>

      <Text style={styles.label}>Weight:</Text>
      <Text style={styles.text}>{activityData.weight} Kg</Text>

      <Text style={styles.text}>There are {spotsLeft} spots left. Hurry up!</Text>

      <FlatList
        data={activityData.images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

{isReserved ? (
        <View>
          <Text style={styles.reserved}>Reserved</Text>
          {isCancelButtonDisabled() ? (
            <View style={styles.disabledContainer}>
              <Text style={styles.disabledText}>Cannot cancel activity before 24h</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.cancelButton, isCancelButtonDisabled() && styles.disabledButton]}
              onPress={handleCancelReservation}
              disabled={isCancelButtonDisabled()}
            >
              <Text style={styles.canceltext}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGetSpot}>
          <Text style={styles.buttonText}>Get a spot</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  disabledContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 20,
  },
  disabledText: {
    fontSize: 16,
    color: 'red',
    alignSelf: 'center',
  },
  disabledButton: {
    opacity: 0.5, 
  },
  reserved: {
    paddingVertical: 10,
    fontSize:30,
    fontWeight: 'bold',
    alignSelf: 'center',
    color:'green',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 1,
    marginBottom:20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  canceltext: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 8,
  },
  mainimage: {
    width: 200,
    height: 200,
    marginRight: 8,
    alignSelf: 'center',
    borderRadius: 67,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Reserve;