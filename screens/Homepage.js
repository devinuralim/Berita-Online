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

  const renderMainNews = () => {
    const mainArticle = news[0]; // First article as main news
    return (
      <TouchableOpacity
        style={styles.mainNewsContainer}
        onPress={() => navigation.navigate("FrameScreen", { article: mainArticle })}
      >
        <Image source={{ uri: mainArticle.urlToImage }} style={styles.mainNewsImage} />
        <View style={styles.mainNewsOverlay}>
          <Text style={styles.mainNewsTitle}>{mainArticle.title}</Text>
          <Text style={styles.mainNewsSource}>{mainArticle.source.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        setNews(response.data.articles);
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
        <ActivityIndicator size="large" color="#0000ff" />
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

const Framescreen = ({ route }) => {
  const { article } = route.params; // Menerima data artikel dari navigasi

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


// Saved Screen
const SavedScreen = ({ navigation }) => {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const loadSavedArticles = async () => {
      try {
        const savedArticlesData = await AsyncStorage.getItem('savedArticles');
        if (savedArticlesData) {
          const parsedArticles = JSON.parse(savedArticlesData);
          console.log('Data yang dimuat dari AsyncStorage:', parsedArticles); // Debugging
          setSavedArticles(parsedArticles);
        } else {
          console.log('Tidak ada artikel yang disimpan'); // Jika tidak ada data
        }
      } catch (error) {
        console.error('Error memuat artikel yang disimpan:', error);
      }
    };

    loadSavedArticles();
  }, []); // [] memastikan useEffect hanya dijalankan sekali saat komponen di-mount

  const unsaveArticle = async (articleToRemove) => {
    // Gunakan 'url' sebagai identitas unik
    const updatedArticles = savedArticles.filter(
      article => article.url !== articleToRemove.url
    );
    console.log('Daftar artikel setelah penghapusan:', updatedArticles);
    console.log('Artikel sebelum dihapus:', savedArticles);
    console.log('Artikel yang akan dihapus:', articleToRemove);
    console.log('Artikel yang tersisa:', savedArticles.filter(article => article.url !== articleToRemove.url));  
    setSavedArticles(updatedArticles);
  
    try {
      await AsyncStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
    } catch (error) {
      console.error('Error menghapus artikel yang disimpan:', error);
    }
  };

  const isArticleSaved = (article) => {
    return savedArticles.some(savedArticle => savedArticle.url === article.url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.savedContentContainer}>
        {savedArticles.length === 0 ? (
          <Text style={styles.noSavedArticles}>Belum ada artikel yang disimpan.</Text>
        ) : (
          savedArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              onPress={() =>
                navigation.navigate('BookmarkDetailScreen', { article })
              }>
              <View style={styles.savedArticleItem}>
                {/* Informasi Artikel */}
                <Text style={styles.savedArticleTitle}>{article.title}</Text>
                <View style={styles.articleActions}>
                  {/* Logo Saved */}
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
                    }}>
                    <Icon name="bookmark" size={24} color="#007bff" // Ubah warna jika disimpan
                      style={isArticleSaved(article) && { fontWeight: 'bold' }} // Bold jika disimpan
                    />
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
    } else {
      Alert.alert(`Anda menekan ${section}`); // Menampilkan alert untuk opsi lain
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

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={() => handlePress("Kelola Akun")}>
            <Ionicons name="settings-outline" size={24} color="#333" />
            <Text style={styles.optionText}>Kelola Akun</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handlePress("Saran dan Masukan")}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
            <Text style={styles.optionText}>Saran dan Masukan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handlePress("Tentang Ponsel")}>
            <Ionicons name="phone-portrait-outline" size={24} color="#333" />
            <Text style={styles.optionText}>Tentang Ponsel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => handlePress("Hubungi Kami")}>
            <Ionicons name="call-outline" size={24} color="#333" />
            <Text style={styles.optionText}>Hubungi Kami</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, styles.lastOption]} onPress={() => handlePress("Keluar")}>
            <Ionicons name="log-out-outline" size={24} color="red" />
            <Text style={[styles.optionText, { color: "red" }]}>Keluar</Text>
          </TouchableOpacity>
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
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmLogout}>
                <Text style={styles.buttonText}>Ya</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={cancelLogout}>
                <Text style={styles.buttonText}>Tidak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  safeArea: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#fefefe",
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#002e8c",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderColor: "#002e8c",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 0,
    marginRight: 10,
    marginTop: -15,
  },
  
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchIconContainer: {
    paddingLeft: 10,
  },
  notificationIconContainer: { // Container untuk ikon
        alignSelf: 'flex-end', // Posisikan ikon di bawah
        padding: 5
    },
  notificationIcon: {
    padding: 5,
    alignItems: "center",
  },
  newsItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#002e8c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  bookmarkButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
},

  // Saved Item
  savedContentContainer:{
        padding: 10
    },
    noSavedArticles:{
        textAlign:'center',
        padding: 20
    },
    savedArticleItem:{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    savedArticleTitle:{
        fontSize: 15,
        fontWeight: 'bold'
    },

  // Profile Header
  
  profileCard: {
    alignItems: 'center', // Agar gambar dan teks di tengah horizontal
    marginBottom: 30, // Jarak antara profile card dan options
  },
  profileImage: {
    width: 110, // Ukuran gambar diperbesar
    height: 110,
    borderRadius: 60, // Setengah dari width/height untuk lingkaran sempurna
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10, // Jarak antara gambar dan teks
  },
  profileDetails: {
    alignItems: 'center', // Agar teks di tengah
  },
  username: {
    fontSize: 20, // Ukuran font diperbesar
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
  },
  optionsContainer: { // Style untuk container options
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Padding vertikal diperbesar
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastOption: { // Style khusus untuk opsi terakhir
    borderBottomWidth: 0, // Hilangkan border bawah
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },

    // ... style yang sudah ada
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Latar belakang gelap transparan
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: '#002e8c', // Warna biru tua seperti di gambar
      borderRadius: 10,
      padding: 20,
      elevation: 5, // Efek bayangan
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'white',
      textAlign: 'center'
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      color: 'white',
      textAlign: 'center'
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    modalButton: {
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 5
    },
      confirmButton:{
          backgroundColor:"#FBBC05"
      },
    buttonText:{
      color:"black"
    },
    container: {
    flex: 1,
    padding: 16,
    backgroundColor:"#fff"
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  source: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333'
  },
    contentDetail:{
        fontSize:15,
        color: '#333'
    },
  date: {
    fontSize: 12,
    color: '#bbb',
  },  
//
  newsImage: { width: 100, height: 100, borderRadius: 5 },
  newsContent: { flex: 1, marginLeft: 10 },
  newsTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  newsSource: { fontSize: 12, color: "#888", marginBottom: 5 },
  newsDate: { fontSize: 12, color: "#bbb" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", textAlign: "center", margin: 10 },
  emptyList: { textAlign: "center", marginTop: 20, color: "#888" },
  text: { fontSize: 18, fontWeight: "bold" },
  savedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#002e8c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  //
  savedContent: { flex: 1 },
  savedTitle: { fontSize: 16, fontWeight: "bold" },
  savedSource: { fontSize: 14, color: "#888" },
  savedDate: { fontSize: 12, color: "#bbb" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#888" },

  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", padding: 16, alignItems: "center" },
  searchBar: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
  notificationIcon: { marginLeft: 8 },
  featuredNewsContainer: { margin: 16, position: "relative" },
  featuredNewsImage: { width: "100%", height: 200, borderRadius: 8 },
  featuredNewsOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: "rgba(0,0,0,0.5)", borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  featuredNewsTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  featuredNewsSource: { color: "#fff", fontSize: 14 },
  categoryTabs: { flexDirection: "row", marginVertical: 8, marginHorizontal: 16 },
  categoryTab: { padding: 8, borderRadius: 16, backgroundColor: "#f5f5f5", marginHorizontal: 4 },
  activeCategoryTab: { backgroundColor: "#4285F4" },
  categoryText: { color: "#333" },
  activeCategoryText: { color: "#fff" },
  newsItem: { flexDirection: "row", margin: 16, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 16 },
  newsImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  newsContent: { flex: 1 },
  newsTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  newsSource: { fontSize: 14, color: "#555", marginBottom: 4 },
  newsDate: { fontSize: 12, color: "#888" },
});

export default HomePage;
