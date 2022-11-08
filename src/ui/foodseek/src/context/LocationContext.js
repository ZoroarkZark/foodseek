import React, { createContext, useEffect } from 'react'


export const LocationContext = createContext()

export const LocationProvider = ( { children } ) => {

  const [ location, setLocation ] = useState( null )
  const [ loading, setLoading ] = useState( false )
  const [ error, setError ] = useState( null )
  const [ keyword, setKeyword ] = useState( 'Santa Cruz' )
  
  const onSearch = (searchKey) => {
    setLoading( true )
    setKeyword(searchKey)
  }

  useEffect( () => {
    if ( !keyword.length ) {
      return
    }
    try {
      locationRequest(keyword.toLowerCase())
      .then( (results) => { 
        return locationTransform( results )
      } )
      .then( ( loc ) => {
        setError( null )
        setLoading( false )
        setLocation(loc)
      } )
      .catch( ( err ) => {
        setLoading( false )
        setError( err )
      })
    } catch ( err ) {
      console.log(err)
    }
    
  },[keyword])




  return (
    <LocationContext.Provider value={{ location, loading, error, keyword, search: onSearch }}>
      {children}
    </LocationContext.Provider>
  )
}
