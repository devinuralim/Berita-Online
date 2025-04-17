import React, { useContext, useState } from "react";
import {
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import Ellipse3 from "../../Newsly/assets/ellipse-3.png";
import Vector from "../../Newsly/assets/Vector.png";
import { FontFamily, Color, FontSize, Border } from "../Globalstyles";
import { ThemeContext } from "../ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ProfilPage = ({ navigation }) => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme.dark;

  const handleLogout = () => setIsLogoutModalVisible(true);
  const confirmLogout = () => {
    setIsLogoutModalVisible(false);
    navigation.replace("SiginScreen");
  };

  return (
    <ScrollView
      style={[
        styles.scrollContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={styles.profilPage}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.programmingContainer}>
        <Image
          style={styles.programmingBackground}
          source={require("../assets/programming.jpg")}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image
          style={[
            styles.profilPageChild,
            { width: width * 0.25, height: width * 0.25 },
          ]}
          source={Ellipse3}
        />
        <Image
          style={[
            styles.vectorIcon,
            { width: width * 0.25, height: width * 0.25 },
          ]}
          source={Vector}
        />
      </View>

      <Text style={[styles.infinityteam, { color: theme.colors.text }]}>
        Infinityteam
      </Text>

      {/* Tombol Dark Mode */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={[
          styles.toggleButton,
          {
            backgroundColor: isDarkMode ? theme.colors.card : theme.colors.card,
          },
        ]}
      >
        <Ionicons
          name={isDarkMode ? "sunny" : "moon"}
          size={24}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      {/* Menu Items - Menjadi lebih dekat dengan atas */}
      <View style={styles.menuContainer}>
        <MenuItem icon={require("../assets/profil.png")} text="Kelola Akun" />
        <MenuItem
          icon={require("../assets/message.jpg")}
          text="Saran dan Masukan"
        />
        <MenuItem icon={require("../assets/phone.jpg")} text="Hubungi Kami" />
        <MenuItem
          icon={require("../assets/information.jpg")}
          text="Tentang Aplikasi"
          style={styles.informationIcon}
          onPress={() => navigation.navigate("AboutScreen")}
        />
        <MenuItem
          icon={require("../assets/logout.jpg")}
          text="Keluar"
          onPress={handleLogout}
        />
      </View>

      <View style={styles.footerContainer}>
        <Image
          source={require("../assets/copyright.jpg")}
          style={styles.copyrightIcon}
        />
        <Text style={[styles.footerText, { color: theme.colors.placeholder }]}>
          NEWSLY | InfinityTeam | ARSUNIVERSITY
        </Text>
      </View>

      {/* Modal Logout */}
      <Modal
        animationType="fade"
        transparent
        visible={isLogoutModalVisible}
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalView, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Keluar
            </Text>
            <View style={styles.modalButtonContainer}>
              {/* Tombol Ya */}
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  pressed && styles.buttonPressed,
                  { marginRight: 10 }, // Menambahkan jarak antara tombol
                ]}
                onPress={confirmLogout}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: "#0066FF" }, // Warna biru untuk "Ya"
                  ]}
                >
                  Ya
                </Text>
              </Pressable>

              {/* Tombol Tidak */}
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Tidak
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const MenuItem = ({ icon, text, onPress, style }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Image
        source={icon}
        style={[styles.menuIcon, style, { tintColor: theme.colors.text }]}
      />
      <Text style={[styles.menuText, { color: theme.colors.text }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  profilPage: { paddingBottom: 20, alignItems: "center" },
  programmingContainer: {
    width: width,
    height: height * 0.25,
    overflow: "hidden",
    borderBottomLeftRadius: Border.br_16xl,
    borderBottomRightRadius: Border.br_16xl,
  },
  programmingBackground: {
    width: "100%",
    height: "120%",
    position: "absolute",
    top: -10,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -45,
  },
  profilPageChild: { borderRadius: 100, borderWidth: 3, borderColor: "white" },
  vectorIcon: { position: "absolute", bottom: 0, right: 0 },
  infinityteam: {
    fontSize: FontSize.size_lg,
    fontWeight: "700",
    fontFamily: FontFamily.poppinsSemiBold,
    textAlign: "center",
    marginTop: 10,
  },
  toggleButton: { marginTop: 5, padding: 10, borderRadius: 50 },
  menuContainer: { width: "90%", marginTop: 20, top: -30 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorGray_200,
  },
  menuIcon: { width: 20, height: 20, marginRight: 20 },
  informationIcon: { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  menuText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsMedium,
  },
  footerContainer: {
    marginTop: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  copyrightIcon: { width: 16, height: 16, marginRight: 7, top: -20 },
  footerText: { fontSize: FontSize.size_3xs, textAlign: "center", top: -20 },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "#002E8C",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "65%",
    maxWidth: 250,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  modalButtonContainer: { width: "80%", gap: 15, marginBottom: 10 },
  modalButton: {
    backgroundColor: "transparent",
    borderRadius: 25,
    padding: 10,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
  },
  buttonPressed: { backgroundColor: Color.colorGray_200 },
  modalButtonText: {
    color: "#002E8C",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 15,
    fontFamily: FontFamily.poppinsMedium,
  },
});

export default ProfilPage;
