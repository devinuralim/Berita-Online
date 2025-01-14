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
  Modal,
  ScrollView,
  RefreshControl,
  alert,
} from "react-native";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedArticlesContext } from './SavedArticlesContext';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const API_KEY = "9539f36c7ab34f248d22417b01c8dc17";
const NEWS_API_URL = "https://newsapi.org/v2";
const NEWS_COUNTRY = "us";

const Tab = createBottomTabNavigator();
const categories = ["Semua", "Edukasi", "Teknologi", "Keuangan", "Kesehatan"];


// News Screen
const NewsScreen = ({navigation}) => {
  const { saveArticle } = useContext(SavedArticlesContext);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [news, setNews] = React.useState([
    {
      "source": {
        "id": "reuters",
        "name": "Reuters"
      },
      "author": null,
      "title": "Australia's Pyne to head defence after shock ministerial exit - Reuters",
      "description": "Australia's Christopher Pyne will become the country's new defence minister after the shock resignation of Marise Payne, Prime Minister Malcolm Turnbull said on Sunday.",
      "url": "https://www.reuters.com/article/us-australia-politics-defence-idUSKCN1M602S",
      "urlToImage": "https://s4.reutersmedia.net/resources/r/?m=02&d=20181028&t=2&i=1322728487&w=1200&r=LYNXNPEEAQ023",
      "publishedAt": "2018-10-28T03:00:11Z",
      "content": "SYDNEY (Reuters) - Australia’s Christopher Pyne will become the country’s new defence minister after the shock resignation of Marise Payne, Prime Minister Malcolm Turnbull said on Sunday.\r\nPayne, who also served as foreign minister, resigned from parliam… [+118 chars]"
    },
    // ... data berita lainnya
  ]);

  //category
  const renderCategoryTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryTab,
            selectedCategory === category && styles.activeCategoryTab,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.activeCategoryText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  const renderFeaturedNews = () => {
    const featuredArticle = news[0]; // Assuming the first article is featured
    return (
      <TouchableOpacity
        style={styles.featuredNewsContainer}
        onPress={() => navigation.navigate("FrameScreen", { article: featuredArticle })}
      >
        <Image
          source={{ uri: featuredArticle.urlToImage }}
          style={styles.featuredNewsImage}
        />
        <View style={styles.featuredNewsOverlay}>
          <Text style={styles.featuredNewsTitle}>{featuredArticle.title}</Text>
          <Text style={styles.featuredNewsSource}>{featuredArticle.source.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNewsList = () => (
    <FlatList
      data={news.slice(1)} // Skip the first article as it's featured
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.newsItem}
          onPress={() => navigation.navigate("FrameScreen", { article: item })}
        >
          <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSource}>{item.source.name}</Text>
            <Text style={styles.newsDate}>{item.publishedAt.slice(0, 10)}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<Text style={styles.emptyList}>No news found.</Text>}
    />
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      console.log("Navigation prop:", navigation); 
    });

    if (isConnected) {
      fetchNews();
      loadSavedArticles();
    }

    return () => unsubscribe();
  }, [isConnected, selectedCategory]);

  const loadSavedArticles = async () => {
    try {
      const savedArticlesData = await AsyncStorage.getItem('savedArticles');
      if (savedArticlesData) {
        setSavedArticles(JSON.parse(savedArticlesData));
      }
    } catch (error) {
      console.error('Error loading saved articles:', error);
    }
  };

  const fetchNews = async (search = null) => {
    if (!isConnected) {
      setError("No internet connection.");
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    let url = `${NEWS_API_URL}/top-headlines?country=${NEWS_COUNTRY}&apiKey=${API_KEY}`;
    if (search) {
      url = `${NEWS_API_URL}/everything?q=${search}&apiKey=${API_KEY}`;
    }
  
    try {
      const response = await axios.get(url);
      if (response.data?.status === "ok" && response.data?.articles) {
        const newArticles = response.data.articles;
        
        // Filter out duplicate articles based on URL
        const uniqueArticles = newArticles.filter((article) => 
          !news.some((existingArticle) => existingArticle.url === article.url)
        );
  
        // Update the state with unique articles
        setNews((prevNews) => [...prevNews, ...uniqueArticles]);
      } else {
        setError(response.data?.message || "Failed to fetch news from API.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  const isArticleSaved = (article) => {
    return savedArticles.some((savedArticle) => savedArticle.url === article.url);
  };

  const saveArticleToBookmark = async (article) => {
    try {
      const savedArticlesData = await AsyncStorage.getItem('savedArticles');
      let articles = savedArticlesData ? JSON.parse(savedArticlesData) : [];

      if (!articles.some((savedArticle) => savedArticle.url === article.url)) {
        articles.push(article);
        await AsyncStorage.setItem('savedArticles', JSON.stringify(articles));
        setSavedArticles(articles); // Update saved articles state
        alert("Article saved to bookmarks!");
      } else {
        alert("This article is already bookmarked.");
      }
    } catch (error) {
      console.error("Error saving article to bookmarks", error);
    }
  };

  const renderNewsItem = ({ item }) => (
     <TouchableOpacity
     style={styles.newsItem}
    onPress={() => navigation.navigate('FrameScreen', { article: item })}
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsSource}>
          {item.source?.name || "Unknown Source"}
        </Text>
        <Text style={styles.newsDate}>{item.publishedAt?.slice(0, 10)}</Text>
      </View>
      {/* Tombol bookmark */}
      <TouchableOpacity onPress={() => saveArticleToBookmark(item)}>
        <Ionicons name="bookmark-outline" size={24} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002E8C" />
        <Text>Loading news...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for news"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchNews(searchQuery)}
          />
          <TouchableOpacity
            onPress={() => fetchNews(searchQuery)}
            style={styles.searchIconContainer}
          >
            <Ionicons name="search" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => {
            console.log("Navigation:", navigation); // PENTING: di dalam onPress
            if (navigation) { // Pengecekan penting
              navigation.navigate('NotificationScreen');
            } else {
              console.warn("Navigation is undefined!"); // Untuk debugging
            }
          }}
        >
          <Ionicons name="notifications-outline" size={26} color="#FBBC05" />
        </TouchableOpacity>
        
      </View>
  <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item, index) => item.url || index.toString()}
        ListEmptyComponent={<Text style={styles.emptyList}>No news found.</Text>}
        ListHeaderComponent={renderFeaturedNews} // Render di atas daftar
        ListFooterComponent={() => ( // Render di bawah daftar
          <>
            {renderFeaturedNews()}
            {renderCategoryTabs()}
            {renderNewsList()}
          </>
        )}
      />
    </SafeAreaView>
  );
};

