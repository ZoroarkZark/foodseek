import React from 'react'
import 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// import screens for stack navigator
import * as screen from '../screens'

const Stack = createNativeStackNavigator() // Create stack navigator component

// Returns a stack navigator for the screens Login/Register/Forgot Password related by authentication flow
export const AuthenticationNavigation = ({linking}) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Login" //LOGIN PAGE SCREEN
                component={screen.Login}
                options={{ title: 'Login' }}
            />
            <Stack.Screen
                name="Signup" //SIGNUP PAGE SCREEN
                component={screen.Signup}
                options={{ title: 'Signup' }}
            />
            <Stack.Screen
                name="ForgotPassword" //FORGOT PASSWORD PAGE SCREEN
                component={screen.ForgotPassword}
                options={{ title: 'Forgot Password' }}
            />
            <Stack.Screen
                name="ChangePassword" 
                component={screen.ChangePassword}
            />
        </Stack.Navigator>
    )
}

