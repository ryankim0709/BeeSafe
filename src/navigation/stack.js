// UI imports
import React, {useEffect, useState} from 'react';

// Navigation imports
import {createStackNavigator} from '@react-navigation/stack';

// Component imports
import Login from '../screens/login';
import HomeBottomTabs from './homeBottomTabs';
import ApiaryBottomTabs from './apiaryBottomTabs';
import BackHome from '../screens/backHome';
import HiveCheck from '../screens/hiveCheck';

// Auth imports
import auth from '@react-native-firebase/auth';

// Stack navigator
const Stack = createStackNavigator();

export default function StackNavigator() {
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
        component={HomeBottomTabs}
        options={{headerShown: false, gestureEnabled: false}}
      />

      {/* Apiary screen */}
      <Stack.Screen
        name="ApiaryBottomTabs"
        component={ApiaryBottomTabs}
        options={{headerShown: false, gestureEnabled: true}}
      />

      {/* Dummy screen to navigate back to HomeBttomTabs */}
      <Stack.Screen
        name="BackHome"
        component={BackHome}
        options={{headerShown: false, gestureEnabled: true}}
      />

      {/* Screen for checking hives */}
      <Stack.Screen
        name="HiveCheck"
        component={HiveCheck}
        options={{headerShown: false, gestureEnabled: true}}
      />
    </Stack.Navigator>
  );
}
