import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('Admin'); // Default profile selection
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const profileOptions = [
    { id: '1', label: 'Front-Office', value: 'Admin' },
    { id: '2', label: 'Back-Office', value: 'Super Admin' },
  ];

  const handleProfileChange = (value: string) => {
    setProfile(value);
  };

  const handleSignIn = () => {
    const type_admin = profile === 'Front-Office' ? 1 : 0;
    const type_superadmin = profile === 'Back-Office' ? 1 : 0;
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/ncp.png')} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, styles.bold, styles.orange]}>N</Text>
        <Text style={[styles.title, styles.bold, styles.blue]}>C</Text>
        <Text style={[styles.title, styles.bold, styles.green]}>P</Text>
        <Text style={[styles.title, styles.bold, styles.black]}> CSM</Text>
      </View>
      <Text style={styles.signInText}>Sign In</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          {/* <AntDesign name={showPassword ? "eye" : "eyeo"} size={25} color="black" /> */}
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Select Profile :</Text>
      <View style={styles.radioGroup}>
        {profileOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.radioButton,
              profile === option.value && styles.radioButtonSelected,
            ]}
            onPress={() => handleProfileChange(option.value)}
          >
            <Text style={styles.radioButtonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 42,
  },
  bold: {
    fontWeight: 'bold',
  },
  orange: {
    color: '#FF8C00',
  },
  blue: {
    color: '#0000FF',
  },
  green: {
    color: '#008000',
  },
  black: {
    color: '#000',
  },
  signInText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  forgotPasswordText: {
    color: '#00f',
    textAlign: 'right',
    marginVertical: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radioButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  radioButtonSelected: {
    backgroundColor: '#00f',
  },
  radioButtonText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
