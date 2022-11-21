/* eslint-disable no-unused-vars */
import { getLatitude, getLongitude } from 'geolib'
import { useContext, useEffect, useState } from 'react'
import { seekerAvatar } from '../../assets'
import { fetchRequest, imgFetch } from '../scripts/deviceinterface'
import { computeTravel } from '../util'
import { Image } from 'react-native'
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


// function sets the payload as an object with the properties: id, loc [lat, lon], timestamp, uri, 
export const cardUpload = ( props ) => {
  const { jwt, item, loc, uri, tags, timestamp, details, vendor } = props
  return imgFetch({
    jwt: jwt,
    uri: uri,
    card: {
      item: item,
      vendor: vendor,
      loc: loc,
      tags: tags,
      timestamp: timestamp,
      // details: details
    }
  })
    .then( ( response ) => {
          if ( response.success != 1 ) {
              throw new Error(response.issues.msg, {cause: res.issues }) // throws an error if the server sends a response describing an error
        }

          return response.data
      } )
      .catch( ( error ) => { throw error } )

}


// maps incoming data into an array of card data 
export const cardTransform = async ( loc, speed, results = [], unit = 'mi' ) => {
      const mappedResults = results.map( ( card ) => {
        const travel = computeTravel( loc, card, speed, unit )        // compute values for travel string (distance and minutes)
        let min = (60 * travel.time % 60).toFixed(0)                  // get minutes
        let hour = ( travel.time / 60 ).toFixed( 0 )                      // get hours
        const {cuisine, item, tags, id, vendor, res, img_url } = card  // destructure object to get desired card properties
        // const image = Image.prefetch(img_url).then((res) => (res)).catch((err) => {return null})
        const image = img_url
        return {
        ...card,
        id: id,
        image: image ? image: seekerAvatar,  // TODO add linked image require kept as just the seekers avatar just during testing
        vendor: vendor ? { name: vendor} : { name: 'UH OH no vendor name'}, // name of the vendor
        favorite: false, // TODO: enable check if favorite false just during testing
        cuisine: cuisine, // genre/category of vendor menu, ||| original var: cuisine
        item: item, // name of the food item being posted ||| original var: item
        travel: `${travel.distance.toFixed(1)} mi`, // computed travel distance string format: 1.7 mi 
        time: `${hour > 0 ? `${hour} hr` : ''} ${min} min`, //time format: 16 min
        address: `25 Ferret Funland Rd, Bakersfield, California`,  // Fill in with address
        phoneNumber: "0001222112",  // Fill in with phone number
        reserved: res,
        tags: tags
      }
    } )
    return mappedResults
}