// CustomDrawerContent.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useUserRole } from './RootNavigator'; // Ensure path is correct
import { UserRole } from './types'; // Import UserRole type


const getUserIcon = (role: UserRole) => {
  switch (role) {
    case 'front-office':
      return require('../assets/front-office.png'); // Replace with correct path
    case 'back-office':
      return require('../assets/Back-office.png'); // Replace with correct path
    default:
      return require('../assets/guest.png'); // Default guest icon
  }
};

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { userRole } = useUserRole();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userContainer}>
        <Image source={getUserIcon(userRole)} style={styles.userIcon} />
        <Text style={styles.userRoleText}>Hello, {userRole === 'guest' ? 'Guest' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userRoleText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CustomDrawerContent;
