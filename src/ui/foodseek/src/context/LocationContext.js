import React, { createContext, useEffect, useState } from 'react'
import * as Location from 'expo-location'

const SANTA_CRUZ_COORDINATES = { latitude: '36.974117', longitude: '-122.030792' }

export const LocationContext = createContext()

export const LocationProvider = ( { children } ) => {
  const [ deviceLocation, setDeviceLocation ] = useState( null )
  const [ location, setLocation ] = useState( SANTA_CRUZ_COORDINATES )
  const [ loading, setLoading ] = useState( false )
  const [ error, setError ] = useState( null )
  const [ keyword, setKeyword ] = useState( 'Santa Cruz' )
  const [coordinateKeys, setCoordinateKeys] = useState({latitude: 'latitude', longitude: 'longitude'})
  
  const onLocate = async () => {
    setLoading(true)
    try {
      Location.requestForegroundPermissionsAsync()
      .then( ( {status} ) => {
        if ( status !== 'granted' ) {
          throw new Error('Error: Request for foreground permissions not granted.')
        }
      } )
        .then( () => {
          return Location.getCurrentPositionAsync()
        } )
        .then( ( location ) => {
          setDeviceLocation( location )
          setLoading( false )
          return location
        } ).catch( ( err ) => {
          throw err
        }) 
    } catch ( err ) {
      console.log( err )
      setError( err )
      setLoading( false )
      console.log(error)
    }
  }



  const onSearch = (searchKeyword, searchLoc) => {
    setLoading( true )
    setKeyword( searchKeyword )
    setLocation( searchLoc )
  }


  // useEffect( () => {
  //   if ( !keyword.length ) {
  //     return
  //   }
  //   try {
  //     locationRequest(keyword.toLowerCase())
  //     .then( (results) => { 
  //       return locationTransform( results )
  //     } )
  //     .then( ( loc ) => {
  //       setError( null )
  //       setLoading( false )
  //       setLocation(loc)
  //     } )
  //     .catch( ( err ) => {
  //       setLoading( false )
  //       setError( err )
  //     })
  //   } catch ( err ) {
  //     console.log(err)
  //   }
    
  // },[keyword])




  return (
    <LocationContext.Provider value={{ deviceLocation, location, loading, error, keyword, setLocation, search: onSearch, getLocation: onLocate, coordinateKeys, setCoordinateKeys }}>
      {children}
    </LocationContext.Provider>
  )
}
