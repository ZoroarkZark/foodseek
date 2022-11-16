import React, { useState, useEffect, useContext } from 'react'
import { Animated, Easing, Text, View } from 'react-native'
import ViewMap from '../../../../components/common/map.js'
import { map as style } from '../../../../style/styleSheet.js'
import { Ionicons } from '@expo/vector-icons'
import TextButton from '../../../../components/common/textbutton.js'
import { LocationContext } from '../../../../context/LocationContext.js'
import { Marker } from 'react-native-maps'
import { AuthenticationContext } from '../../../../context/AuthenticationContext.js'
import { useSharedValue } from 'react-native-reanimated'

// stretchy container will contain the search bar


const StretchyContainer = () => {
    const translateX = setVal( 0 )
    const isSliding = useSharedValue( false )
    
    const size = 
    

}

const searchStyle = {elevatedElement: {
    zIndex: 3, // works on ios
    elevation: 3, // works on android
  }}
export const Map = ( { navigation, route } ) => {
    const {user} = useContext(AuthenticationContext)
    const { deviceLocation, getLocation, setLocation } = useContext(LocationContext)
    const [showUser, setShowUser] = useState(false) // state used to show or hide user on map
    const [mapRegion, setMapRegion] = useState({
        // default to los angeles (so we can test an animated prop later)
        latitude: 34.059761,
        longitude: -118.276802,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    } )
    const [ origin, setOrigin ] = useState(
        {
            latitude: 34.059761,
            longitude: -118.276802
        }
    )

    // when the user presses the button to use the devices location, it updates the map with the location
    useEffect(() => {
        if (!deviceLocation) return
        const {
            coords: { longitude, latitude },
        } = deviceLocation
        setShowUser(true)
        setOrigin(
            {
                latitude: Number(latitude),
                longitude: Number(longitude),
            }
        )
        setMapRegion(
            {
            latitude: Number(latitude),
            longitude: Number(longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }
        )
        setLocation(deviceLocation)
    }, [deviceLocation])


    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={style.container}>
                <ViewMap
                    style={style}
                    showUser={showUser}
                    region={mapRegion}
                >
                    {mapRegion && <Marker coordinate={mapRegion} />} 
                </ViewMap>
            </View>
            <TextButton onPress={() => {
                getLocation()
                console.log(JSON.stringify(user))
            }}>
                <Ionicons name="location-outline" />
                <Text>Current Location</Text>
            </TextButton>
        </View>
    )
}
