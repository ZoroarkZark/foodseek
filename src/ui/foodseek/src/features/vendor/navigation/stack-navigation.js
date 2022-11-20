import React from 'react'
import 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import *  as screen from '../screens'
// import individual screens for stack navigators

const Stack = createNativeStackNavigator() // Create stack navigator component

// Returns a stack navigator for the history of posts for that vendor
export const ViewPost = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="PostHistory" 
                component={screen.PostHistory}
                options={{ title: 'Post History' }}
            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for create post flow
export const CreatePost = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="PostFood"
                component={screen.CreatePost}

            />
            <Stack.Screen
                name="Camera"
                component={screen.Cam}

            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for the storefront view of the vendor
export const StoreProfile = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="StoreProfile" 
                component={screen.StoreProfile}
                options={{ title: 'StoreProfile' }}
            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for the store settings
export const StoreSettings = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="StoreSettings" 
                component={screen.StoreSettings}
                options={{ title: 'StoreSettings' }}
            />
            <Stack.Screen
                name="Hours"
                component={screen.HoursOfOperationScreen}
                options={{title: 'Hours'}}
            />
        </Stack.Navigator>
    )  
}
