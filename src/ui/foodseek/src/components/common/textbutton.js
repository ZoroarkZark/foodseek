import React from 'react'
import { Button } from 'react-native-paper'

const TextButton = ({
    onPress,
    children,
    style = {
        color: 'black',
    },
}) => (
    <Button
        type="text"
        uppercase={false}
        color={style.color}
        compact={true}
        onPress={onPress}
        style={style}
    >
        {children}
    </Button>
)

export default TextButton
