import React, { createContext, useContext , useState} from 'react'

export const ThemeContext = createContext()

export const ThemeContextProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(false)

    const toggleTheme = () => {
        setDarkTheme(prevDarkTheme => !prevDarkTheme)
        console.log(darkTheme)
    }

    return (
        <ThemeContext.Provider value={{darkTheme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}