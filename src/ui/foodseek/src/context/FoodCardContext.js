import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from './AuthenticationContext'
import { cardRequest, cardTransform } from './foodcard.service'
import { LocationContext } from './LocationContext'
//import {LocationContext}

export const FoodCardContext = createContext()

export const FoodCardProvider = ( { children } ) => {

  const [ cards, setCards ] = useState( [] )
  const [ loading, setLoading ] = useState( false )
  const [ error, setError ] = useState( null )
  const { location, setLocation } = useContext( LocationContext )
  const [ speed, setSpeed ] = useState( 1.1176 ) // TODO add speed context given in meters per second
  const [unit, setUnit] = useState('mi') // TODO add preferred units context
  const { jwt } = useContext( AuthenticationContext )
  

  // function calls the server with JWT token to request and retrieve cards
  const retrieveCards = ( loc, jwt, setResult=setCards ) => {
    setLoading( true )
    setCards( [] )
    try {
      cardRequest( loc, jwt )
      .then( (results) => { 
        const { items } = results
        return cardTransform( loc, speed, JSON.parse(items), unit )     // transforms incoming data into what we can use
      } )
      .then( ( arr ) => {
        setError( null )
        setLoading( false )
        setResult( arr )      // updates the state with the provided function
        console.log(arr)
        return arr
      } )
      .catch( ( err ) => {
        setLoading( false )
        setError( err )
      })
    } catch ( err ) {
      console.log( err )
      return []
    }
  }

  // function wraps the retrieval function may not be necessary?
  const refreshCards = (loc=location, saveCards = null) => {
    retrieveCards( loc, jwt, saveCards )
  }

  
  useEffect( () => {
    if ( location ) {
      refreshCards( location )
    }
  }, [ location, setLocation ] )
  

  return (
    <FoodCardContext.Provider value={{cards, onRefresh: refreshCards, loading, setLoading, error}}>
      {children}
    </FoodCardContext.Provider>
  )
}