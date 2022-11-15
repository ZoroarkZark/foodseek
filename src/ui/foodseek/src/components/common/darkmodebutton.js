import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ThemeContext } from '../../context/ThemeContext'

// favorite button toggles to empty or full based on if the corresponding vendor is a user favorite, defaults to style for the food cards
export const DarkModeButton = ({
    style = {
        color: 'grey',
        fontSize: 22,
        size: 22,
        textAlign: 'right',
    },
}) => {
    const { darkTheme, toggleTheme } = useContext(ThemeContext) // bring in the favorites contexts

    return (
        <TouchableOpacity
            onPress={() => toggleTheme()}
            style={style}
        >
            <Ionicons
                name={darkTheme ? 'ios-moon' : 'ios-moon-outline'}
                color={style ? style.color : 'black'}
                style={style}
            />
        </TouchableOpacity>
    )
}

