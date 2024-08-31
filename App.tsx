import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './Navigation/DrawerNav'; // Correct path
import { UserRoleProvider } from './Navigation/RootNavigator'; // Correct path

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <UserRoleProvider>
          <AppNavigator />
        </UserRoleProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
