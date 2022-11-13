import React, { useRef } from 'react'
import 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BackButton } from '../../../components/common/backbutton'
// import screens for stack navigators
import * as screen from '../screens'
import { AutocompleteSearchBar } from '../../../components/api/GooglePlacesInput'

const Stack = createNativeStackNavigator() // Create stack navigator component

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
    const searchRef = useRef()
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="Posts" 
                searchRef={searchRef}
                component={screen.Posts}
                options={( { navigation } ) => ( {
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
export const FavoritesNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="App"
            screenOptions={( { navigation } ) => ( {
                headerShown: true,
                headerTitle: '',
                headerTransparent: true,
                headerLeft: () => (
                        <BackButton
                            style={{
                                left: 6,
                                color: 'grey',
                                fontSize: 30,
                                size: 30,
                            }}
                            onPress={() => {
                                console.log( 'working' )
                                navigation.goBack()
                            }}
                        />
                    ),
            })}>
            <Stack.Screen
                name="Favorites"
                component={screen.Favorites}
                options={( { navigation } ) => ( {
                    
                } )}
                    />
                    
        </Stack.Navigator>
    )
}

