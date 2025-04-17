import React, { useContext } from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SavedArticlesProvider } from "./screens/SavedArticlesContext";
import { ThemeProvider, ThemeContext } from "./ThemeContext";
import { LightTheme, DarkTheme } from "./screens/themes";
import useColorTheme from "./screens/useColorTheme";

// Import Screens
import SplashScreen from "./screens/Splashscreen";
import SiginScreen from "./screens/Siginscreen";
import SignUpScreen from "./screens/SignUpscreen";
import SiginUsername from "./screens/Siginusername";
import HomePage from "./screens/Homepage";
import FrameScreen from "./screens/Framescreen";
import BookmarksScreen from "./screens/BookmarkDetailScreen";
import NotificationScreen from "./screens/Notificationscreen";
import SearchScreen from "./screens/Searchscreen";
import ProfilPage from "./screens/Profilpage";
import LogOut from "./screens/Logout";
import SavedScreen from "./screens/Savedscreen";
import BookmarkDetailScreen from "./screens/BookmarkDetailScreen";
import AboutScreen from "./screens/Aboutscreen";

// Jangan lupa import CategoryPage kalau belum
import CategoryPage from "./screens/Categorypage"; // <- tambahkan ini kalau belum ada

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Saved") {
            iconName = "bookmark";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme === "dark" ? "#bb86fc" : "blue",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Kategori" component={CategoryPage} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfilPage} />
    </Tab.Navigator>
  );
};

// Main App
const App = () => {
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require("./assets/fonts/Inter_18pt-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <SavedArticlesProvider>
            <NavigationContainer theme={theme}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="SiginScreen" component={SiginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="SiginUsername" component={SiginUsername} />
                <Stack.Screen name="MainTabs" component={TabNavigator} />
                <Stack.Screen name="FrameScreen" component={FrameScreen} />
                <Stack.Screen
                  name="NotificationScreen"
                  component={NotificationScreen}
                />
                <Stack.Screen name="SearchScreen" component={SearchScreen} />
                <Stack.Screen name="SavedScreen" component={HomePage} />
                <Stack.Screen
                  name="BookmarkDetailScreen"
                  component={BookmarkDetailScreen}
                />
                <Stack.Screen name="LogOut" component={LogOut} />
                <Stack.Screen name="AboutScreen" component={AboutScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </SavedArticlesProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
};

export default App;
