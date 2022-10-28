import React from 'react'
import { TextInput as TextInpt } from 'react-native-rapi-ui'

// simple text input component
const CustomTextInput = ({
    children,
    value,
    onChangeText,
    keyboardType = 'default',
    placeholder = 'type here...',
    style = {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
}) => (
    <TextInpt
        style={style}
        value={value}
        keyboardType={keyboardType}
        placeholder={children ? children : placeholder}
        onChangeText={onChangeText}
    ></TextInpt>
)

export default CustomTextInput
