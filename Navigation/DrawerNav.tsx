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

      {/* Use React.Fragment to conditionally render screens */}
      {userRole === 'front-office' && (
        <React.Fragment>
          <Drawer.Screen name="ComplaintList" component={ComplaintList} />
          <Drawer.Screen name="EditComplaint" component={EditComplaint} />
        </React.Fragment>
      )}
    </Drawer.Navigator>
  );
};

export default AppNavigator;
