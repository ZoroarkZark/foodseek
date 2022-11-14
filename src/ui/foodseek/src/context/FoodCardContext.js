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
  
  const retrieveCards = ( loc, jwt, setResult=setCards ) => {
    setLoading( true )
    setCards( [] )
    try {
      cardRequest( loc, jwt )
      .then( (results) => { 
        const { items } = results
        return cardTransform( loc, speed, JSON.parse(items), unit )
      } )
      .then( ( arr ) => {
        setError( null )
        setLoading( false )
        setResult( arr )
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

  const refreshCards = (loc=location, saveCards = null) => {
    retrieveCards( loc, jwt, saveCards )
  }

  useEffect( () => {
    if ( location ) {
      refreshCards( location )
    }
  }, [ location, setLocation ] )
  

  return (
    <FoodCardContext.Provider value={{cards, test: setCards, onRefresh: refreshCards, loading, error}}>
      {children}
    </FoodCardContext.Provider>
  )
}