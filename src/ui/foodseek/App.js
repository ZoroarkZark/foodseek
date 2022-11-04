// App.js: Application entry file.
import React from 'react'
import { Navigation } from './src/features/all/navigation/Navigation'
import { AuthenticationContextProvider } from './src/context/AuthenticationContext'
import { ThemeContextProvider } from './src/context/ThemeContext'

// context provider wrappers wrapping child (application)
export default function App() {
    return (
        <ThemeContextProvider>
            <AuthenticationContextProvider>
                <Navigation />
            </AuthenticationContextProvider>
        </ThemeContextProvider>
    )
}
