import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase.config';

const AdminMessageScreen = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userMessages, setUserMessages] = useState([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const messagesCollection = collection(firestore, 'messages');
      const messagesSnapshot = await getDocs(messagesCollection);

      const users = [];
      messagesSnapshot.forEach((doc) => {
        const userData = doc.data().username;
        if (!users.includes(userData)) {
          users.push(userData);
        }
      });

      setUserList(users);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const fetchUserMessages = async () => {
    try {
      const messagesCollection = collection(firestore, 'messages');
      const userMessagesQuery = query(
        messagesCollection,
        where('username', '==', selectedUser)
      );
      const userMessagesSnapshot = await getDocs(userMessagesQuery);

      const messages = [];
      userMessagesSnapshot.forEach((doc) => {
        const messageData = doc.data().message;
        messages.push(messageData);
      });

      setUserMessages(messages);
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
    style={[styles.userItem, selectedUser === item && styles.selectedUserItem]}
    onPress={() => {
      setSelectedUser(item);
      fetchUserMessages();
    }}
  >
    <Text style={styles.username}>{item}</Text>
  </TouchableOpacity>
);

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderUserItem}
      />

      {selectedUser ? (
        <View>
          <Text style={styles.selectedUser}>{selectedUser}</Text>
          <FlatList
            data={userMessages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessageItem}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
  },
  selectedUserItem: {
    backgroundColor: 'lightblue',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedUser: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  messageItem: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
  },
});

export default AdminMessageScreen;