//frame screen
const Framescreen = ({ route, navigation }) => {
  const { article } = route.params;

  useEffect(() => {
    // Menambahkan tombol kembali di header
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const saveToBookmark = async () => {
    try {
      await saveArticleToBookmark(article);
    } catch (error) {
      console.error("Error saving article to bookmarks:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.source}>{article.source.name}</Text>
        <Text style={styles.description}>{article.description}</Text>
        <Text style={styles.contentDetail}>{article.content}</Text>
        <Text style={styles.date}>{article.publishedAt.slice(0, 10)}</Text>
        <TouchableOpacity onPress={saveToBookmark} style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="gray" />
          <Text>Save to Bookmark</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const saveArticleToBookmark = async (article) => {
  try {
    const savedArticles = await AsyncStorage.getItem('savedArticles');
    let articles = savedArticles ? JSON.parse(savedArticles) : [];

    // Pastikan artikel belum ada dalam daftar bookmark
    if (!articles.some((savedArticle) => savedArticle.url === article.url)) {
      articles.push(article);
      await AsyncStorage.setItem('savedArticles', JSON.stringify(articles));
      setSavedArticles(articles);
      alert("Article saved to bookmarks!");
    } else {
      alert("This article is already bookmarked.");
    }
  } catch (error) {
    console.error("Error saving article to bookmarks", error);
  }
};
const loadBookmarks = async () => {
  try {
    const savedArticlesData = await AsyncStorage.getItem('savedArticles');
    const articles = savedArticlesData ? JSON.parse(savedArticlesData) : [];
    setSavedArticles(articles); // Perbarui state
  } catch (error) {
    console.error("Error loading bookmarks", error);
  }
};


//saved
const DEFAULT_IMAGE = 'https://via.placeholder.com/150'; // URL gambar default

const SavedScreen = ({ navigation }) => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSavedArticles = async () => {
    try {
      const savedArticlesData = await AsyncStorage.getItem('savedArticles');
      if (savedArticlesData) {
        const parsedArticles = JSON.parse(savedArticlesData);
        setSavedArticles(parsedArticles);
      } else {
        setSavedArticles([]);
      }
    } catch (error) {
      console.error('Error memuat artikel yang disimpan:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedArticles();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadSavedArticles();
    setIsRefreshing(false);
  };

  const unsaveArticle = async (articleToRemove) => {
    const updatedArticles = savedArticles.filter(
      (article) => article.url !== articleToRemove.url
    );
    setSavedArticles(updatedArticles);
    try {
      await AsyncStorage.setItem(
        'savedArticles',
        JSON.stringify(updatedArticles)
      );
    } catch (error) {
      console.error('Error menghapus artikel yang disimpan:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.savedContentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {savedArticles.length === 0 ? (
          <Text style={styles.noSavedArticles}>Belum ada artikel yang disimpan.</Text>
        ) : (
          savedArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              onPress={() =>
                navigation.navigate('BookmarkDetailScreen', { article })
              }
            >
              <View style={styles.savedArticleItem}>
                {/* Menampilkan Gambar Artikel */}
                <Image
                  source={{
                    uri: article.image ? article.image : DEFAULT_IMAGE, // Check the image URL
                  }}
                  style={styles.articleImage}
                  resizeMode="cover"
                />

                {/* Informasi Artikel */}
                <View style={styles.articleInfo}>
                  <Text style={styles.savedArticleTitle}>{article.title}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Hapus Artikel',
                        'Apakah Anda yakin ingin menghapus artikel ini?',
                        [
                          { text: 'Batal', style: 'cancel' },
                          {
                            text: 'Hapus',
                            onPress: () => unsaveArticle(article),
                          },
                        ],
                        { cancelable: true }
                      );
                    }}
                  >
                    <Ionicons name="bookmark" size={24} color="#002E8C" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Profile Screen
const ProfileScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = (section) => {
    if (section === "Keluar") {
      setModalVisible(true);
    } else if (section === "About") {
      navigation.navigate('AboutScreen');
    } else {
      Alert.alert(`Anda menekan ${section}`);
    }
  };

  const confirmLogout = () => {
    setModalVisible(false);
    navigation.replace('SiginScreen');
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Kartu Profil */}
        <View style={styles.profileCard}>
          <Image
            source={require("../assets/Vector.png")}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.username}>InfinityTeam</Text>
            <Text style={styles.userEmail}>infinityteam@gmail.com</Text>
          </View>
        </View>

        {/* Opsi Menu */}
        <View style={styles.optionsContainer}>
          {[
            { name: "Kelola Akun", icon: "settings-outline" },
            { name: "Saran dan Masukan", icon: "chatbubble-ellipses-outline" },
            { name: "Tentang Ponsel", icon: "phone-portrait-outline" },
            { name: "Hubungi Kami", icon: "call-outline" },
            { name: "About", icon: "information-circle-outline" },
            { name: "Keluar", icon: "log-out-outline", color: "red" },
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, option.name === "Keluar" && styles.lastOption]}
              onPress={() => handlePress(option.name)}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={option.color || "#fff"}
              />
              <Text
                style={[
                  styles.optionText,
                  option.name === "Keluar" && { color: "red" },
                ]}
              >
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modal Konfirmasi */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Konfirmasi Keluar</Text>
            <Text style={styles.modalText}>Apakah Anda yakin ingin keluar?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.buttonText}>Ya</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelLogout}
              >
                <Text style={styles.buttonText}>Tidak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <Text style={styles.footer}>NEWSLY | InfinityTeam | ARSUNIVERSITY</Text>
    </SafeAreaView>
  );
};

// Main HomePage Component with Tab Navigator
const HomePage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "News") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } else if (route.name === "Bookmarks") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Bookmarks" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    
  );
};


