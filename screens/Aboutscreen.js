import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Tombol Kembali */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Judul Tentang Tim */}
      <Text style={styles.title}>Tentang Infinity Team</Text>

      {/* Subjudul Anggota Tim */}
      <Text style={styles.subtitle}>Anggota Infinity Team</Text>

      {/* ScrollView untuk membuat konten bisa digulir */}
      <ScrollView contentContainerStyle={styles.teamContainer}>
        {[
          { name: 'Devi Nuralim', nim: '17223012', image: require('../assets/devi.jpg') },
          { name: 'Rd Marissa Lestari', nim: '17221020', image: require('../assets/mar.jpg') },
          { name: 'Rifda Triani Mutmainah', nim: '17223007', image: require('../assets/rifda.jpg') },
          { name: 'Santi Rahmawati', nim: '17223015', image: require('../assets/santi.jpg') },
          { name: 'Aripin Ilham', nim: '17223020', image: require('../assets/ipin.jpg') },
        ].map((member, index) => (
          <View key={index} style={styles.memberCard}>
            <Image source={member.image} style={styles.memberImage} />
            <Text style={styles.memberName}>{member.name} 💙</Text>
            <Text style={styles.memberNim}>NIM: {member.nim}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>NEWSLY | InfinityTeam | ARSUNIVERSITY</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Biru muda lembut
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 10,
    backgroundColor: '#002E8C',
    borderRadius: 30,
    padding: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -8,
    color: '#0D47A1',
    textShadowColor: '#BBDEFB',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    color: '#1E88E5',
    fontStyle: 'italic',
  },
  teamContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  memberCard: {
    backgroundColor: '#BBDEFB',
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 20,
    width: '40%',
    marginHorizontal: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    transform: [{ rotate: '-2deg' }], // Efek miring lucu
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#0D47A1',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 5,
  },
  memberNim: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 10,
  },
  footer: {
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
    top:-7,
},
});

export default AboutScreen;
