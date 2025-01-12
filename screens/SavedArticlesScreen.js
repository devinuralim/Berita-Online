import React, { useContext } from 'react';
import { SavedArticlesContext } from './SavedArticlesContext';
import { FlatList, SafeAreaView, Text, TouchableOpacity, Image, View } from 'react-native';

const SavedArticlesScreen = ({ navigation }) => {
  const { savedArticles } = useContext(SavedArticlesContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={savedArticles}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.newsItem}
            onPress={() => navigation.navigate('FrameScreen', { article: item })}
          >
            {item.urlToImage && <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />}
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSource}>{item.source?.name || 'Unknown Source'}</Text>
              <Text style={styles.newsDate}>{item.publishedAt?.slice(0, 10)}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.url}
        ListEmptyComponent={<Text>No saved articles.</Text>}
      />
    </SafeAreaView>
  );
};
