import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebase.config';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { SearchBar } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [activityTitles, setActivityTitles] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchActivities();
    fetchUserData();
    setupReservationListener();
    setupWishlistListener();
  }, [selectedFilter]);

  const handleWishlist = (activityId) => {
    const isWishlisted = wishlist.includes(activityId);
    if (isWishlisted) {
      const updatedWishlist = wishlist.filter((id) => id !== activityId);
      setWishlist(updatedWishlist);
    } else {
      setWishlist([...wishlist, activityId]);
    }
  };

  const fetchActivities = async () => {
    try {
      const activityCollection = collection(firestore, 'activity');
      let activityQuery = query(activityCollection);
      
      if (selectedFilter) {
        activityQuery = query(activityCollection, where('category', '==', selectedFilter));
      }

      const activitySnapshot = await getDocs(activityQuery);
      const activityList = [];
      const titleList = [];

      activitySnapshot.forEach((doc) => {
        const activityData = doc.data();
        const activityItem = {
          id: doc.id,
          title: activityData.title,
          image: activityData.image,
          date: activityData.date.toDate().toDateString(),
          time: activityData.hour.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          spots: activityData.spots,
        };
        activityList.push(activityItem);
        titleList.push(activityData.title);
      });

      setActivities(activityList);
      setActivityTitles(titleList);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', auth.currentUser.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleReserveNow = (activity) => {
    const isReserved = reservations.some(
      (reservation) =>
        reservation.activity === activity
    );
    navigation.navigate('Reserve', {activity});
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleSearch = () => {
    const searchTerm = searchText.trim().toLowerCase();

    if (searchTerm === '') {
      setActivities(activityList);
    } else {
      const filtered = activities.filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
      );
      setActivities(filtered);
    }
  };

const setupReservationListener = () => {
  const reservationsCollection = collection(firestore, 'reservation');
  const reservationsQuery = query(reservationsCollection, where('email', '==', auth.currentUser.email));

  const unsubscribe = onSnapshot(reservationsQuery, (snapshot) => {
    const reservationsList = [];

    snapshot.forEach((doc) => {
      const reservationData = doc.data();
      const reservationItem = {
        id: doc.id,
        title: reservationData.title,
      };
      reservationsList.push(reservationItem);
    });

    setReservations(reservationsList);
  });

  return unsubscribe;
};
const setupWishlistListener = () => {
  const wishlistCollection = collection(firestore, 'wishlist');
  const wishlistQuery = query(wishlistCollection, where('email', '==', auth.currentUser.email));

  const unsubscribe = onSnapshot(wishlistQuery, (snapshot) => {
    const wishlistItems = [];

    snapshot.forEach((doc) => {
      const wishlistData = doc.data();
      const wishlistItem = {
        id: doc.id,
        title: wishlistData.title,
      };
      wishlistItems.push(wishlistItem);
    });

    setWishlist(wishlistItems);
  });

  return unsubscribe;
};

  const renderActivityItem = ({ item }) => {
    const isReserved = reservations.some(
      (reservation) =>
        reservation.title === item.title
    );
  
    const isWishlisted = wishlist.includes(item.id); // Check if the activity is wishlisted
  
    const buttonText = isReserved ? "Reserved" : "Reserve Now";
    const buttonBackgroundColor = isReserved ? "green" : "white";
    const wishlistButtonTitle = isWishlisted ? "Remove from Wishlist" : "Add to Wishlist";
    const wishlistButtonColor = isWishlisted ? "red" : "blue";

  
    return (
      <View style={styles.activityItemContainer}>
        <ImageBackground
          source={require("../assets/Background/background3.png")}
          style={styles.activityBackground}
        >
          <Image source={{ uri: item.image }} style={styles.activityImage} />
          <View style={styles.activityDetailsContainer}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDate}>{item.date}</Text>
            <Text style={styles.activityTime}>{item.time}</Text>
            <Text style={styles.activitySpots}>Spots: {item.spots}</Text>
          </View>
          <TouchableOpacity
            style={[styles.reserveButton, { backgroundColor: buttonBackgroundColor }]}
            onPress={() => handleReserveNow(item.id)}
          >
            <Text style={styles.reserveButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </ImageBackground>
  
        {/* Wishlist button */}
        <TouchableOpacity
          style={[styles.wishlistButton, { backgroundColor: wishlistButtonColor }]}
          onPress={() => handleWishlist(item.id)}
        >
          <Text style={styles.wishlistButtonText}>{wishlistButtonTitle}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../assets/Background/background1.png')} style={styles.background}>
      <View style={styles.container}>
        {user && (
          <View style={styles.userContainer}>
            {user && (
              <View style={styles.loginImageContainer}>
                <Image source={{ uri: user.photo }} style={styles.loginImage} />
              </View>
            )}
            <Text style={styles.welcomeText}>Hello, {user.name}</Text>
            <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
              <Text style={styles.profileButtonText}>Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={selectedFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedFilter(itemValue)}
          >
            <Picker.Item label="All" value={null} />
            <Picker.Item label="Radical" value="Radical" />
            <Picker.Item label="Family" value="Family" />
            <Picker.Item label="Aquatic" value="Aquatic" />
            <Picker.Item label="Air" value="Air" />
          </Picker>
        </View>
        <SearchBar
          placeholder="Search"
          onChangeText={setSearchText}
          value={searchText}
          onSubmitEditing={handleSearch}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          placeholderTextColor="gray"
          data={activityTitles}
        />
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderActivityItem}
          contentContainerStyle={styles.activityList}
        />
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
    padding: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginImage: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  filterContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  searchBarInputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 40,
  },
  searchBarInput: {
    fontSize: 16,
    color: 'black',
  },
  activityList: {
    paddingBottom: 16,
  },
  activityItemContainer: {
    marginBottom: 16,
  },
  activityBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  activityImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  activityDetailsContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  activityDate: {
    fontSize: 16,
    marginBottom: 2,
    color: 'white',
  },
  activityTime: {
    fontSize: 16,
    marginBottom: 2,
    color: 'white',
  },
  activitySpots: {
    fontSize: 16,
    color: 'white',
  },
  reserveButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 100,
  },
  profileButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wishlistButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  wishlistButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
