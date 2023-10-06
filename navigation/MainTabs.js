import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import PresentationScreen from './screens/PresentationScreen';
import ContactScreen from './screens/ContactScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Contact" component={ContactScreen} />
        <Tab.Screen name="Presentation" component={PresentationScreen} />
      </Tab.Navigator>
    );
  };

export default MainTabs;