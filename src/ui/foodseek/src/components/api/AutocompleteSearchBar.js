import React, { useContext, useEffect, useState } from 'react'
import { LocationContext } from '../../context/LocationContext'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { apiKey } from './.env'
import { getCoordinateKeys, getLatitude, getLongitude } from 'geolib'


export const AutocompleteSearchBar = ({ setKeyword, setLocation, search, style }) => {
  const [ key, setKey ] = useState( '' )
  const [ coordinates, setCoordinates ] = useState( {} )
  
  useEffect( () => {
    setKeyword(key)
  }, [ key, setKey ] )
  
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
      onPress={( data, details = null ) => {

        let { description = null } = data

        let latitude = getLatitude( details.geometry.location )
        let longitude = getLongitude( details.geometry.location )
        let location = {latitude: latitude, longitude: longitude }
        if ( description !== null ) {  // sets the search box content to be the selected item from dropdown
          setKey(description)
        }
        if ( location !== null ) {  // sets the search box content to be the selected item from dropdown
          setCoordinates(location)
        }
        search()
      }}
      onFail={(error) => console.log(error)}
      onNotFound={() => console.log('no results...')}
      keyboardShouldPersistTaps={'handled'}
      textInputProps={{
        value: key,
        autoFocus: false,
        onSubmitEditing: () => search(),
        onChangeText: (value) => setKey(value),
      }}
    />
  )
}
