import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SiginScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../assets/bgputih.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Image
              source={require("../assets/poto1.png")}
              style={styles.centerImage}
              resizeMode="cover"
            />
            <View style={styles.newsTextContainer}>
            <Text style={styles.title}>
              Mendinaskem Ungkap AI dan “Coding” Akan Jadi Mata Pelajaran Pilihan di Sekolah
            </Text>
            <Text style={styles.description}>
              JAKARTA - Menteri Pendidikan Dasar dan Menengah (Mendikdasmen) Abdul Mufti mengungkap, pihaknya akan mengadakan mata...
            </Text>
          </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('SiginUsername')}
            >
              <Text style={styles.buttonText}>Masuk</Text>
            </TouchableOpacity>

            <View style={styles.orContainer}> {/* Container untuk garis "Atau" */}
              <View style={styles.line} /> {/* Garis */}
              <Text style={styles.orText}>Atau</Text>
              <View style={styles.line} /> {/* Garis */}
            </View>

            <TouchableOpacity style={styles.googleButton}>
              <Image
                source={require("../assets/google.png")}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Lanjutkan dengan Google</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Belum Punya Akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={styles.signUpLink}>Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: height * 0.1
  },
  contentContainer: {
    width: width * 0.8,
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 220, // Ukuran logo diperbesar
    height: 104,
    alignSelf: 'flex-start',
    marginBottom: -85,
    top:-75,
    left:-50,
  },
  centerImage: {
    width: 364,
    height: 500,
    marginBottom: 10,
    borderRadius: 30, // Menambahkan sudut tumpul
    overflow: 'hidden', // Memastikan sudut tumpul diterapkan dengan benar
  },
  newsTextContainer: {
    position: 'absolute',
    top: height * 0.40,
    left: 20,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 21,
    textAlign: 'left',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontWeight: 'bold',
    width: 330,
    height: 81,
  },
  description: {
    fontSize: 14,
    textAlign: 'left',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    width: 330,
    height: 81,
  },
  orContainer: { // Style untuk container "Atau"
    flexDirection: 'row', // Agar garis dan teks berada dalam satu baris
    alignItems: 'center', // Agar teks dan garis berada di tengah vertikal
    marginVertical: -45, // Margin vertikal
    fontSize: 15,
    marginBottom: 8,
    },
  button: {
    backgroundColor: '#002e8c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 10,
    width: 254,
    height:53,
    top:-50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 5,
    width: 290,
    height:53,
    borderWidth: 1,
    borderColor: '#002e8c',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 18,
  },
  signUpContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  signUpText: {
    fontSize: 16,
    color: '#555',
  },
  signUpLink: {
    fontSize: 16,
    color: '#002e8c',
    fontWeight: 'bold',
  },
});