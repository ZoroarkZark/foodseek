import React from 'react';
import MapView from 'react-native-maps'
import { View } from 'react-native';


// map displays user's location if permission has been given
const ViewMap = ( { region, style, showUser} ) => {
  return (
    <View style={style ? style.container : {}} > 
          <MapView style={style.component} showsUserLocation={showUser ? true : false} followsUserLocation={false} region={region} />
    </View >
    )
}

export default ViewMap
