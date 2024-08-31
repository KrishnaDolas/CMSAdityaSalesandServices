import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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
  const { userRole } = useUserRole();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userContainer}>
        <Image source={getUserIcon(userRole)} style={styles.userIcon} />
        <Text style={styles.userRoleText}>
          Hello, {userRole === 'guest' ? 'Guest' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </Text>
      </View>
      <DrawerItemList {...props} />
      {userRole === 'admin' && (
        <>
          <DrawerItem 
            label="ComplaintList"
            onPress={() => props.navigation.navigate('ComplaintList')} // Ensure the screen name matches
          />
          <DrawerItem 
            label="EditComplaint"
            onPress={() => props.navigation.navigate('EditComplaint')} // Ensure the screen name matches
          />
        </>
      )}
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
    fontSize: 18,
    marginVertical: 10,
  },
});

export default CustomDrawerContent;
