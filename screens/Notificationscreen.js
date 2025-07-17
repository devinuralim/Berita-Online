import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useTheme } from "@react-navigation/native";

const API_KEY = "9539f36c7ab34f248d22417b01c8dc17";
const NEWS_API_URL = "https://newsapi.org/v2";
const NEWS_COUNTRY = "us";

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme(); // ambil warna tema

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${NEWS_API_URL}/top-headlines?country=${NEWS_COUNTRY}&apiKey=${API_KEY}`
        );
        const data = await response.json();

        if (data.status === "ok") {
          const formattedNotifications = data.articles.map(
            (article, index) => ({
              id: (index + 1).toString(),
              title: article.title,
              description: article.description || "No description available.",
              image: article.urlToImage || "https://via.placeholder.com/300",
              url: article.url,
              source: article.source.name || "Unknown",
              time: formatTime(article.publishedAt),
            })
          );
          setNotifications(formattedNotifications);
        } else {
          console.error("Error fetching news:", data.message);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatTime = (publishedAt) => {
    const now = moment();
    const publishedTime = moment(publishedAt);
    const diffMinutes = now.diff(publishedTime, "minutes");
    const diffHours = now.diff(publishedTime, "hours");
    const diffDays = now.diff(publishedTime, "days");

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return publishedTime.format("MMMM D, YYYY");
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("FrameScreen", { article: item })}
      style={[styles.notificationItem, { backgroundColor: colors.card }]}
    >
      <Image source={{ uri: item.image }} style={styles.notificationImage} />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${item.source}&background=random`,
            }}
            style={styles.avatar}
          />
          <Text style={[styles.source, { color: colors.text }]}>
            {item.source}
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.text} />
          <Text style={[styles.timeText, { color: colors.text }]}>
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Fetching notifications...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002E8C",
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    elevation: 6,
  },
  backButton: {
    padding: 6,
    top: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 16,
    top: 10,
  },
  listContainer: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  source: {
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default NotificationScreen;
