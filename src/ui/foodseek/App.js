// App.js: Application entry file.
import React, { useEffect, useState } from 'react'
import { Navigation } from './src/features/all/navigation/Navigation'
import { AuthenticationContextProvider } from './src/context/AuthenticationContext'
import { ThemeContextProvider } from './src/context/ThemeContext'
import * as Linking from 'expo-linking'
import { LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
// another deep linking thing
const prefix = Linking.createURL( '/' )
LogBox.ignoreLogs(['Constants.platform.ios.model','working with Linking to avoid creating a broken build'])
// context provider wrappers wrapping child (application)
export default function App () {

    const [ data, setData ] = useState( null )

    // used for linking by supplying configuration as a prop to navigation container
    const linking = {
        prefixes: [ prefix ],
        config: {
            screens: {
                ForgotPassword: 'forgotpassword',
                ChangePassword: 'changepassword'
            }
           
        }
    }

    // function handles the deep link response
    function handleDeepLink ( event ) {
        const parsed = Linking.parse( event.url )
        setData(parsed)
    }

    // listens for deep link being called either while app is running or not
    useEffect( () => {
        async function getInitialUrl () {
            const initialUrl = await Linking.getInitialURL() // returns null if not from deep link otherwise returns the deep link url
            if (initialUrl) setData(Linking.parse(initialUrl))
        }

        const data = Linking.addEventListener( 'url', handleDeepLink ) // only works if app was already running in background
        if ( !data ) {
            getInitialUrl() // works even from a cold start (app was not running in the background)
        }
        return () => data.remove()
        
    }, [] )
    
    return (
        <ThemeContextProvider>
            <AuthenticationContextProvider>
                <SafeAreaProvider>
                    <Navigation linking={linking} />
                </SafeAreaProvider>
            </AuthenticationContextProvider>
        </ThemeContextProvider>
    )
}
