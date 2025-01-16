import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SavedArticlesContext } from './SavedArticlesContext';

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
              key={article.url} // Gunakan URL sebagai key (harus unik)
              onPress={() =>
                navigation.navigate('BookmarkDetailScreen', { article })
              }
            >
              <View style={styles.savedArticleItem}>
                {/* Menampilkan Gambar Artikel */}
                <Image
                  source={{
                    uri: article.image || article.urlToImage || DEFAULT_IMAGE, // Gunakan fallback jika properti image kosong
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  savedContentContainer: {
    padding: 16,
  },
  noSavedArticles: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
  savedArticleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  articleInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedArticleTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
});

export default SavedScreen;