const styles = StyleSheet.create({
  // General Styles
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Header Styles
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',  // White background for the header
    elevation: 4,
  },

  // Search Container Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',  // White background for the search container
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
    flex: 1,
    borderWidth: 2,            // Adding border to make it look neat
    borderColor: '#002E8C',    // Blue border color for the search bar
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  // Search Bar Styles
  searchBar: {
    flex: 1,
    fontSize: 15,
    paddingLeft: 10,          // Padding to make the text not touch the edges
    color: '#002E8C',            // Slightly darker text for better readability
  },

  // Search Icon Container Styles
  searchIconContainer: {
    paddingLeft: 10,
  },

  // Notification Icon Styles
  notificationIcon: {
    padding: 10,
    backgroundColor: '#f4f4f4',  // White background for notification icon
    borderRadius: 50,         // Circular icon
    elevation: 3,             // Light shadow for notification icon
    shadowColor: '#1E88E5',   // Blue shadow for the notification icon
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  // Category Tabs
  categoryTabs: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  categoryTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeCategoryTab: {
    backgroundColor: '#4285F4',
    transform: [{ scale: 1.1 }],
  },
  categoryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  // Featured News Section
  featuredNewsContainer: {
    margin: 12,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#002E8C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  featuredNewsImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  featuredNewsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 46, 140, 0.5)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  featuredNewsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuredNewsSource: {
    color: '#fff',
    fontSize: 14,
  },
  // News Item
  newsItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginHorizontal: 16,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000', // Changed title color to black
  },
  newsSource: {
    fontSize: 14,
    color: '#002E8C',
    marginVertical: 5,
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
  },

  // Loading and Empty States
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    textAlign: 'center',
  },
  emptyList: {
    fontSize: 20,
    color: '#4285F4',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },

  // Profile Section
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    elevation: 6,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileDetails: {
    justifyContent: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002E8C',
  },
  userEmail: {
    fontSize: 16,
    color: '#002E8C',
  },

  // Profile Options
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002E8C',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  lastOption: {
    backgroundColor: '#FFEBEE',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#002E8C',
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: '#002E8C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Footer
  footer: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
    top: -8,
  },

  // Saved Items Section
  savedContentContainer: {
    padding: 16,
  },
  noSavedArticles: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
  },
  savedArticleItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    padding: 12,
  },
  articleImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  articleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  savedArticleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  saveIconContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#002E8C', // Bright color for the icon
    borderRadius: 20,
    padding: 8,
  },
});

export default HomePage;
