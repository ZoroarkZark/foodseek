import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from './AuthenticationContext'
import { cardRequest, cardTransform } from './foodcard.service'
//import {LocationContext}

export const FoodCardContext = createContext()

export const FoodCardProvider = ( { children } ) => {

  const [ cards, setCards ] = useState( [] )
  const [ loading, setLoading ] = useState( false )
  const [ error, setError ] = useState( null )
  const [ location, setLocation ] = useState( { latitude: '36.974117', longitude: '-122.030792' } ) // TODO add location context
  const [ speed, setSpeed ] = useState( 1.1176 ) // TODO add speed context given in meters
  const [unit, setUnit] = useState('mi') // TODO add preferred units context
  const { jwt } = useContext( AuthenticationContext )
  
  const retrieveCards = ( loc, jwt ) => {
    setLoading( true )
    setCards( [] )
    try {
      console.log('hi')
      cardRequest( loc, jwt )
      .then( (results) => { 
        const { items } = results
        //console.log(JSON.stringify(items))
        return cardTransform( loc, speed, JSON.parse(items), unit )
      } )
      .then( ( arr ) => {
        setError( null )
        setLoading( false )
        setCards(arr)
      } )
      .catch( ( err ) => {
        setLoading( false )
        setError( err )
      })
    } catch ( err ) {
      console.log(err)
      
    }
    
  }

  const refreshCards = (loc=location) => {
    retrieveCards(location, jwt)
  }

  useEffect( () => {
    if ( location ) {
      retrieveCards( location, jwt )
      //(error) && console.error(error) // maybe prints out the error if not null
    }
  }, [ location ] )
  



  return (
    <FoodCardContext.Provider value={{cards, onRefresh: refreshCards, loading, error}}>
      {children}
    </FoodCardContext.Provider>
  )
}