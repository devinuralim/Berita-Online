import React, { useContext } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native";
import { SavedArticlesContext } from "./SavedArticlesContext";
import { ThemeContext } from "../ThemeContext"; // <--- tambahkan ini

const SavedArticlesScreen = ({ navigation }) => {
  const { savedArticles } = useContext(SavedArticlesContext);
  const { theme } = useContext(ThemeContext); // <--- ambil nilai theme

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={savedArticles}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.newsItem, { backgroundColor: theme.colors.card }]}
            onPress={() =>
              navigation.navigate("FrameScreen", { article: item })
            }
          >
            {item.urlToImage && (
              <Image
                source={{ uri: item.urlToImage }}
                style={styles.newsImage}
              />
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
        )}
        keyExtractor={(item) => item.url}
        ListEmptyComponent={
          <Text style={{ color: theme.colors.text }}>No saved articles.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  newsItem: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  newsImage: {
    width: 100,
    height: 100,
  },
  newsContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  newsSource: {
    fontSize: 14,
    marginTop: 4,
  },
  newsDate: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default SavedArticlesScreen;
