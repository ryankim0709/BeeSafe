// UI imports
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Community from 'react-native-vector-icons/MaterialCommunityIcons';

// Navigation imports
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

// Componenet imports
import DiseaseScan from '../screens/HiveScreen/diseaseScan.js';
import BackOne from '../screens/backOne.js';
import ViewHive from '../screens/HiveScreen/viewHive.js';
import HiveReport from '../screens/HiveScreen/hiveReport.js';

const Tab = createBottomTabNavigator();

// screenOptions: {tabBarShowLabel: false, headerShown: false tabBarStyle:{}}
// tabBarBadge

export default function HiveBottomTabs({route}) {
  return (
    <Tab.Navigator
      initialRouteName="View Hive"
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: '#F5F5F5',
      }}>
      {/* Back to home screen */}
      <Tab.Screen
        name="Apiary"
        component={BackOne}
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
        name="View Hive"
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
        {props => <ViewHive route={route.params} />}
      </Tab.Screen>

      {/* Apiary Edits */}
      <Tab.Screen
        name="Disease Scan"
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicon name="ios-scan" color={color} size={size} />
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
        {props => <DiseaseScan route={route.params} />}
      </Tab.Screen>

      <Tab.Screen
        name="Hive Report"
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="database" color={color} size={size} />
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
        {props => <HiveReport route={route.params} />}
      </Tab.Screen>
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
