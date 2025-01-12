import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Siginusername = ({ navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={
            require('../assets/logo2.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Masuk Akun</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan email anda"
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password anda"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIconContainer}
          >
            <FontAwesome
              name={passwordVisible ? 'eye-slash' : 'eye'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
       <TouchableOpacity
                 style={styles.button}
                 onPress={() => navigation.navigate('HomePage')}
               >
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002e8c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 130,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    width: 360,
    height:340,
    maxWidth: 380,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00000',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#002e8c',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    backgroundColor: '#1E40AF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Siginusername;
