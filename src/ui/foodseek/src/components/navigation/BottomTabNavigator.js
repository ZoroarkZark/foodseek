import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // used for tab icons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { 
  HomeStackNavigator, 
  LoginStackNavigator, 
  PostsStackNavigator, 
  SettingsStackNavigator, 
  UserStackNavigator,
  CameraStackNavigator,
} from './StackNavigators'; // import all stack navigators for nesting


// add bottom tab navigation to the application
const BottomTab = createBottomTabNavigator(); 

// function returns a bottom tab navigator component with (nested stack navigators in) tabs: login, home, posts, user and settings
const BottomTabsNavigator = () => {
    return (
      <BottomTab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
        },
      }}>
        <BottomTab.Screen name="LoginTab" component={ LoginStackNavigator }
        options={{
          tabBarLabel: "Login",
          tabBarIcon: () => (<Ionicons name="log-in-outline"/>),
        }}
        />
        <BottomTab.Screen name="HomeTab" component={ HomeStackNavigator }
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => (<Ionicons name="home-outline"/>),
        }}
        />
        <BottomTab.Screen name="PostsTab" component={ PostsStackNavigator }
        options={{
          tabBarLabel: "Posts",
          tabBarIcon: () => (<Ionicons name="document-text-outline" />),
        }}
        />
        <BottomTab.Screen name="UserTab" component={ UserStackNavigator }
        options={{
          tabBarLabel: "User",
          tabBarIcon: () => (<Ionicons name="person-outline" />),
        }}
        />
        <BottomTab.Screen name="SettingsTab" component={ SettingsStackNavigator }
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: () => (<Ionicons name="options-outline" />),
        }}
        />
        <BottomTab.Screen name="CameraTab" component={ CameraStackNavigator }
        options={{
          tabBarLabel: "Camera",
          tabBarIcon: () => (<Ionicons name="camera-outline" />),
        }}
        />
      </BottomTab.Navigator>
    );
}

export {BottomTabsNavigator}
