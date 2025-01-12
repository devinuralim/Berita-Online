import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';

const API_KEY = "9539f36c7ab34f248d22417b01c8dc17";
const NEWS_API_URL = "https://newsapi.org/v2";
const NEWS_COUNTRY = "us";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data berita dari News API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${NEWS_API_URL}/top-headlines?country=${NEWS_COUNTRY}&apiKey=${API_KEY}`);
        const data = await response.json();

        // Pastikan data berhasil diterima sebelum menyetelnya ke state
        if (data.status === "ok") {
          const formattedNotifications = data.articles.map((article, index) => ({
            id: (index + 1).toString(),
            title: article.title,
            description: article.description || "No description available.",
            image: article.urlToImage || 'https://via.placeholder.com/60', // Gunakan placeholder jika tidak ada gambar
          }));
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

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Image source={{ uri: item.image }} style={styles.notificationImage} />
      <View style={styles.notificationText}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading news...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  notificationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#777',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationScreen;
