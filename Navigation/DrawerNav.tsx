// AppNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ComplaintForm from '../Components/ComplaintForm'; // Correct path
import Login from '../Components/Login'; // Correct path
import ComplaintStackNavigator from './ComplaintStackNavigator'; // Import the stack navigator
import CustomDrawerContent from './CustomDrawerContent'; // Correct path
import { useUserRole } from './RootNavigator'; // Correct path

const Drawer = createDrawerNavigator();

const AppNavigator: React.FC = () => {
  const { userRole } = useUserRole();

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="ComplaintForm" component={ComplaintForm} />
      <Drawer.Screen name="Login" component={Login} /> 

      {/* Use the ComplaintStackNavigator for complaint-related screens */}
      {userRole === 'front-office' && (
        <Drawer.Screen name="ComplaintStack" component={ComplaintStackNavigator} options={{ title: 'Complaints' }} />
      )}
    </Drawer.Navigator>
  );
};

export default AppNavigator;
