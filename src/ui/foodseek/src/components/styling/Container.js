import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeContextProvider, ThemeContext } from '../../context/ThemeContext'

const Container = ({ children, alignItems }) => {
    const {darkTheme, toggleTheme} = useContext(ThemeContext);

        const style = {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 30,
            backgroundColor: darkTheme ? '#333' : '#F1EDF2',
            //alignItems: alignItems ? alignItems : 'left',
        }

    return (
        <View style={style}>
            {children}
        </View>
    )
}

export default Container