import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'react-native-rapi-ui'
import ViewMap from '../components/common/map.js'
import { DeviceInstance } from '../scripts/deviceinterface.js'
import { map as style } from '../style/styleSheet.js'
import * as loc from 'expo-location'

// experimenting with map ui and expo-location after accepting permission get check terminal for your location in LOG
export const UserScreen = ({ navigation, route }) => {
    const [ test, setTest ] = useState( {} )
    const [ view, setView ] = useState( true )
    const [ location, setLocation ] = useState( null )
    const [ error, setError ] = useState( null )
    
    // requests location once after asking for permission to access it
    useEffect( () => {
        ( async () => {
            let { status } = await loc.requestForegroundPermissionsAsync()
            if ( status !== 'granted' ) {
                setError( 'Location permissions were denied' )
                return
            }
            let location = await loc.getCurrentPositionAsync()
            setLocation(location)
        }) ()
    }, [] )
    
    // assign the text variable in case of error or if a valid location was received
    let text = 'Loading...'
    if ( error ) {
        text = error
    } else if ( location ) {
        text = JSON.stringify( location )
    }
    
    // when the location or error text is updated... print to console.log
    useEffect( () => {
        console.log( text )
    }, [ text ] )
    
    return (
        <View>
            <Text>Device Interface Testing</Text>
                <Button
                    text="Test Get"
                    onPress={() => {

                        alert("button hit");
                        DeviceInstance.test("GET",null, (err, response) => {
                            if(err){
                                setTest(err);
                                return;
                            }
                            setTest(response);
                            
                        })
                }}
                />
            <Text>{JSON.stringify(test)}</Text>
    
        </View>
        );
    
    
}