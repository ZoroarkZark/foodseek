//Implementing the search input field
import React from 'react'
import { TextInput } from 'react-native-rapi-ui'

const SearchInput = ({
    children,
    value,
    onChangeText,
    onSubmitEditing,
    placeholder = 'Search...',
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
        placeholder={children ? children : placeholder}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
    ></TextInput>
)

export default SearchInput