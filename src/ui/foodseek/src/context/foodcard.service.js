/* eslint-disable no-unused-vars */
import { getLatitude, getLongitude } from 'geolib'
import { useContext } from 'react'
import { seekerAvatar } from '../../assets'
import { fetchRequest } from '../scripts/deviceinterface'
import { computeTravel } from '../util'

// function sends login request to the server with email and password
export const cardRequest = ( loc, jwt ) => {
  let path = 'user/list'
  const latitude = getLatitude( loc )
  const longitude = getLongitude( loc )
  return fetchRequest( path, "post", { loc: { lat: latitude, lon: longitude}, jwt: jwt } )
    .then( ( response ) => {
          if ( response.success != 1 ) {
              throw new Error(response.issues.msg, {cause: res.issues }) // throws an error if the server sends a response describing an error
        }

          return response.data
      } )
      .catch( ( error ) => { throw error } )
}


// maps incoming data into an array of card data 
export const cardTransform = ( loc, speed, results = [], unit = 'mi' ) => {

  try {
      //console.log(JSON.stringify(results))
      const mappedResults = results.map( ( card ) => {
        const travel = computeTravel( loc, card, speed, unit )        // compute values for travel string (distance and minutes)
        let min = (60 * travel.time % 60).toFixed(0)                  // get minutes
        let hour = (travel.time / 60).toFixed(0)                      // get hours
        const { id, vendor, data: { cuisine }, data: { item }, res } = card  // destructure object to get desired card properties
      return {
        ...card,
        id: id,
        image: seekerAvatar,  // TODO add linked image require kept as just the seekers avatar just during testing
        vendor: { name: "Fergus the Ferret's Funland" }, // name of the vendor
        favorite: false, // TODO: enable check if favorite false just during testing
        cuisine: "Fish", // genre/category of vendor menu, ||| original var: cuisine
        item: "Fishy sticks", // name of the food item being posted ||| original var: item
        travel: `${travel.distance.toFixed(1)} mi`, // computed travel distance string format: 1.7 mi 
        time: `${hour > 0 ? `${hour} hr` : ''} ${min} min`, //time format: 16 min
        address: `25 Ferret Funland Rd, Bakersfield, California`,  // Fill in with address
        phoneNumber: "0001222112",  // Fill in with phone number
        reserved: res,
        tags: [vendor, cuisine, item]
      }
    } )
    return mappedResults
  } catch ( error ) {
    console.log( error )
    throw error

  }

  
}