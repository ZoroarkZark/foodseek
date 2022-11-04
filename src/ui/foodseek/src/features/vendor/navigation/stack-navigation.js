import React from 'react'
import 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import *  as screen from '../screens'
// import individual screens for stack navigators

const Stack = createNativeStackNavigator() // Create stack navigator component

// Returns a stack navigator for the history of posts for that vendor
export const ViewPost = () => {
    return (
        <Stack.Navigator>
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
        <Stack.Navigator>
            <Stack.Screen
                name="PostFood"
                component={screen.CreatePost}
                options={{ title: 'Post Food' }}
            />
            <Stack.Screen
                name="Camera"
                component={screen.Camera}
                options={{ title: 'Camera' }}
            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for the storefront view of the vendor
export const StoreProfile = () => {
    return (
        <Stack.Navigator>
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
        <Stack.Navigator>
            <Stack.Screen
                name="StoreSettings" 
                component={screen.StoreSettings}
                options={{ title: 'StoreSettings' }}
            />
        </Stack.Navigator>
    )
}
