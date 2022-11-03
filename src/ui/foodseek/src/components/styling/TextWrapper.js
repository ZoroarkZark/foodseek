import React, { useContext } from 'react'
import { Text } from 'react-native'
import { ThemeContextProvider, ThemeContext } from '../../context/ThemeContext'

const TextWrapper = ({ children, fontSize, textAlign }) => {
    const {darkTheme, toggleTheme} = useContext(ThemeContext);

    const style = {
            textAlign: textAlign ? textAlign : 'left',
            padding: 10,
            fontSize: fontSize ? fontSize : 25,
            color: darkTheme ? '#CCC' : '#333',
    }

    return (
        <Text style={style}>
            {children}
        </Text>
    )
}

export default TextWrapper