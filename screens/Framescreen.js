import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  createContext,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FrameScreen = ({ route }) => {
  const { article } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  if (!article) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Artikel tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  const handleSavePress = async () => {
    console.log("Tombol Save Ditekan");
    try {
      if (!article) {
        console.log("Artikel kosong, tidak bisa disimpan.");
        return;
      }
      console.log("Mencoba menyimpan artikel:", article.title);
      let savedArticles = await AsyncStorage.getItem('savedArticles');
      console.log("Data artikel tersimpan sebelumnya:", savedArticles);

      let articlesArray = savedArticles ? JSON.parse(savedArticles) : [];
      const isArticleAlreadySaved = articlesArray.some(savedArticle => savedArticle.title === article.title);

      if (isArticleAlreadySaved) {
        articlesArray = articlesArray.filter(savedArticle => savedArticle.title !== article.title);
        setIsSaved(false);
        console.log("Artikel dihapus.");
      } else {
        articlesArray.push(article);
        setIsSaved(true);
        console.log("Artikel ditambahkan.");
      }

      await AsyncStorage.setItem('savedArticles', JSON.stringify(articlesArray));
      console.log("Data artikel setelah disimpan:", JSON.stringify(articlesArray));
      console.log('Artikel berhasil disimpan/dihapus');

    } catch (error) {
      console.error('Error menyimpan/menghapus artikel:', error);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.frameContentContainer}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleContainer}>
            <Text style={styles.frameTitle}>{article.title}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.frameSource}>Sumber: {article.source?.name || '-'}</Text>
              <Text style={styles.frameDate}>
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '-'}
              </Text>
            </View>
          </View>

          {/* Gambar dipindahkan ke bawah judul */}
          {article.urlToImage ? (
            <Image source={{ uri: article.urlToImage }} style={styles.frameImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Gambar Tidak Tersedia</Text>
            </View>
          )}

          <Text style={styles.frameText}>
            {article.content || article.description || "Tidak ada konten yang tersedia."}
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.saveIconContainer} onPress={handleSavePress}>
        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={30} color="gray" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  frameContentContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  contentWrapper: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 25, // Jarak antara judul dan gambar
    top:25,
  },
    infoContainer: {
    marginBottom: 10, // Margin bawah untuk memberi jarak dengan teks artikel
  },
  frameImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 20, // Jarak antara gambar dan teks artikel
  },
  frameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  frameSource: {
    fontStyle: 'italic',
    color: '#666',
  },
  frameDate: {
    color: '#888',
  },
  frameText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: '#999',
    fontSize: 16
  },
  saveIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 5,
  },
});

export default FrameScreen;