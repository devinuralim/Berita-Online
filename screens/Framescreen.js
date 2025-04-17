import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../ThemeContext";

const FrameScreen = ({ route, navigation }) => {
  const { article } = route.params || {};
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme.dark;

  const [isSaved, setIsSaved] = useState(false);
  const [fullContent, setFullContent] = useState("");

  if (!article) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Artikel tidak ditemukan.
        </Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    const fetchFullContent = async () => {
      try {
        const response = await fetch(
          `http://192.168.100.142/scrape?url=${article.url}`
        );
        const data = await response.json();
        setFullContent(data.content);
      } catch (error) {
        console.error("Gagal mengambil konten penuh:", error);
      }
    };

    if (article?.url) {
      fetchFullContent();
    }
  }, [article?.url]);

  const handleSavePress = async () => {
    try {
      let savedArticles = await AsyncStorage.getItem("savedArticles");
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

      await AsyncStorage.setItem(
        "savedArticles",
        JSON.stringify(articlesArray)
      );
    } catch (error) {
      console.error("Error menyimpan/menghapus artikel:", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.frameContentContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.titleContainer}>
            <Text style={[styles.frameTitle, { color: theme.colors.text }]}>
              {article.title}
            </Text>
            <View style={styles.infoContainer}>
              <Text
                style={[
                  styles.frameSource,
                  { color: theme.colors.placeholder },
                ]}
              >
                Sumber: {article.source?.name || "-"}
              </Text>
              <Text
                style={[styles.frameDate, { color: theme.colors.placeholder }]}
              >
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString()
                  : "-"}
              </Text>
            </View>
          </View>

          {article.urlToImage ? (
            <Image
              source={{ uri: article.urlToImage }}
              style={styles.frameImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text
                style={[styles.placeholderText, { color: theme.colors.text }]}
              >
                Gambar Tidak Tersedia
              </Text>
            </View>
          )}

          <Text style={[styles.frameText, { color: theme.colors.text }]}>
            {fullContent ||
              article.content ||
              "Tidak ada konten yang tersedia."}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.saveIconContainer,
          { backgroundColor: isDarkMode ? "#E3F2FD" : theme.colors.card },
        ]}
        onPress={handleSavePress}
      >
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={30}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 30,
    left: 10,
    borderRadius: 20,
    padding: 8,
    elevation: 6,
    zIndex: 10,
  },
  frameContentContainer: {
    padding: 16,
    paddingTop: 70,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  contentWrapper: { flex: 1 },
  titleContainer: { marginBottom: 20 },
  infoContainer: { marginBottom: 10 },
  frameImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 12,
  },
  frameTitle: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  frameSource: { fontStyle: "italic" },
  frameDate: {},
  frameText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
    marginBottom: 30,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#888",
  },
  placeholderText: { fontSize: 16 },
  saveIconContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 12,
    borderRadius: 50,
    elevation: 6,
  },
  errorText: { fontSize: 18 },
});

export default FrameScreen;
