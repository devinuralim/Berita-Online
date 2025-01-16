import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import komponen layar Anda
import NewsPage from './Newspage';
import SavedScreen from './Savedscreen';
import ProfilPage from './Profilpage';

// Definisikan Tab Navigator di luar komponen
const Tab = createBottomTabNavigator();

// Komponen ikon tab
const TabBarIcon = ({ route, focused, color, size }) => {
  let iconName;

  // Tentukan ikon berdasarkan nama route/tab
  if (route.name === 'News') {
    iconName = focused ? 'newspaper' : 'newspaper-outline';
  } else if (route.name === 'Bookmarks') {
    iconName = focused ? 'bookmark' : 'bookmark-outline';
  } else if (route.name === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

// Tab Navigator
const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon route={route} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#002E8C',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          padding: 10,
        },
      })}
    >
      <Tab.Screen name="News" component={NewsPage} />
      <Tab.Screen name="Bookmarks" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfilPage} />
    </Tab.Navigator>
  );
};

export default MyTabs;

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});
