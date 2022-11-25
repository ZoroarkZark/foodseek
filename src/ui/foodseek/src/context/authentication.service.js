/* eslint-disable no-unused-vars */
import { fetchRequest } from '../scripts/deviceinterface'
import { defaultAvatar, vendorAvatar } from '../../assets'

// function sends login request to the server with email and password
export const loginRequest = ( email, password ) => {
    let path = 'login'
    return fetchRequest( path, "post", { email: email, pass: password } )
        .then( ( response ) => {
            console.log('this is the response from login: ',response)
            if ( response.success != 1 ) {
                throw new Error(response.issues.msg, {cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        } )
        .catch( ( error ) => { throw error } )
}


// function sends signup request to the server with email, password and form data
export const signupRequest = (email, password, data) => {
    let path = 'signup'
    const { vendor } = data
    const formData = vendor === '1' ? data.vend : data.seek
    return fetchRequest( path, "post", { email: email, pass: password, vendor: vendor, formData: formData } )
        .then( (response) => {
            if ( response.success != 1 ) {
                throw new Error(response.issues.msg, {cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        } )
        .catch( ( error ) => { throw error } )
}


// request to have the server handle a request to reset a user's password
export const resetPasswordRequest = (email) => {
    let path = 'fgpass'
    return fetchRequest( path, "post", { email: email } )
        .then( (response) => {
            if ( response.success != 1 ) {
                throw new Error(response.issues.msg, {cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        } )
        .catch( ( error ) => { throw error } )
}



// request to update the password for this account
export const patchPasswordRequest = (tok, password) => {
    let path = 'newpass'
    return fetchRequest( path, "post", { tok: tok, pass: password } )
        .then( (response) => {
            if ( response.success != 1 ) {
                throw new Error(response.issues.msg, {cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        } )
        .catch( ( error ) => { throw error } )
}

export const setPushToken = (token, email) => {
    let path = 'setPushToken'
    return fetchRequest (path, 'post', {token: token, email: email} )
        .then( (response) => {
            if (response.success != 1) {
                throw new Error(response.issues.msg, {cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return true
        })
        .catch( ( error ) => { throw error } )
}


export const userTransform = ( data ) => {
    const mon = {
        open: {
            day: 0,
            time: '0000'
        },
        close: {
            day: 0,
            time: '0000'
        }
    }
    
    const tue =  {
        open: {
            day: 1,
            time: '0000'
        },
        close: {
            day: 1,
            time: '0000'
        }
    }
    
    const wed =  {
        open: {
            day: 2,
            time: '0000'
        },
        close: {
            day: 2,
            time: '0000'
        }
    }
    
    const thu =  {
        open: {
            day: 3,
            time: '0000'
        },
        close: {
            day: 3,
            time: '0000'
        }
    }
    
    const fri =  {
        open: {
            day: 4,
            time: '0000'
        },
        close: {
            day: 4,
            time: '0000'
        }
    }
    
    const sat =  {
        open: {
            day: 5,
            time: '0000'
        },
        close: {
            day: 5,
            time: '0000'
        }
    }
    
    const sun =  {
        open: {
            day: 6,
            time: '0000'
        },
        close: {
            day: 6,
            time: '0000'
        }
    }
    
    const periods = [ mon, tue, wed, thu, fri, sat ]
    const signature = ( props ) => {
            const ONE_HOUR = 3600000
            const { uri } = props
            const temp = {
                ...props,
                uri: '',
                name: 'Taro Milk Tea',
                tags: [ 'boba', 'tea', 'taro', '7 Leaves' ],
                expiration: new Date() + ONE_HOUR,
                timestamp: new Date(),
                utc_offset: 480,
                avatar: vendorAvatar,
                banner: defaultAvatar,
                location: {latitude: 37.3372871, longitude: -122.0146879},
                businessName: '7 Leaves Cafe',
                businessAddress:"<span class=\"street-address\">11111 N Wolfe Rd</span>, <span class=\"locality\">Cupertino</span>,<span class=\"region\">CA</span> <span class=\"postal-code\">95014</span>, <span class=\"country-name\">USA</span>",
                bphone: { international_phone_number: "+1 408-982-3534", formatted_phone_number: "(408) 982-3534"},
                bemail: 'nspicer@ucsc.edu',
                cuisine: 'Bubble Tea, Coffee & Tea, Macarons',
                opening_hours: { open_now: true, periods: periods, weekday_text: ["Monday: 7:00 AM – 10:00 PM", "Tuesday: 7:00 AM – 10:00 PM", "Wednesday: 7:00 AM – 10:00 PM", "Thursday: 7:00 AM – 10:00 PM", "Friday: 7:00 AM – 10:00 PM", "Saturday: 8:00 AM – 10:00 PM", "Sunday: 8:00 AM – 10:00 PM"] } 
            }
            if ( uri ) temp.uri = uri
            const { name, tags, expiration, timestamp, utc_offset } = temp
            const {avatar, banner, location: {loc}, businessName: {bn}, businessAddress: {ba}, bphone, bemail, cuisine, opening_hours} = temp
        
            return (
                {
                    details: {
                        ...props,
                        item: { uri, name, tags, expiration, timestamp, utc_offset },
                        vendor: {
                            avatar,
                            banner,
                            loc,
                            bn,
                            ba,
                            bphone,
                            bemail,
                            cuisine,
                            opening_hours
                        }
                    }
                } )
        }
    const {user, vendor} = data
    return {
        ...user,
        id: user,
        isVendor: vendor ? vendor === 1 : false,  // TODO add linked image require kept as just the seekers avatar just during testin
        favorites: [], // TODO: enable check if favorite false just during testing
        signature:  signature
    }
}











