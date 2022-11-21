import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthenticationContext } from './AuthenticationContext'
import { cardRequest, cardTransform, cardReserve } from './foodcard.service'
import { LocationContext } from './LocationContext'


export const FoodCardContext = createContext()

export const FoodCardProvider = ( { children } ) => {

  const [ cards, setCards ] = useState( [] )
  const [ loading, setLoading ] = useState( false )
  const [ error, setError ] = useState( null )
  const { location, setLocation } = useContext( LocationContext )
  const [ speed, setSpeed ] = useState( 1.1176 ) // TODO add speed context given in meters per second
  const [unit, setUnit] = useState('mi') // TODO add preferred units context
  const { user, jwt } = useContext( AuthenticationContext )
  const [ orders, setOrders ] = useState( [] )
  
  // called to save a card to the user's order list
  const add = (card) => {
    setOrders([...orders, card])
    // console.log(vendor.id); commented out when not testing
}

// removes a card from the user's order list
const remove = (card) => {
    const update = orders.filter((c) => c.id !== card.id) // copy the list without the vendor being removed
    setOrders(update) // set the current orders to the updated version
  }
  
  // stores a card to the user's order list
  const storeOrders = async (value, id) => {
    try {
        const json = JSON.stringify(value) // convert value to json string
        await AsyncStorage.setItem(`@orders-${id}`, json) // attempt to save the value to orders
    } catch (err) {
        console.log('Save error when saving orders ', err)
    }
}

// loads the user's order list
const loadOrders = async (id) => {
    try {
        const value = await AsyncStorage.getItem(`@orders-${id}`) // retrieves a string value given the key for the users orders list
        return value !== null ? setOrders(JSON.parse(value)) : null // if retrieval was successful return the parsed json object else return empty
    } catch (err) {
        console.log('Read error when loading orders ', err)
    }
  }

  // function used to reserve a card for a user
  const onReserve = ( cardId ) => {
    setLoading( true )
    try {
      cardReserve( user.id, cardId, jwt )
        .then( ( response ) => { 
          // insert what to do to check if the response is valid
          console.log(response)
        return response
      } )
        .then( ( result ) => {
        setError( null )
        setLoading( false )
        let card = cards.filter((c) => cardId === c.id)
        add( card )      // updates orders list to add this card
        return result
      } )
      .catch( ( err ) => {
        setLoading( false )
        setError( err )
      })
    } catch ( err ) {
      console.log( err )
    }
  }


  // function calls the server with JWT token to request and retrieve cards
  const retrieveCards = ( loc, jwt, setResult=setCards ) => {
    setLoading( true )
    // setCards( [] )
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



  
  
  

    // loads the users orders into context if the value for user has been updated
    useEffect(() => {
        if (user) {
            loadOrders(user.id)
      }
      console.log(user)
    }, [user])

    // stores the orders list if the orders has been updated, or the user has been updated

    useEffect(() => {
        if (user) {
            storeOrders(orders, user.id)
        }
    }, [orders, user]) // handles condition where user is not logged in, but still is adding orders

    useEffect( () => {
      if ( location ) {
        refreshCards( location )
      }
    }, [ location, setLocation ] )
  
  

  return (
    <FoodCardContext.Provider value={{cards, onRefresh: refreshCards, loading, setLoading, error, onReserve, orders}}>
      {children}
    </FoodCardContext.Provider>
  )
}