// UI imports
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Community from 'react-native-vector-icons/MaterialCommunityIcons';

// Navigation imports
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

// Componenet imports
import ViewApiary from '../screens/viewApiary';
import Settings from '../screens/settings.js';
import BackHome from '../screens/backHome';
import CreateHive from '../screens/createHive';

const Tab = createBottomTabNavigator();

// screenOptions: {tabBarShowLabel: false, headerShown: false tabBarStyle:{}}
// tabBarBadge

export default function ApiaryBottomTabs({route}) {
  return (
    <Tab.Navigator
      initialRouteName="View Apiary"
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: '#F5F5F5',
      }}>
      {/* Back to home screen */}
      <Tab.Screen
        name="Home"
        component={BackHome}
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

      {/* Home page. Where the hives are displayed */}
      <Tab.Screen
        name="View Apiary"
        options={{
          tabBarIcon: ({color, size}) => (
            <Community name="magnify" color={color} size={size} />
          ),
          tabBarStyle: {
            backgroundColor: '#F09819',
            position: 'absolute',
            overflow: 'hidden',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            display: getTabBarVisibility(route),
          },
        }}>
        {props => (
          <ViewApiary {...props} data={route.params} route={route.params} />
        )}
      </Tab.Screen>

      {/* Hive Creationg */}
      <Tab.Screen
        name="Create Hive"
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
        }}>
        {props => (
          <CreateHive {...props} data={route.params} route={route.params} />
        )}
      </Tab.Screen>
      {/* Apiary Edits */}
      <Tab.Screen
        name="Edit Apiary"
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
  // Is bottom tab navigator visible or not
  if (routeName == 'Create Hive') return 'none'; // Not visible for all screens except Create Apiary
  return 'flex';
};
