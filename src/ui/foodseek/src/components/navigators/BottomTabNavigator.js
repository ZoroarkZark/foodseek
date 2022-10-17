import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackNavigator, LoginStackNavigator, PostsStackNavigator, SettingsStackNavigator, UserStackNavigator } from '../../screens';
import { Ionicons } from '@expo/vector-icons';
const BottomTab = createBottomTabNavigator();

const BottomTabsNavigator = () => {
    return (
        <BottomTab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: "#fff",
            },
        }}
        >
            <BottomTab.Screen name="Login" component={ LoginStackNavigator }
            options={{
                tabBarLabel: "Login",
                tabBarIcon: () => (<Ionicons name="log-in-outline"/>),
              }}
              />
            <BottomTab.Screen name="Home" component={ HomeStackNavigator } 
            options={{
                tabBarLabel: "Home",
                tabBarIcon: () => (<Ionicons name="home-outline"/>),
              }}
              />
            <BottomTab.Screen name="Posts" component={ PostsStackNavigator } 
            options={{
                tabBarLabel: "Posts",
                tabBarIcon: () => (<Ionicons name="document-text-outline" />),
              }}
              />
            <BottomTab.Screen name="User" component={ UserStackNavigator } 
            options={{
                tabBarLabel: "User",
                tabBarIcon: () => (<Ionicons name="person-outline" />),
              }}
              />
            <BottomTab.Screen name="Search" component={ SettingsStackNavigator } 
            options={{
                tabBarLabel: "Settings",
                tabBarIcon: () => (<Ionicons name="options-outline" />),
              }}
              />
        </BottomTab.Navigator>
    );
}

export {BottomTabsNavigator}
