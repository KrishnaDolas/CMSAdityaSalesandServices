import React from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useUserRole } from './RootNavigator'; // Correct path
import { UserRole } from './types'; // Correct path

const getUserIcon = (role: UserRole) => {
  switch (role) {
    case 'front-office':
      return require('../assets/front-office.png');
    case 'back-office':
      return require('../assets/front-office.png');
    case 'admin':
      return require('../assets/front-office.png');
    default:
      return require('../assets/guest.png');
  }
};

const CustomDrawerContent: React.FC<any> = (props) => {
  const { userRole, setUserRole } = useUserRole(); // Added setUserRole for logout

  const logout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      // Reset user role to guest
      setUserRole('guest');
      // Navigate to Login screen
      props.navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Image source={getUserIcon(userRole)} style={styles.userIcon} />
          <Text style={styles.userRoleText}>
            Hello, {userRole === 'guest' ? 'Guest' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Text>
        </View>

        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
          
          {userRole === 'admin' && (
            <View style={styles.adminSection}>
              <DrawerItem 
                label="Complaint List"
                labelStyle={styles.drawerLabel}
                onPress={() => props.navigation.navigate('ComplaintList')}
                style={styles.drawerItem}
              />
              <DrawerItem 
                label="Edit Complaint"
                labelStyle={styles.drawerLabel}
                onPress={() => props.navigation.navigate('EditComplaint')}
                style={styles.drawerItem}
              />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  userRoleText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  drawerItems: {
    flex: 1,
    marginTop: 20,
  },
  adminSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  drawerItem: {
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF4C4C',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomDrawerContent;
