import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase.config';

const AdminUserScreen = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const userCollection = collection(firestore, 'users');
      const userSnapshot = await getDocs(userCollection);

      const users = [];
      userSnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push(userData);
      });

      setUserList(users);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const showUserProfile = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => showUserProfile(item)}
    >
      <Image source={{ uri: item.photo }} style={styles.userPhoto} />
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userList}
        keyExtractor={(item) => item.userId}
        renderItem={renderUserItem}
      />

      {selectedUser && (
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.text}>{selectedUser.name}</Text>

              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.text}>{selectedUser.lastName}</Text>

              <Text style={styles.label}>Email:</Text>
              <Text style={styles.text}>{selectedUser.email}</Text>


              <Text style={styles.label}>Address:</Text>
              <Text style={styles.text}>{selectedUser.address}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  profileInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default AdminUserScreen;