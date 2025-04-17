import React, { useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "../ThemeContext";

// Import halaman
import NewsPage from "./Newspage";
import SavedScreen from "./Savedscreen";
import ProfilPage from "./Profilpage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Header Logo
const CustomHeader = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <Image source={require("../assets/logo.png")} style={styles.logo} />
    </View>
  );
};

// Stack Screens
const NewsStack = () => (
  <Stack.Navigator screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
    <Stack.Screen
      name="NewsScreen"
      component={NewsPage}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const BookmarksStack = () => (
  <Stack.Navigator screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
    <Stack.Screen
      name="BookmarksScreen"
      component={SavedScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfilPage}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Tab Navigation
const MyTabs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <CustomHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;
            let iconColor = focused ? theme.colors.primary : theme.colors.text;

            if (route.name === "News") {
              iconName = focused
                ? "newspaper-variant"
                : "newspaper-variant-outline";
            } else if (route.name === "Bookmarks") {
              iconName = focused ? "bookmark" : "bookmark-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "account-circle" : "account-circle-outline";
            }

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={focused ? 34 : 30}
                color={iconColor}
              />
            );
          },
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            paddingVertical: 4,
            height: 60,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 5,
            elevation: 5,
          },
          headerShown: false,
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="News" component={NewsStack} />
        <Tab.Screen name="Bookmarks" component={BookmarksStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </View>
  );
};

export default MyTabs;

// Styles
const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: "contain",
    top: 10,
  },
});
