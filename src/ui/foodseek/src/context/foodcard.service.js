/* eslint-disable no-unused-vars */
import { getLatitude, getLongitude } from 'geolib'
import { seekerAvatar } from '../../assets'
import { fetchRequest, img } from '../scripts/deviceinterface'
import { computeTravel } from '../util'

// function sends login request to the server with email and password
export const cardRequest = ( loc, jwt, vendor, isVendor ) => {
  const latitude = getLatitude( loc )
  const longitude = getLongitude( loc )
  const path = isVendor ? 'vendor/list' : 'user/list'
  const payload = isVendor ? { vendor: vendor } : { loc: { lat: latitude, lon: longitude }}

  return fetchRequest( path, "post", { ...payload, jwt: jwt } )
    .then( ( response ) => {
          if ( response.success != 1 ) {
              throw new Error(response.issues.msg, {cause: res.issues }) // throws an error if the server sends a response describing an error
      }

          return response.data
      } )
      .catch( ( error ) => { throw error } )
}

// function sends login request to the server with email and password
export const cardReserve = ( user, id, jwt ) => {
  let path = 'user/reserve'
  return fetchRequest( path, "post", { user: user, id: id, jwt: jwt } )
    .then( ( response ) => {
          if ( response.success != 1 ) {
              throw new Error(response.issues.msg, {cause: res.issues }) // throws an error if the server sends a response describing an error
        }

          return response
      } )
      .catch( ( error ) => { throw error } )
}


// Takes in a user, foodcard id, key for data we are editing, and value to place, along with the stored jwt
export const cardUpdate = ( id, key, value, jwt ) => {
  let path = 'vendor/updateData'
  let passed_data = {
    [key]: value
  } // create a data object
  console.log('!!!!!!!!!!!!!!this is what is being sent to the server!!!!!!!!!!!!: ', passed_data, 'END OF WHAT IS BEING SENT TO THE SERVER')

  return fetchRequest( path, "post", { data: passed_data, id: id, jwt: jwt } )
    .then( ( response ) => {
          if ( response.success != 1 ) {
              throw new Error(response.issues.msg, {cause: res.issues }) // throws an error if the server sends a response describing an error
        }

          return response
      } )
      .catch( ( error ) => { throw error } )
}


export const cardUpload = (jwt,card, image) => {
  return img(jwt, card, image)
  .then( (response) => {
    return response;
  })
  .catch( (err) => {throw err;})
}

// {"data": "{\"image\":\"test\",\"cuisine\":\"test\",\"item\":\"Falafel Wrap\",\"tags\":\"test\"}", "id": 1, "img_url": null, "lat": 44.814, "lon": 20.4368, "res": "carlington", "timestamp": null, "vendor": null}
// maps incoming data into an array of card data 
export const cardTransform = ( loc, speed, results = [], unit = 'mi' ) => {
  console.log(loc)
  try {
    const mappedResults = results.map( ( card ) => {
      //console.log('cards: ','<<<<<',card,'>>>>>')
      const { id, data, lat: latitude, lon: longitude, res, timestamp, vendor, img_url } = card // destructure object to get desired card properties
      const card_coordinates = { latitude: latitude, longitude: longitude }
      const { image, cuisine, item, phoneNumber, address, tags } = JSON.parse( data )
      //console.log(tags) 
      const travel = computeTravel( loc, card_coordinates, speed, unit )        // compute values for travel string (distance and minutes)
      let min = (60 * travel.time % 60).toFixed(0)                  // get minutes
      let hour = (travel.time / 60).toFixed(0)                      // get hours
      return {
        ...card,
        id: id,
        img_url: img_url, 
        image: seekerAvatar,  //Placeholder image.
        vendor: { name: vendor }, // name of the vendor
        favorite: false, // TODO: enable check if favorite false just during testing
        cuisine: cuisine, // genre/category of vendor menu, ||| original var: cuisine
        item: item, // name of the food item being posted ||| original var: item
        travel: `${travel.distance.toFixed(1)} mi`, // computed travel distance string format: 1.7 mi 
        time: `${hour > 0 ? `${hour} hr` : ''} ${min} min`, //time format: 16 min
        address: address ? address : `25 Ferret Funland Rd, Bakersfield, California`,  // Fill in with address
        phoneNumber: phoneNumber ? phoneNumber : "000-010-0212",  // Fill in with phone number
        reserved: res,
        tags: tags
      }
    } )
    return mappedResults
  } catch ( error ) {
    console.log( error )
    throw error

  }

  
}