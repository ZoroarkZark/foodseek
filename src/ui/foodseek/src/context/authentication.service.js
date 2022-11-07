/* eslint-disable no-unused-vars */
import { seekerAvatar } from '../../assets'
import { fetchRequest } from '../scripts/deviceinterface'

// function sends login request to the server with email and password
export const loginRequest = ( email, password ) => {
    let path = 'login'
    return fetchRequest( path, "post", { email: email, pass: password } )
        .then( (response) => {
            if ( response.success != 1 ) {
                throw new Error(response.issues.msg, {cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        } )
        .catch( ( error ) => { throw error } )
}

// function sends signup request to the server with email, password and form data
export const signupRequest = (email, password, data) => {
    // send the request here and recieve back a promise

    // temporary placeholder for promise
    const promise = new Promise((resolve, reject) => {
        resolve({
            email: email,
            id: '123',
            isVendor: true,
            un: data.bn ? data.bn : data.un,
            avatar: seekerAvatar,
        })
    })

    return promise
}

// communicate to server that this login has ended
export const logoutRequest = () => {
    // send the request here and recieve back nothing
}
