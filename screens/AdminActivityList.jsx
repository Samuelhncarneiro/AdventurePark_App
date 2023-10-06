import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore, storage } from '../firebase.config';

const AdminActivityList = ({navigation}) => {
  const [activities, setActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesCollection = collection(firestore, 'activity');
        const activitiesQuery = query(activitiesCollection);
        const snapshot = await getDocs(activitiesQuery);
        const activitiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  const handleDelete = async (activityId, image) => {
    try {
      await deleteDoc(doc(firestore, 'activity', activityId));

      const imageName = image.substring(image.lastIndexOf('/') + 1);
      const storageRef = storage.ref().child(`activityImages/${imageName}`);
      await storageRef.delete();

      setActivities((prevActivities) => prevActivities.filter((activity) => activity.id !== activityId));

      console.log('Activity deleted with ID:', activityId);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleEditActivity = (activityId) => {
    navigation.navigate('AdminActivityEdit', { activityId });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedActivityId === item.id;

    const handlePress = () => {
      setSelectedActivityId(isSelected ? null : item.id);
    };
    return (
      <View style={styles.activityContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleEditActivity(item.id)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.id, item.image)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('AdminActivity')} >
        <Text style={styles.createButtonText} >Create Activity</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'blue',
    width: 350,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor:'orange',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  activityContainer: {
    marginBottom: 16,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf:'center',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },
  button: {
    marginBottom: 10,
    width: 500,
    alignItems: 'center',
    padding:20,
    backgroundColor:'green',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AdminActivityList;