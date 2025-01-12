import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Membuat konteks untuk menyimpan artikel yang dibookmark
const SavedArticlesContext = React.createContext();

const SavedArticlesProvider = ({ children }) => {
  const [savedArticles, setSavedArticles] = useState([]);

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

  const addArticle = async (article) => {
    try {
      const updatedArticles = [...savedArticles, article];
      setSavedArticles(updatedArticles);
      await AsyncStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const removeArticle = async (articleToRemove) => {
    try {
      const updatedArticles = savedArticles.filter(
        (article) => article.url !== articleToRemove.url
      );
      setSavedArticles(updatedArticles);
      await AsyncStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
    } catch (error) {
      console.error('Error removing article:', error);
    }
  };

  return (
    <SavedArticlesContext.Provider value={{ savedArticles, addArticle, removeArticle, loadSavedArticles }}>
      {children}
    </SavedArticlesContext.Provider>
  );
};

export { SavedArticlesContext, SavedArticlesProvider };
