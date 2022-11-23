import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeContextProvider, ThemeContext } from '../../context/ThemeContext'

const Container = ({ children, alignItems, ...rest }) => {
    const {darkTheme, toggleTheme} = useContext(ThemeContext);

    const style = {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 30,
            backgroundColor: darkTheme ? '#333' : '#F1EDF2',
            //alignItems: alignItems ? alignItems : 'left',
        }

    return (
        <View style={style} {...rest}>
            {children}
        </View>
    )
}

export default Container