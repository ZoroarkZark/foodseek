import React from 'react'
import { Text } from 'react-native'

const Title = ({
    children,
    style = {
        alignSelf: 'center',
        paddingTop: 40,
        fontWeight: 'bold',
        fontSize: 40,
        size: 'h3',
    },
}) => {
    return (
        <Text fontWeight={style.fontWeight} style={style}>
            {children}
        </Text>
    )
}

export default Title
