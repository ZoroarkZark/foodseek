import React, {useContext, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { apiKey } from './.env'
import { LocationContext } from '../../context/LocationContext'
import { ScrollView } from 'react-native-gesture-handler'

export const AutocompleteSearchBar = ( { placesRef } ) => {
  const { search, keyword, setKeyword } = useContext( LocationContext )
  const [ key, setKey ] = useState( keyword )
  
  // useEffect( () => {
  //   setKeyword(key)
  // }, [keyword])
  
  return (
    <ScrollView>
    <GooglePlacesAutocomplete
      placeholder='address, neighborhood, city, state or zip'
      query={{ key: apiKey }}
      fetchDetails={true}
      onPress={( data, details = null ) => {
        console.log( data, details )

      }}
      onFail={error => console.log( error )}
      onNotFound={() => console.log( 'no results...' )}
      textInputProps={{
          value: key,
          autoFocus: true,
          // onSubmitEditing: () => search(key),
          onChangeText: value => setKey(value)
      }}
      ref={placesRef}
    />
    </ScrollView>
  )
}
