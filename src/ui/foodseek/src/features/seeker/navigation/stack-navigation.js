import React from 'react'
import 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomDrawerContent from '../../../components/navigation/CustomDrawerContent'
// import screens for stack navigators
import * as screen from '../screens'
import { nav } from '../../../style/styleSheet'

const Stack = createNativeStackNavigator() // Create stack navigator component
const Drawer = createDrawerNavigator() // TODO: see below


// Returns a stack navigator for the User screen
export const MapNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="MapView" 
                component={screen.Map}
            />
        </Stack.Navigator>
    )
}


// Returns a stack navigator for the post listing screens
export const PostsNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="Posts" 
                component={screen.Posts}
                options={( { navigation, route } ) => ( {
                    
                } )}
            />
            <Stack.Screen
                name="ExpandedPost" 
                component={screen.ExpandPost}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for the post listing screens
export const OrderNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="OrderList" 
                component={screen.Orders}
            />
        </Stack.Navigator>
    )
}


// Returns a stack navigator for the post listing screens
export const SearchNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="Search" 
                component={screen.Search}
            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for the post listing screens
export const SettingsNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="SeekerSettings" 
                component={screen.SeekerSettings}
            />
        </Stack.Navigator>
    )
}


// Returns a stack navigator for the post listing screens
export const FavoritesNavigator = ({navigation}) => {
    return (
        <Stack.Navigator
        screenOptions={{
                headerShown: false,
                headerBackVisible: true,
        }}>
            <Stack.Screen
                name="Favorites" 
                component={screen.Favorites}
            />
        </Stack.Navigator>
    )
}

