import React from 'react';
import { ScrollView, Text, Image, View, StyleSheet } from 'react-native';

const BookmarkDetailScreen = ({ route }) => {
  const { article } = route.params; // Mengambil data artikel yang diteruskan dari SavedScreen

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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  source: {
    fontSize: 16,
    color: 'gray',
  },
  description: {
    fontSize: 18,
    marginVertical: 10,
  },
  contentDetail: {
    fontSize: 16,
    marginVertical: 10,
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
});

export default BookmarkDetailScreen;
