import { fetchRequest } from '../scripts/deviceinterface'
import { defaultAvatar, vendorAvatar } from '../../assets'

// function sends login request to the server with email and password
export const loginRequest = (email, password) => {
    let path = 'login'
    return fetchRequest(path, 'post', { email: email, pass: password })
        .then((response) => {
            console.log('this is the response from login: ', response)
            if (response.success != 1) {
                throw new Error(response.issues.msg, { cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        })
        .catch((error) => {
            throw error
        })
}

// function sends signup request to the server with email, password and form data
export const signupRequest = (email, password, data) => {
    let path = 'signup'
    const { vendor } = data
    const formData = vendor === '1' ? data.vend : data.seek
    return fetchRequest(path, 'post', {
        email: email,
        pass: password,
        vendor: vendor,
        formData: formData,
    })
        .then((response) => {
            if (response.success != 1) {
                throw new Error(response.issues.msg, { cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        })
        .catch((error) => {
            throw error
        })
}

export const setPushToken = (email, token, jwt) => {
    let path = 'setPushToken'
    console.log('setPushToken:  email: ', email, 'token: ', token, 'jwt:', jwt)

    return fetchRequest(path, 'post', { email: email, token: token, jwt: jwt })
        .then((response) => {
            if (response.success != 1) {
                throw new Error(response.issues.msg, { cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        })
        .catch((error) => {
            throw error
        })
}

// request to have the server handle a request to reset a user's password
export const resetPasswordRequest = (email) => {
    let path = 'fgpass'
    return fetchRequest(path, 'post', { email: email })
        .then((response) => {
            if (response.success != 1) {
                throw new Error(response.issues.msg, { cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        })
        .catch((error) => {
            throw error
        })
}

// request to update the password for this account
export const patchPasswordRequest = (tok, password) => {
    let path = 'newpass'
    return fetchRequest(path, 'post', { tok: tok, pass: password })
        .then((response) => {
            if (response.success != 1) {
                throw new Error(response.issues.msg, { cause: response.issues }) // throws an error if the server sends a response describing an error
            }
            return response.data
        })
        .catch((error) => {
            throw error
        })
}

// export const setPushToken = (token, email) => {
//     let path = 'setPushToken'
//     return fetchRequest (path, 'post', {token: token, email: email} )
//         .then( (response) => {
//             if (response.success != 1) {
//                 throw new Error(response.issues.msg, {cause: response.issues }) // throws an error if the server sends a response describing an error
//             }
//             return true
//         })
//         .catch( ( error ) => { throw error } )
// }

export const userTransform = (data) => {
    const { user, vendor } = data
    return {
        ...data,
        id: user,
        email: user,
        isVendor: vendor ? vendor == 1 : false, // TODO add linked image require kept as just the seekers avatar just during testin
        favorites: [], // TODO: enable check if favorite false just during testing
    }
}
