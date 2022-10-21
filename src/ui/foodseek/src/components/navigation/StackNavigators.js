import React from 'react';
import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// import individual screens for stack navigators
import { LoginScreen } from '../../screens/authentication/login';
import { HomeScreen } from '../../screens/home';
import { UserScreen } from '../../screens/user';
import { SignupScreen } from '../../screens/authentication/signup';
import { CameraScreen } from '../../screens/camera';
import { SettingsScreen } from '../../screens/settings';
import { EatSignupScreen } from '../../screens/authentication/eatersignup';
import { VenSignupScreen } from '../../screens/authentication/vendorsignup';
import { PostsScreen } from '../../screens/posts';
import { ForgotPasswordScreen } from '../../screens/authentication/forgotpassword';


const Stack = createNativeStackNavigator();     // Create stack navigator component
const Drawer = createDrawerNavigator();         // TODO: see below


// Returns a stack navigator for the screens Login/Register/Forgot Password related by authentication flow
export const LoginStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
                name="Login" //LOGIN PAGE SCREEN
                component={LoginScreen}
                options={{ title: 'Login' }}
            />
            <Stack.Screen
                name="Signup" //SIGNUP PAGE SCREEN
                component={SignupScreen}
                options={{ title: 'Signup' }}
            />
            <Stack.Screen
                name="Forgot Password" //FORGOT PASSWORD PAGE SCREEN
                component={ForgotPasswordScreen}
                options={{ title: 'Forgot Password' }}
            />
        </Stack.Navigator>
    );  
}

// Returns a stack navigator for the home screen
// Attempting to add Drawer Navigation to the Home Screen, once it is navigated to.  
export const HomeStackNavigator = () => {
    return(
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
    <Drawer.Screen
        name="SignUp" //SIGNUP DECISION PAGE
        component={SignupScreen}
        options={{ title: 'Signup Screen' }}
    />
    <Drawer.Screen
        name="EaterSignup" //EATER SIGNUP SCREEN
        component={EatSignupScreen}
        options={{ title: 'Eater Signup'}}
    />
    <Drawer.Screen
        name="VendorSignup" //EATER SIGNUP SCREEN
        component={VenSignupScreen}
        options={{ title: 'Vendor Signup'}}
    />
    </Drawer.Navigator>
    );  
}

// Returns a stack navigator for the User screen
export const UserStackNavigator = () => {
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

// Returns a stack navigator for the settings screen
export const SettingsStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
            />
        </Stack.Navigator>
    );  
}

// Returns a stack navigator for the settings screen
export const CameraStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
            name="Camera" 
            component={CameraScreen}
            options={{ title: 'Camera' }}
            />
        </Stack.Navigator>
    );  
}


// Returns a stack navigator for the post listing screens 
export const PostsStackNavigator = () => {
    return(
        <Stack.Navigator> 
            <Stack.Screen
            name="Posts" //RESPONSE PAGE SCREEN
            component={PostsScreen}
            options={{ title: 'Posts' }}
            />
        </Stack.Navigator>
    );  
}

