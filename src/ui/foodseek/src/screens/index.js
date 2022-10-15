import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

//
import { LoginScreen } from './login';
import { HomeScreen } from './home';
import { UserScreen } from './user';
import { ResponseScreen } from './response';
import { SettingsScreen } from './settings';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const AppNavigator = () => (
    <NavigationContainer>
    <Stack.Navigator> 
    <Stack.Screen
        name="Login" //LOGIN PAGE SCREEN
        component={LoginScreen}
        options={{ title: 'Login' }}
    />
    <Stack.Screen
        name="Home" //HOME PAGE SCREEN
        component={HomeScreen}
        options={{ title: 'Home Screen' }}
    />
    <Stack.Screen
        name="User" //USER PAGE SCREEN
        component={UserScreen}
        options={{ title: 'User Screen'}}
    />
    <Stack.Screen
        name="Response" //RESPONSE PAGE SCREEN
        component={ResponseDrawer}
        options={{ title: 'Response' }}
    />
    </Stack.Navigator>
    </NavigationContainer>
    )

const ResponseDrawer = () => (
    <Drawer.Navigator>
    <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home Screen' }}
    />
    <Drawer.Screen
        name="User"
        component={UserScreen}
        options={{ title: 'User Screen'}}
    />
    <Drawer.Screen
        name="Settings" //SETTINGS PAGE SCREEN
        component={SettingsScreen}
        options={{ title: 'Settings' }}
    />
    </Drawer.Navigator>
)