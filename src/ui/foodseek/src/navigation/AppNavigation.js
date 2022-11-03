/* exported navigation */
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { BottomTabsNavigator } from './BottomTabNavigator'
import { AuthenticationContextProvider } from '../context/AuthenticationContext'
import { ThemeContextProvider } from '../context/ThemeContext'
import { FavoritesContextProvider } from '../context/FavoritesContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Returns a navigation container for the top-level navigator in the application.
export const AppNavigation = () => {
    return (
        // container wraps top-level navigator (BottomTabsNavigator), linking it to the app environment
        <NavigationContainer>
            <ThemeContextProvider>
                <AuthenticationContextProvider>
                    <FavoritesContextProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <BottomTabsNavigator />
                        </GestureHandlerRootView>
                    </FavoritesContextProvider>
                </AuthenticationContextProvider>
            </ThemeContextProvider>
        </NavigationContainer>
    )
}
