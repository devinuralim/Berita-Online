import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Dimensions } from "react-native";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  // Animated values
  const ellipseScale = useRef(new Animated.Value(0.7)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(height * 0.7)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const addScale = useRef(new Animated.Value(0.7)).current;
  const addTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ellipseScale, {
        toValue: 3,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.timing(textTranslateY, {
        toValue: height * 0.52,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(addScale, {
        toValue: 0.9,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(addTranslateY, {
        toValue: -height * 0.03,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace("SiginScreen"); // Ganti layar ke SignIn setelah animasi selesai
    });
  }, []);

  // Background color animation interpolation
  const backgroundColorInterpolated = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#1E3A8A"], // Warna awal dan akhir
  });

  return (
    <Animated.View
      style={[
        styles.splashScreen,
        { backgroundColor: backgroundColorInterpolated },
      ]}
    >
      {/* Ellipse animation */}
      <Animated.View
        style={[
          styles.ellipseContainer,
          { transform: [{ scale: ellipseScale }] },
        ]}
      >
        <Image
          style={styles.ellipseImage}
          contentFit="contain"
          source={require("../assets/ellipse-1.png")}
        />
      </Animated.View>
      
      {/* Center image animation */}
      <Animated.Image
        style={[
          styles.centerImage,
          {
            transform: [
              { scale: addScale },
              { translateY: addTranslateY },
            ],
          },
        ]}
        contentFit="contain"
        source={require("../assets/add-a-subheading-2-1.png")}
      />
      
      {/* Text animation */}
      <Animated.Text
        style={[
          styles.welcomeText,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        Selamat Datang
      </Animated.Text>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  splashScreen: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  ellipseContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  ellipseImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  centerImage: {
    position: "absolute",
    width: "80%",
    height: "20%",
    alignSelf: "center",
    top: height * 0.35,
  },
  welcomeText: {
    position: "absolute",
    fontSize: width * 0.05,
    fontWeight: "300",
    color: "#FFFFFF",
    textAlign: "center",
    alignSelf: "center",
  },
});
