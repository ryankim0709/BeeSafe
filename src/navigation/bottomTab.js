import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import Home from '../screens/home.js';
import CreateApiary from '../screens/createApiary.js';

const Tab = createBottomTabNavigator();

{
  /* screenOptions: {tabBarShowLabel: false, headerShown: false tabBarStyle:{}} */
}
{
  /*tabBarBadge*/
}

export default function BottomTabNavigator({route}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:false,
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: '#F5F5F5',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
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
            <Icon name="plus-circle" color={color} size={size} />
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
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
  console.log(routeName);

  if (routeName == 'Home') return 'flex';
  if (routeName == 'Create Apiary') return 'none';
};
