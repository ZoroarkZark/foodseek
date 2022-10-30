/* eslint-disable no-unused-vars */
import { avatar } from '../../assets'
// function sends login request to the server with email and password
export const loginRequest = (email, password) => {
    // send the request here and recieve back a promise

    // temporary placeholder for promise
    const promise = new Promise((resolve, reject) => {
        resolve({
            email: email,
            id: '123',
            type: 'vendor',
            un: 'LoggedInUser',
            avatar: avatar,
        })
    })

    return promise
}

// function sends signup request to the server with email, password and form data
export const signupRequest = (email, password, data) => {
    // send the request here and recieve back a promise

    // temporary placeholder for promise
    const promise = new Promise((resolve, reject) => {
        resolve({
            email: email,
            id: '123',
            type: data.acc,
            un: data.bn ? data.bn : data.un,
            avatar: avatar,
        })
    })

    return promise
}

// communicate to server that this login has ended
export const logoutRequest = () => {
    // send the request here and recieve back nothing
}
