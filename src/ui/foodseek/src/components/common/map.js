import React from 'react';
import MapView from 'react-native-maps'
import { View } from 'react-native';


// map displays user's location if permission has been given
const ViewMap = ( { location, style } ) => {
    return (
        <View style={style ? style.container : {}} > 
            <MapView style={style.component} showsUserLocation={true} />
        </View >
    )
}

export default ViewMap
