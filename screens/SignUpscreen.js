import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Validasi email (email yang valid)
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Validasi password (misalnya panjang minimal 6 karakter)
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  // Fungsi untuk memeriksa apakah tombol bisa ditekan
  const isFormValid = () => {
    return isValidEmail(email) && isValidPassword(password);
  };

  // Fungsi untuk menangani pendaftaran
  const handleSignUp = () => {
    if (isValidEmail(email) && isValidPassword(password)) {
      // Arahkan ke halaman login jika pendaftaran berhasil
      navigation.navigate('SiginScreen');
    } else {
      Alert.alert('Pendaftaran Gagal', 'Email atau password tidak valid.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
      </View>
      <View style={styles.card}>
        <Text style={styles.infoText}>
          Sepertinya anda belum memiliki akun. Mari buat akun gratis anda
        </Text>
        <Text style={styles.title}>Daftar Akun</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email anda"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail} // Menyimpan nilai email
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]}
            placeholder="Masukkan password anda"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword} // Menyimpan nilai password
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
            <FontAwesome name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={styles.termsContainer}>
          <Text style={styles.normalText}>
            Dengan memilih setuju dan melanjutkan di bawah, saya setuju dengan{' '}
            <Text style={styles.linkText}>Persyaratan Layanan</Text> dan{' '}
            <Text style={styles.linkText}>Kebijakan Privasi</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { opacity: isFormValid() ? 1 : 0.5 }]} // Mengubah opacity jika form tidak valid
          onPress={handleSignUp} // Menangani pendaftaran saat tombol ditekan
          disabled={!isFormValid()} // Menonaktifkan tombol jika form tidak valid
        >
          <Text style={styles.buttonText}>Setuju dan Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002e8c',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 140,
    marginBottom: 60,
    top: 70,
  },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    padding: 30,
    width: '110%',
    height: '40%',
    top: 10,
    maxWidth: 600,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flex: 1,
  },
  infoText: {
    color: '#000000',
    fontSize: 15,
    textAlign: 'justify',
    marginBottom: 30,
    top: 10,
  },
  title: {
    color: '#00000',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'justify',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 17,
    borderRadius: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#002e8c',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  termsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  normalText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
  linkText: {
    fontSize: 12,
    color: '#00238c',
  },
  button: {
    backgroundColor: '#002e8c',
    padding: 17,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
