// UI imports
import React, {useEffect, useState} from 'react';

// Navigation imports
import {createStackNavigator} from '@react-navigation/stack';

// Component imports
import Login from '../screens/login';
import BottomTabNavigator from './bottomTab';

// Auth imports
import auth from '@react-native-firebase/auth';

// Stack navigator
const Stack = createStackNavigator();

export default function StackNavigator() {
  // Auth states
  const [initializing, setInitializing] = useState(true);

  // Auth state change
  function onAuthStateChanged(user) {
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    // Auth state change
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <Stack.Navigator initialRouteName={'Login'}>
      {/* Login Screen */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      {/* Home screen */}
      <Stack.Screen
        name="HomeBottomTabs"
        component={BottomTabNavigator}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
}
