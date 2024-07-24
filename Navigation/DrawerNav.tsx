import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ComplaintForm from '../Components/ComplaintForm';
import LoginScreen from '../Components/Login';
import CustomDrawerContent from './CustomDrawerContent';
import ComplaintList from '../Front-Office/ComplaintList';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="ComplaintForm" component={ComplaintForm} />
      <Drawer.Screen name="LoginScreen" component={LoginScreen} />
      <Drawer.Screen name="ComplaintList" component={ComplaintList} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
