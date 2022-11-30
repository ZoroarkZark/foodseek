import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthenticationContext } from './AuthenticationContext'
import { cardRequest, cardTransform, cardReserve, cardUpload, cardUpdate, getUserReserved, cancelOrder} from './foodcard.service'
import { LocationContext } from './LocationContext'

export const CreateExpirationTime = ( timestamp, days=1 ) => {
  let expirationTime = new Date( timestamp )

  // comment the two lines below to test for 2 minute expiration
  expirationTime.setHours( 0, 0, 0, 0 )
  expirationTime.setTime( expirationTime.getTime() + days * 86400000 )
  // uncomment below to test for 2 minute expiration
  // expirationTime.setMinutes(expirationTime.getMinutes()+2)

  return expirationTime
}

export const FoodCardContext = createContext()

export const FoodCardProvider = ( { children } ) => {

  const [ cards, setCards ] = useState( [] )
  const [ loading, setLoading ] = useState( false )
  const [ error, setError ] = useState( null )
  const { location, setLocation } = useContext( LocationContext )
  const { user, jwt, isVendor } = useContext( AuthenticationContext )
  const [ orders, setOrders ] = useState( [] )
  
  // called to save a card to the user's order list
  const add = (card) => {
    setOrders([...orders, card])
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
  const onReserve = ( id, card ) => {
    setLoading( true )
    try {
      cardReserve( user.id, id, jwt )
        .then( ( response ) => { 
          response.success = true
          return response
      } )
        .then( ( result ) => {
          if ( result.success ) {
          onViewActiveOrders()
        }
        setError( null )
        setLoading( false )
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

    

  const onUpdate = ( id, key, value ) => {
    setLoading( true )
    try {
      cardUpdate( id, key, value, jwt )
        .then( ( response ) => { 
          console.log(response)
          response.success = true
          return response
      } )
        .then( ( result ) => {
          if ( result.success ) {        }
        setError( null )
        setLoading( false )
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



  /**
   * Upload a card to the server
   * @param {base64String} image : the base64 encoded image from create-post
   * @param {object} card_data : dictionary for the card info, (i think we are only passing item name and tags from the create post screen)
   */
  const uploadCard = ( image, card_data, setResult ) => {
   setLoading( true )
   const loc = [ location.latitude, location.longitude ] // get location
   const timestamp = new Date(); // declare as a date for now
   timestamp.setHours(24); // set expiration time to midnight

  const vendor    = user.id; // get the user id from auth context
  const tags      = card_data.tags; // card data 
  const item = card_data.item // card data


   const upload_card = {
    item: item,
    loc: loc,
    vendor: vendor,
    tags: tags,
    timestamp: CreateExpirationTime(new Date()),
   }

   try{ // upload the card
    cardUpload(jwt,upload_card,image)
    .then ((response) => {
      if ( response.success == 1 ) {
        setResult({ error: null, success: response.success })
      }
      else{
        setError( { cause: 'uploadCard/cardUpload', message: "Couldn't upload card, please try again...", issues: response.issues } ) // Server Rejected Card
        setResult( { error: error, success: response.success } ) 
      }
    } ).catch((err)=> {throw err})
   }
   catch ( err ) {
     setError(err)
     setLoading(false)
    }
  }


  // function calls the server with JWT token to request and retrieve cards
  const retrieveCards = ( {loc = location, jwt, setResult=setCards} = {} ) => {
    setLoading( true )
    // setCards( [] )
    try {

      cardRequest( loc, jwt, user.id, isVendor )
        .then( ( results ) => { 
          if ( results ) return cardTransform( {loc: loc, results: results.data.cards})      // transforms incoming data into what we can use
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


  // gets the current orders for the seeker
  const onViewActiveOrders = () => {
    setLoading( true )
    setOrders([])
    try {
      getUserReserved( user.id, jwt )
        .then( ( results ) => { 
          if ( results ) return cardTransform( {loc: location, results: results.data.cards} )      // transforms incoming data into what we can use
      } )
      .then( ( arr ) => {
        setError( null )
        setLoading( false )
        setOrders( arr )      // updates the state with the provided function
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

  // function used to reserve a card for a user
  const onCancel = ( card ) => {
    const { id } = card
    setLoading( true )
    try {
      cancelOrder( user.id, id, jwt )
        .then( ( response ) => { 
          response.success = true
          return response
      } )
        .then( ( result ) => {
          if ( result.success ) {
          onViewActiveOrders()
        }
        setError( null )
        setLoading( false )
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


  // function wraps the retrieval function may not be necessary?
  const refreshCards = ({coords=location, setResult = null} = {}) => {
    retrieveCards( {loc: coords, jwt: jwt, setResult: setResult} )
  }

    // loads the users orders into context if the value for user has been updated
    useEffect(() => {
        if (user) {
            loadOrders(user.id);
 
            
      }
    }, [user])

    // stores the orders list if the orders has been updated, or the user has been updated

    useEffect(() => {
        if (user) {
            storeOrders(orders, user.id)
        } 
    }, [orders, user]) // handles condition where user is not logged in, but still is adding orders

    useEffect( () => {
      if ( location ) { 
        if(!isVendor) refreshCards( location )
      }
    }, [ location, setLocation ] )
  
    useEffect( () => {
      if ( !user ) return 
      onViewActiveOrders()
    }, [] )
  
  

  return (
    <FoodCardContext.Provider value={{cards, onRefresh: refreshCards, loading, setLoading, error, onReserve, orders, uploadCard: uploadCard, onUpdate, onViewActiveOrders, onCancel}}>
      {children}
    </FoodCardContext.Provider>
  )
}
