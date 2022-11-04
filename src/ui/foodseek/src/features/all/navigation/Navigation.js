/* exported navigation */
import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthenticationContext } from '../../../context/AuthenticationContext'

import { AppNavigation } from './AppNavigation'
import { AuthenticationNavigation } from '../../common/navigation/stack-navigation'

// Returns a navigation container for the top-level navigator in the application.
export const Navigation = () => {
    const { isAuthenticated } = useContext(AuthenticationContext)
    return (
        // container wraps top-level navigator, linking it to the app environment
        <NavigationContainer>
          { isAuthenticated ? <AppNavigation /> : <AuthenticationNavigation /> }
        </NavigationContainer>
    )
}
