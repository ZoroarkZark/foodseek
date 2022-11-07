/* exported navigation */
import React, {useContext} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { FavoritesContextProvider } from '../../../context/FavoritesContext'
import { VendorNavigator } from '../../vendor/navigation/tab-navigation'
import { SeekerNavigator } from '../../seeker/navigation/tab-navigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { FoodCardProvider } from '../../../context'


// Returns a navigation container for the type of user in the application.
export const AppNavigation = () => {
    const { isVendor } = useContext(AuthenticationContext)
    return (
        // container wraps top-level navigator (BottomTabsNavigator), linking it to the app environment
        
        <GestureHandlerRootView style={{ flex: 1 }}>
            <FoodCardProvider>
            { isVendor
                ? <VendorNavigator />
                : <FavoritesContextProvider>
                    <SeekerNavigator />
                  </FavoritesContextProvider>
            }
            </FoodCardProvider>
        </GestureHandlerRootView>
    )
}
