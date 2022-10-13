import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { LoginScreen } from './login';
import { HomeScreen } from './home';
import { UserScreen } from './user';
import { ResponseScreen } from './response';
import { SettingsScreen } from './settings';


const Stack = createNativeStackNavigator();


export const AppNavigator = () => (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
    />
    <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
    />
    <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home Screen' }}
    />
    <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ title: 'User Screen'}}
    />
    <Stack.Screen
        name="Response"
        component={ResponseScreen}
        options={{ title: 'Response' }}
    />
    </Stack.Navigator>
    </NavigationContainer>
    )