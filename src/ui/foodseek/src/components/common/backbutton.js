import React, { useContext } from 'react'
import { AntDesign} from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'


// favorite button toggles to empty or full based on if the corresponding vendor is a user favorite, defaults to style for the food cards
export const BackButton = ( {
    navigation,
    style = {
        color: 'grey',
        fontSize: 22,
        size: 22,
    },
}) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={style}
        >
            <AntDesign
                name='left'
                color={style ? style.color : 'grey'}
                style={style}
            />
        </TouchableOpacity>
    )
}

