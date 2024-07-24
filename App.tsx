// App.tsx or entry point
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from './Navigation/DrawerNav'; // Ensure path is correct
import { UserRoleProvider } from './Navigation/RootNavigator'; // Ensure path is correct

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserRoleProvider>
          <DrawerNavigator />
        </UserRoleProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
