import { getDistance, convertDistance, isValidCoordinate, convertSpeed, getCoordinateKeys } from 'geolib'




// returns the distance from here to there in the given units defaulted to miles
export const computeDistance = ( start, end, unit ) => {

  // function returns an object { latitude: x, longitude: y } with validated latitude and longitude coordinates for distance computations
  const formatCoordinate = ( input ) => {
    try {
      if ( !isValidCoordinate( input ) ) {                                    // checks if input had valid coordinates
        const { latitude: lat, longitude: lng } = getCoordinateKeys( input )  // get keys for coordinates
        const { [ lat ]: latitude, [ lng ]: longitude } = input               // assign latitude and longitude with the keys
        return ({ latitude: latitude, longitude: longitude })                // construct and return valid coordinates
      }
      return input
    }catch ( error ) { 
      throw new Error( `Error when formatting ${input} for distance computation.`, { cause: error } ) // throw error indicating which coordinate is the problem
    }
  } // end formatCoordinate definition

  try {
    let result = getDistance( formatCoordinate( start ), formatCoordinate( end ) )  // compute the distance
    return convertDistance( result, unit )                                          // return the result in the right units
  }
  catch ( error ) { 
    throw error
  }
}

// returns distance in given units and time
// expecting objects with latitude and longitude properties
// speed given in meters per second, returns in minutes
// unit options are (cm, m, km, mi, ft, ...)
export const computeTravel = ( start, end, speed, unit = 'mi' ) => {
  let time = 0
  try {
    let distance = computeDistance( start, end, unit )
    if ( speed > 0 ) {
      time = ( distance * 60 ) / ( convertSpeed( speed, 'mph' ) ) // compute time it will take to travel in minutes
    } else {
      time = Infinity
      throw new Error('Error when computing travel time, required: speed > 0')
    }
    return {distance: distance, time: time}
  } catch ( error ) {
    throw error
  }
}