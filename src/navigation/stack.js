import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/login';
import BottomTabNavigator from './bottomTab';

import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();
export default function StackNavigator() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged(user) {
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeBottomTabs"
        component={BottomTabNavigator}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
}
