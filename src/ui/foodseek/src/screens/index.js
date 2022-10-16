import React from 'react';
import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

//
import { LoginScreen } from './login';
import { HomeScreen } from './home';
import { UserScreen } from './user';
import { ResponseScreen } from './response';
import { SettingsScreen } from './settings';
import { PostsScreen } from './posts';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const LoginStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
                name="Login" //LOGIN PAGE SCREEN
                component={LoginScreen}
                options={{ title: 'Login' }}
            />
            <Stack.Screen
                name="Response" //RESPONSE PAGE SCREEN
                component={ResponseScreen}
                options={{ title: 'Response' }}
            />
        </Stack.Navigator>
    );  
}

export {LoginStackNavigator};


const HomeStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
                name="Home" //HOME PAGE SCREEN
                component={HomeScreen}
                options={{ title: 'Home Screen' }}
            />
        </Stack.Navigator>
    );  
}

export {HomeStackNavigator};

const UserStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
                name="User" //USER PAGE SCREEN
                component={UserScreen}
                options={{ title: 'User Screen'}}
            />
        </Stack.Navigator>
    );  
}

export {UserStackNavigator};


const SettingsStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
            name="Settings" //RESPONSE PAGE SCREEN
            component={SettingsScreen}
            options={{ title: 'Settings' }}
            />
        </Stack.Navigator>
    );  
}

export {SettingsStackNavigator};


const PostsStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
            name="Settings" //RESPONSE PAGE SCREEN
            component={PostsScreen}
            options={{ title: 'Posts' }}
            />
        </Stack.Navigator>
    );  
}

export {PostsStackNavigator};



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



