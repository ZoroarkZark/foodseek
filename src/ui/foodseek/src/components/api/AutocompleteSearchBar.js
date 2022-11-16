import React, {  useContext, useEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
// import { apiKey } from './.env'
import { getLatitude, getLongitude } from 'geolib'
import { AuthenticationContext } from '../../context/AuthenticationContext'
import { LocationContext } from '../../context/LocationContext'



// Wrapper for the GooglePlacesAutocomplete component
export const AutocompleteSearchBar = props => {
  const { googlePlacesKey: apiKey } = useContext( AuthenticationContext )
  const {location} = useContext(LocationContext)
  const { setKeyword, setLocation, search, style, ...rest } = props
  const [ key, setKey ] = useState( '' )                                                    // stores the search key
  const [ coordinates, setCoordinates ] = useState( location )     // stores the coordinate set {latitude: , longitude: }

  // the function called when the user selects an autocomplete option from the dropdown results
  const onPress = ( data, details = null ) => {
    let { description = null } = data
        let latitude = getLatitude( details.geometry.location )       // get the coordinates from the google places API response
        let longitude = getLongitude( details.geometry.location )     
        let location = {latitude: latitude, longitude: longitude }    // format the location object with the coordinates
        if ( description !== null ) {                                 // copies the selected item to the search box
          setKey(description)
        }
        if ( location !== null ) {                                    // sets the coordinates in this component (triggers the setLocation function)
          setCoordinates(location)
        }
        search()                                                      // the search handler function used to trigger an update in the parent component
  } // end onPress

  // updates the parents state to the current keyword in the search input
  useEffect( () => {
    setKeyword(key)
  }, [ key, setKey ] )
  

  // updates the parents state to reflect the current search coordinates 
  useEffect( () => {
    if ( !coordinates ) return
    setLocation(coordinates)
  }, [coordinates, setCoordinates])

  return (
    <GooglePlacesAutocomplete
      keepResultsAfterBlur={true}
      placeholder="address, neighborhood, city, state or zip"
      query={{ key: apiKey }}
      fetchDetails={true}
      onPress={( data, details = null ) => onPress(data, details)}
      onFail={(error) => console.log(error)}
      onNotFound={() => console.log('no results...')}
      keyboardShouldPersistTaps={'handled'}
      textInputProps={{
        value: key,
        autoFocus: false,
        onSubmitEditing: () => search(),
        onChangeText: ( value ) => setKey( value ),
        ...{...rest}
      }}
    />
  )
}
