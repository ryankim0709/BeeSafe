// UI imports
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';

// Navigation imports
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

// Componenet imports
import Home from '../screens/home.js';
import CreateApiary from '../screens/createApiary.js';
import Settings from '../screens/settings.js';

const Tab = createBottomTabNavigator();

// screenOptions: {tabBarShowLabel: false, headerShown: false tabBarStyle:{}}
// tabBarBadge

export default function BottomTabNavigator({route}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: '#F5F5F5',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="home" color={color} size={size} />
          ),
          tabBarStyle: {
            backgroundColor: '#F09819',
            position: 'absolute',
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            display: getTabBarVisibility(route),
          },
        }}
      />
      <Tab.Screen
        name="Create Apiary"
        component={CreateApiary}
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="plus-circle" color={color} size={size} />
          ),
          tabBarStyle: {
            backgroundColor: '#F09819',
            position: 'absolute',
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            display: getTabBarVisibility(route),
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicon name="ios-settings-outline" color={color} size={size} />
          ),
          tabBarStyle: {
            backgroundColor: '#F09819',
            position: 'absolute',
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            display: getTabBarVisibility(route),
          },
        }}
      />
    </Tab.Navigator>
  );
}

const getTabBarVisibility = route => {
  // Get route name
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  console.log(routeName);

  // Is bottom tab navigator visible or not
  if (routeName == 'Home' || routeName == 'Settings') return 'flex';
  if (routeName == 'Create Apiary') return 'none';
};
