import React from 'react'
import { Keyboard } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'

// Wrap around outermost View component of the application to enable dismissal of keyboard whenever the screen is pressed
export const ViewDismissKeyboard = ( { children } ) => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
            {children}
        </TouchableWithoutFeedback>
    )
}

// Wrapper for outermost scroll view component of the application to enable dismissal of keyboard whenever the screen apart from buttons and text is pressed
export const ScrollViewDismissKeyboard = ( { children } ) => { 
    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            {children}
        </ScrollView>
    )
}
