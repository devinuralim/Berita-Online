import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FrameScreen = ({ route, navigation }) => {
  const { article } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  if (!article) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Artikel tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  const handleSavePress = async () => {
    try {
      let savedArticles = await AsyncStorage.getItem('savedArticles');
      let articlesArray = savedArticles ? JSON.parse(savedArticles) : [];
      const isArticleAlreadySaved = articlesArray.some(
        (savedArticle) => savedArticle.title === article.title
      );

      if (isArticleAlreadySaved) {
        articlesArray = articlesArray.filter(
          (savedArticle) => savedArticle.title !== article.title
        );
        setIsSaved(false);
      } else {
        articlesArray.push(article);
        setIsSaved(true);
      }

      await AsyncStorage.setItem('savedArticles', JSON.stringify(articlesArray));
    } catch (error) {
      console.error('Error menyimpan/menghapus artikel:', error);
    }
  };

   return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

      {/* Konten Artikel */}
      <ScrollView contentContainerStyle={styles.frameContentContainer}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleContainer}>
            <Text style={styles.frameTitle}>{article.title}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.frameSource}>Sumber: {article.source?.name || '-'}</Text>
              <Text style={styles.frameDate}>
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString()
                  : '-'}
              </Text>
            </View>
          </View>

          {/* Gambar Artikel */}
          {article.urlToImage ? (
            <Image source={{ uri: article.urlToImage }} style={styles.frameImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Gambar Tidak Tersedia</Text>
            </View>
          )}

          {/* Konten Artikel */}
          <Text style={styles.frameText}>
            {article.content || article.description || "Tidak ada konten yang tersedia."}
          </Text>
        </View>
      </ScrollView>

      {/* Tombol Simpan */}
      <TouchableOpacity style={styles.saveIconContainer} onPress={handleSavePress}>
        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={30} color="#1E88E5" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Latar belakang putih
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: '#002E8C', // Biru gelap
    borderRadius: 30,
    padding: 12,
    elevation: 6,
  },
  frameContentContainer: {
    padding: 16, // Jarak konten dengan tepi layar
    paddingTop: 70, // Ruang untuk tombol kembali
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 10,
  },
  frameImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 12, // Rounded corners for a smoother look
  },
  frameTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000', // Dark color for contrast
    marginBottom: 10,
  },
  frameSource: {
    fontStyle: 'italic',
    color: '#333', // Slightly lighter grey
  },
  frameDate: {
    color: '#666', // Lighter grey for date
  },
  frameText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#333', // More neutral color for text
    marginBottom: 30, // Extra space after text
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#BBDEFB', // Light blue for placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    color: '#002E8C',
    fontSize: 16,
  },
  saveIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 50,
    elevation: 6,
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000', // Red color for error message
  },
});

export default FrameScreen;
