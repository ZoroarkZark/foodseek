import React, { useContext, useState } from 'react'
import { LocationContext } from '../../context/LocationContext'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { apiKey } from './.env'

export const AutocompleteSearchBar = ({ style }) => {
  const { search, keyword, setKeyword } = useContext(LocationContext)
  const [key, setKey] = useState(keyword)
  // useEffect( () => {
  //   setKeyword(key)
  // }, [keyword])
  return (
    <GooglePlacesAutocomplete
      placeholder="address, neighborhood, city, state or zip"
      query={{ key: apiKey }}
      fetchDetails={true}
      onPress={(data, details = null) => {
        console.log(data, details)
      }}
      onFail={(error) => console.log(error)}
      onNotFound={() => console.log('no results...')}
      keyboardShouldPersistTaps={'handled'}
      textInputProps={{
        value: key,
        autoFocus: true,
        // onSubmitEditing: () => search(key),
        onChangeText: (value) => setKey(value),
      }}
    />
  )
}
