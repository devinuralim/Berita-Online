import React, { createContext, useState } from "react";

const lightTheme = {
  dark: false,
  colors: {
    background: "#fff",
    text: "#000",
    placeholder: "#888",
    icon: "#000",
    header: "#f9f9f9",
    card: "#fff", // tambahkan card kalau belum ada
    border: "#ddd", // tambahkan border kalau belum ada
    primary: "#007bff", // warna biru cerah buat icon yang aktif
    searchBar: "#f0f0f0", // background light mode
    searchIcon: "#888",
    inputText: "#000",
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: "#121212",
    text: "#fff",
    placeholder: "#aaa",
    icon: "#000",
    card: "#1c1c1c", // warna tabBar dan header dark mode
    border: "#333", // warna border di dark mode
    primary: "#4dabf7", // biru muda glow buat icon aktif di dark
    inputText: "#000",
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
