/* exported navigation */
import React, {useContext} from 'react'
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { ThemeContextProvider } from '../../../context/ThemeContext'
import { FavoritesContextProvider } from '../../../context/FavoritesContext'
import { VendorNavigator } from '../../vendor/navigation/drawer-navigation'
import { SeekerNavigator } from '../../seeker/navigation/drawer-navigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { FoodCardProvider, LocationProvider } from '../../../context'

// Returns a navigation container for the type of user in the application.
export const AppNavigation = () => {
    const { isVendor } = useContext(AuthenticationContext)
    return (
        // container wraps top-level navigator (BottomTabsNavigator), linking it to the app environment
        
    <ThemeContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LocationProvider>
            <FoodCardProvider>
            { isVendor
                ? <VendorNavigator />
                : <FavoritesContextProvider>
                    <SeekerNavigator />
                  </FavoritesContextProvider>
            }
                </FoodCardProvider>
                </LocationProvider>
        </GestureHandlerRootView>
    </ThemeContextProvider>
    )
}
