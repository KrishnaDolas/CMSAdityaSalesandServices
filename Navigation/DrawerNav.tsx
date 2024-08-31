import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ComplaintForm from '../Components/ComplaintForm'; // Correct path
import Login from '../Components/Login'; // Correct path
import ComplaintList from '../Front-Office/ComplaintList'; // Correct path
import EditComplaint from '../Front-Office/Editcomplaint'; // Ensure the path and file name are correct
import CustomDrawerContent from './CustomDrawerContent'; // Correct path
import { useUserRole } from './RootNavigator'; // Correct path

const Drawer = createDrawerNavigator();

const AppNavigator: React.FC = () => {
  const { userRole } = useUserRole();

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="ComplaintForm" component={ComplaintForm} />
      <Drawer.Screen name="Login" component={Login} />
      {userRole === 'front-office' && (
        <>
          <Drawer.Screen name="ComplaintList" component={ComplaintList} />
          <Drawer.Screen name="EditComplaint" component={EditComplaint} />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default AppNavigator;
