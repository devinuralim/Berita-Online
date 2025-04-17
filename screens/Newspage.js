import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../ThemeContext";
import useColorTheme from "./useColorTheme";

const API_KEY = "9539f36c7ab34f248d22417b01c8dc17";
const NEWS_API_URL = "https://newsapi.org/v2";
const NEWS_COUNTRY = "us";

const categories = ["Semua", "Edukasi", "Teknologi", "Keuangan", "Kesehatan"];

const NewsPage = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);

  const fetchNews = async (search = null) => {
    if (!isConnected) {
      setError("No internet connection.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let query =
      search || (selectedCategory !== "Semua" ? selectedCategory : null);
    let url = `${NEWS_API_URL}/top-headlines?country=${NEWS_COUNTRY}&apiKey=${API_KEY}`;
    if (query) {
      url = `${NEWS_API_URL}/everything?q=${encodeURIComponent(
        query
      )}&apiKey=${API_KEY}`;
    }

    try {
      const response = await axios.get(url);
      if (response.data?.status === "ok" && response.data?.articles) {
        setNews(response.data.articles);
        setFeaturedNews(response.data.articles.slice(0, 3)); // Featured news as top 3 articles
      } else {
        setNews([]);
        setError("No news found.");
      }
    } catch (err) {
      setError("Failed to fetch news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.newsItem,
        theme === "dark" ? styles.darkModeItem : styles.lightModeItem,
      ]} // Apply dynamic styles based on theme
      onPress={() => navigation.navigate("FrameScreen", { article: item })}
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
      )}
      <View style={styles.newsContent}>
        <Text style={[styles.newsTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.newsSource, { color: theme.colors.text }]}>
          {item.source?.name || "Unknown Source"}
        </Text>
        <Text style={[styles.newsDate, { color: theme.colors.text }]}>
          {item.publishedAt?.slice(0, 10)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTabs = () => (
    <FlatList
      data={categories}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryTabs}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.categoryTab,
            selectedCategory === item && styles.activeCategoryTab,
          ]}
          onPress={() => {
            setSelectedCategory(item);
            fetchNews(item !== "Semua" ? item : null);
          }}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === item && styles.activeCategoryText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const renderFeaturedNews = () => (
    <FlatList
      data={featuredNews}
      horizontal={true} // Make the featured news scrollable horizontally
      pagingEnabled={true} // Enable smooth paging (carousel-like)
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.featuredNewsList}
      renderItem={renderFeaturedNewsItem}
      keyExtractor={(item, index) => item.url || index.toString()}
    />
  );

  const renderFeaturedNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredNewsItem}
      onPress={() => navigation.navigate("FrameScreen", { article: item })}
    >
      {item.urlToImage && (
        <View style={styles.featuredNewsImageContainer}>
          <Image
            source={{ uri: item.urlToImage }}
            style={styles.featuredNewsImage}
          />
          <Text style={styles.featuredNewsTitle}>{item.title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderNewsList = () => (
    <FlatList
      data={news}
      renderItem={renderNewsItem}
      keyExtractor={(item, index) => item.url || index.toString()}
      ListEmptyComponent={<Text style={styles.emptyList}>No news found.</Text>}
    />
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    if (isConnected) {
      fetchNews(); // Initial fetch when the app is loaded
    }

    return () => unsubscribe();
  }, [isConnected]);

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color="#002E8C" />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading news...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.header }]}>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.icon} // Mengganti warna icon sesuai tema
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchBar, { color: theme.colors.text }]} // Warna teks input
            placeholder="Search for news"
            placeholderTextColor={theme.colors.placeholder} // Ganti warna placeholder
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchNews(searchQuery)}
          />
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => navigation?.navigate("NotificationScreen")}
        >
          <Ionicons
            name="notifications-outline"
            size={26}
            color={theme.colors.icon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainScrollContainer}>
        {/* Featured News - Scrollable */}
        {renderFeaturedNews()}

        {/* Category tabs - Scrollable */}
        {renderCategoryTabs()}

        {/* Regular News List */}
        {renderNewsList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  categoryTabs: {
    flexDirection: "row",
    marginTop: 10, // Lebih banyak ruang antara kategori dan berita
    marginBottom: 15, // Menambahkan lebih banyak ruang bawah
  },

  categoryTabsContainer: {
    paddingTop: 10, // Menambahkan padding agar lebih rapi
    paddingHorizontal: 15,
    paddingLeft: 20,
  },

  categoryTab: {
    paddingVertical: 10, // Peningkatan ruang vertikal di tab kategori
    paddingHorizontal: 15, // Ruang horizontal untuk keseimbangan
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10, // Membuat sudut lebih bulat
    marginRight: 10, // Jarak antar tab lebih besar
    backgroundColor: "#f0f0f0", // Default background untuk kategori yang tidak aktif
  },

  activeCategoryTab: {
    backgroundColor: "#002E8C", // Warna aktif
  },

  categoryText: {
    fontSize: 14,
    color: "#000", // Default text color is black
    fontWeight: "500",
    borderColor: "#ddd",
  },

  activeCategoryText: {
    color: "#fff", // Teks putih saat kategori aktif
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#f9f9f9",
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingLeft: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    maxWidth: 325, // Set a max width to prevent it from stretching too far
    width: "90%", // This makes the container take up 90% of the screen width, but not more
  },

  searchIcon: {
    marginRight: 10,
  },

  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },

  featuredNewsContainer: {
    marginTop: 0,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  featuredNewsItem: {
    marginRight: 10, // Jarak antar item lebih besar
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  featuredNewsList: {
    marginTop: 10,
    paddingLeft: 10,
  },

  newsItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },

  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    marginLeft: 10,
  },

  newsContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  newsSource: {
    fontSize: 12,
    color: "#777",
  },

  newsDate: {
    fontSize: 12,
    color: "#999",
  },

  emptyList: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },

  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  notificationIcon: {
    padding: 10,
    backgroundColor: "#f4f4f4", // White background for notification icon
    borderRadius: 50, // Circular icon
    elevation: 3, // Light shadow for notification icon
    shadowColor: "#1E88E5", // Blue shadow for the notification icon
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    position: "absolute", // Absolute positioning to allow shifting freely
    right: 10, // Adjusts the icon’s position from the right side
    top: 5, // Optionally adjust top position if necessary
  },

  mainScrollContainer: {
    paddingTop: 10,
  },

  featuredNewsImageContainer: {
    position: "relative",
    width: 350,
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },

  featuredNewsImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  featuredNewsTitle: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12, // Ukuran teks lebih kecil
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Background hitam transparan
    padding: 5,
  },

  darkMode: {
    newsTitle: {
      color: "#fff", // Warna teks putih di dark mode
    },
    newsSource: {
      color: "#ddd", // Warna sumber berita di dark mode
    },
    newsDate: {
      color: "#ccc", // Warna tanggal berita di dark mode
    },
  },
});

export default NewsPage;
