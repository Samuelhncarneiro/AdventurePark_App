import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,SafeAreaView } from 'react-native';

const AdminScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
    <View>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('AdminUser')}
      >
        <Text style={styles.itemText}>Users</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('AdminActivityList')}
      >
        <Text style={styles.itemText}>Activities</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('AdminMessageScreen')}
      >
        <Text style={styles.itemText}>Messages</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 30,
    marginVertical: 20,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
    alignSelf:'center',
    fontWeight: 'bold',
  },
});

export default AdminScreen;