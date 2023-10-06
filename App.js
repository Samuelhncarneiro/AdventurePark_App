import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';

import GuestScreen from './screens/GuestScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AdminScreen from './screens/AdminScreen';
import AdminUserScreen from './screens/AdminUserScreen';
import AdminActivityScreen from './screens/AdminActivityScreen';
import AdminMessageScreen from './screens/AdminMessageScreen';
import AdminActivityEdit from './screens/AdminActivityEdit';
import AdminActivityList from './screens/AdminActivityList';
import ProfileScreen from './screens/ProfileScreen';
import PresentationScreen from './screens/PresentationScreen';
import ContactScreen from './screens/ContactScreen';
import LogoutScreen from './screens/LogoutScreen';
import Reserve from './screens/Reserve';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

import { AuthProvider } from './AuthContext'; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {

  return (
    <Stack.Navigator>
        <>
          <Stack.Screen name="Guest" component={GuestScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="AdminUser" component={AdminUserScreen} />
          <Stack.Screen name="AdminActivity" component={AdminActivityScreen} />
          <Stack.Screen name="AdminActivityList" component={AdminActivityList} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
          <Stack.Screen name="AdminActivityEdit" component={AdminActivityEdit} />
          <Stack.Screen name="AdminMessageScreen" component={AdminMessageScreen} />
          <Stack.Screen name="Reserve" component={Reserve} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        </>
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Guest" component={MainStack} options={{ tabBarVisible: false, headerShown: false }} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Presentation" component={PresentationScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </AuthProvider>
  );
}
