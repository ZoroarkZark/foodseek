import React, { useContext } from 'react'
import { StyleSheet, View, Button} from 'react-native'
import { ThemeContextProvider, ThemeContext } from '../../context/ThemeContext'

const TextWrapper = ({ children }) => {
    const {darkTheme, toggleTheme} = useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: darkTheme ? '#333' : '#CCC',
            alignItems: 'left',
            justifyContent: 'left',
        },
        text: {
            padding: 10,
            fontSize: 25,
            color: darkTheme ? '#CCC' : '#333',
        },
        buttonContainer: {
            padding: 10,
            fontSize: 25,
            backgroundColor: 'blue',
        },
    })

    return (
        <View style={styles.buttonContainer}>
            { children }
        </View>
    )
}

export default TextWrapper