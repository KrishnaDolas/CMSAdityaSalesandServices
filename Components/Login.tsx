import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/types'; // Correct path
import { useUserRole } from '../Navigation/RootNavigator'; // Adjust the import path as needed

type UserRole = 'guest' | 'front-office' | 'back-office';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<UserRole>('front-office');
  const [frontOffice, setFrontOffice] = useState(1);
  const [backOffice, setBackOffice] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUserRole } = useUserRole(); // Hook for setting user role

  const profileOptions: { id: string; label: string; value: UserRole }[] = [
    { id: '1', label: 'Front-Office', value: 'front-office' },
    { id: '2', label: 'Back-Office', value: 'back-office' },
  ];

  const handleProfileChange = (value: UserRole) => {
    setProfile(value);
    if (value === 'front-office') {
      setFrontOffice(1);
      setBackOffice(0);
    } else if (value === 'back-office') {
      setFrontOffice(0);
      setBackOffice(1);
    }
  };

  const handleSignIn = async () => {
    try {
        const response = await fetch('https://baramatiapi.beatsacademy.in/complaintlogin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                front_office: frontOffice,
                back_office: backOffice,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            await AsyncStorage.setItem('admin_ID', data.admin_ID.toString());
            await AsyncStorage.setItem('office', data.office);
            await AsyncStorage.setItem('userRole', profile);

            // Update user role in context
            setUserRole(profile);

            // Reset the navigation stack to re-render the drawer
            navigation.reset({
                index: 0,
                routes: [{ name: 'ComplaintForm' }], // Reset to a root screen
            });

            // Navigate to ComplaintList after resetting the drawer
            if (profile === 'front-office') {
                navigation.navigate('ComplaintList');
            }
        } else {
            Alert.alert('Login Failed', data.message || 'An error occurred. Please try again.');
        }
    } catch (error) {
        Alert.alert('Login Failed', 'An error occurred. Please try again.');
    }
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
          {/* Eye icon implementation */}
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
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#008CBA',
    borderColor: '#008CBA',
  },
  radioButtonText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Login;
