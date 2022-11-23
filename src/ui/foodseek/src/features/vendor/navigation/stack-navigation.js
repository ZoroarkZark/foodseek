import React from 'react'
import 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import *  as screen from '../screens'
import { Title } from '../../../components/common'
// import individual screens for stack navigators

const Stack = createNativeStackNavigator() // Create stack navigator component

// Returns a stack navigator for the history of posts for that vendor
export const ViewPost = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PostHistory" 
                component={screen.PostHistory}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ExpandedPost" 
                component={screen.ExpandPost}
                options={{ headerShown: false }}
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
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Camera"
                component={screen.Cam}
                options={{ headerShown: false }}
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
                options={{ headerShown: false }}
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
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Hours"
                component={screen.HoursOfOperationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )  
}
