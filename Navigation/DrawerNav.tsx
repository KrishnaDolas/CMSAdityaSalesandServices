import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ComplaintForm from '../Components/ComplaintForm';
import LoginScreen from '../Components/Login';
import CustomDrawerContent from './CustomDrawerContent';
import ComplaintList from '../Front-Office/ComplaintList';
import EditComplaint from '../Front-Office/Editcomplaint';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="ComplaintForm" component={ComplaintForm} />
      <Drawer.Screen name="LoginScreen" component={LoginScreen} />
      <Drawer.Screen name="ComplaintList" component={ComplaintList} />
      <Drawer.Screen name="EditComplaint" component={EditComplaint} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
