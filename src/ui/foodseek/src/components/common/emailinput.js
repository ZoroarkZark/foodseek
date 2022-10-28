import React from 'react'
import { TextInput } from 'react-native-rapi-ui'

// simple email input component
const EmailInput = ({
    children,
    value,
    onChangeText,
    placeholder = 'Enter email address...',
    style = {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
}) => (
    <TextInput
        style={style}
        value={value}
        keyboardType="email-address"
        placeholder={children ? children : placeholder}
        onChangeText={onChangeText}
    ></TextInput>
)

export default EmailInput
