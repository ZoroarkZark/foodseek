import React from 'react'
import { View, Image, Text } from 'react-native'

const Avatar = ({
    children,
    avatar,
    style = {
        width: 120,
        height: 120,
        borderRadius: 60,
        shadowColor: 'black',
        shadowOffset: { height: 3, width: 3 },
        shadowRadius: 6,
        shadowOpacity: 0.3,
    },
}) => {
    return (
        <View>
            <View style={{ ...style, elevation: 5 }}>
                <View style={{ ...style, overflow: 'hidden' }}>
                    <Image source={avatar} style={style}>
                        {children}
                    </Image>
                </View>
            </View>
        </View>
    )
}

export default Avatar
