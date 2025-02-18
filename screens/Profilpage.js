import * as React from "react";
import { Image, TouchableOpacity, Modal, Pressable } from "react-native";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import Ellipse3 from "../../Newsly/assets/ellipse-3.png";
import Vector from "../../Newsly/assets/Vector.png";
import { FontFamily, Color, FontSize, Border } from "../Globalstyles";

// Mengambil dimensi layar
const { width, height } = Dimensions.get("window");

const ProfilPage = ({ navigation }) => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = React.useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalVisible(false);
    navigation.replace("SiginScreen");
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.profilPage}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.programmingContainer}>
        <Image
          style={styles.programmingBackground}
          contentFit="cover"
          source={require("../assets/programming.jpg")}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image
          style={[
            styles.profilPageChild,
            { width: width * 0.25, height: width * 0.25 },
          ]}
          contentFit="cover"
          source={Ellipse3}
        />
        <Image
          style={[
            styles.vectorIcon,
            { width: width * 0.25, height: width * 0.25 },
          ]}
          contentFit="cover"
          source={Vector}
        />
      </View>

      {/* Nama Pengguna */}
      <Text style={styles.infinityteam}>Infinityteam</Text>

      {/* Opsi Menu */}
      <View style={styles.menuContainer}>
        <MenuItem icon={require("../assets/avatar.jpg")} text="Kelola Akun" />
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

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Image
          source={require("../assets/copyright.jpg")}
          style={styles.copyrightIcon}
        />
        <Text style={styles.footerText}>
          NEWSLY | InfinityTeam | ARSUNIVERSITY
        </Text>
      </View>

      {/* Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Keluar</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonText}>Ya</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Tidak</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const MenuItem = ({ icon, text, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <Image source={icon} style={[styles.menuIcon, style]} />
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  profilPage: {
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
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
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -45,
  },
  profilPageChild: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
  },
  vectorIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  infinityteam: {
    fontSize: FontSize.size_lg,
    fontWeight: "700",
    fontFamily: FontFamily.poppinsSemiBold,
    textAlign: "center",
    color: Color.colorBlack,
    marginTop: 10,
  },
  menuContainer: {
    width: "90%",
    marginTop: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorGray_200,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  informationIcon: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  menuText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsMedium,
  },
  footerContainer: {
    marginTop: 50,
    alignItems: "center",
    flexDirection: "row",
  },
  copyrightIcon: {
    width: 16,
    height: 16,
    marginRight: 7,
  },
  footerText: {
    fontSize: FontSize.size_3xs,
    textAlign: "center",
    color: Color.colorGray_200,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#002E8C",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "65%",
    maxWidth: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  modalButtonContainer: {
    width: "80%",
    gap: 15,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    width: "100%",
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: "#FBBC05",
  },
  modalButtonText: {
    color: "#002E8C",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 15,
    fontFamily: FontFamily.poppinsMedium,
  },
});

export default ProfilPage;
