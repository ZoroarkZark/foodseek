import React, { createContext, useState } from 'react'
import {
    loginRequest,
    signupRequest,
    setPushToken,
    logoutRequest,
    resetPasswordRequest,
    patchPasswordRequest,
    userTransform
} from './authentication.service'

export const AuthenticationContext = createContext()
import { defaultAvatar } from '../../assets'
// provides a wrapper for sharing global context and mutator functions for authentication of the user session (leading to a logged in or logged out status)
export const AuthenticationContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false) // create state holder for setting the loading state (while waiting for request responses show loading behavior)
    const [user, setUser] = useState(null) // create state holder for user (currently logged in)
    const [ error, setError ] = useState( '' ) // create state holder for storing error state for logging in
    const [ jwt, setJWT ] = useState( '' ) 
    const [ avatar, setAvatar ] = useState( defaultAvatar )
    const [ gplacesKey, setGPlacesKey ] = useState( null )
    

    // checks if incoming user is valid or null and updates the user
    // eslint-disable-next-line no-unused-vars
    const checkAuthState = (usr) => {
        if (usr) {
            setUser(usr)
            setLoading(false)
        }
    }

    // function called when logging into an account
    const onLogin = (email, password) => {
        setLoading(true) // set loading status = true while making request for login
        loginRequest(email, password) //Make a login request with email and password
            .then( ( response ) => { //Check for a response.
                if ( response.success === 0 ) { //If the response does not come with a success...
                    throw new Error( response.issues.message, { cause: response.issues } ) //Throw an error regarding the issues
                }
                setGPlacesKey(response.gplacesKey) //We have a location Google Places token!
                setJWT(response.jwt) //Set the new JWT, from the response information.
                setUser( userTransform(response) ) // pretend its parsed for now 
                setLoading(false) //No longer loading by the end of this.
            })
            .catch((err) => { //Catch an error if it pops up.
                setLoading(false) //No longer loading by the end of this.
                setError(err.toString()) //The error will be set to the error given.
            })
    }

    // function called when signing up for an account
    const onSignup = (email, password, data) => {
        setLoading(true) //Now loading.
        // return error for data checks client side
        if (!data) { //If data doesn't exist...
            setError('Error: no data provided when creating account') //Error: No data, leave
            return
        }
        // call signup request and set user
        signupRequest(email, password, data)
            .then( ( response ) => { //Check for a response.
                if ( response.message === 'Succsesful signup' ) { // Signup is done if you get a success!
                    onLogin(email, password) //Go ahead and login!
                }
            })
            .catch((err) => { //Catch an error if it pops up.
                setLoading(false) //No longer loading by the end of this.
                setError(err.toString()) //The error will be set to the error given.
            } )
    }

    // sends a request to the server to reset an account with the given email
    const onResetPassword = (email) => {
        setLoading(true) //Now loading.
        // return error for data checks client side
        if (!email) {
            setError('Error: no email provided when resetting password')
            return
        }
        // call signup request and set user
        resetPasswordRequest(email)
            .then( ( response ) => { //Check for a response.
                if ( response.message === 'Reset request recieved' ) // Reset is ready if you get a success!
                { 
                    setLoading( false ) //No longer loading by the end of this, leave
                    return 
                }
            })
            .catch((err) => { //Catch an error if it pops up.
                setLoading(false) //No longer loading by the end of this.
                setError(err.toString()) //The error will be set to the error given.
            } )
    }

    // submits new password to update the db
    const onNewPassword = ( email, tok, password ) => {
        setLoading(true) //Now loading.
        // return error for data checks client side
        if (!email) {
            setError('Error: no email provided when resetting password')
            return
        }
        // call signup request and set user
        patchPasswordRequest(tok, password)
            .then( ( response ) => { //Check for a response.
                if ( response.message === 'Password successfully updated' ) // Password is changed if you get a success!
                { 
                    onLogin(email, password)
                }
            })
            .catch((err) => { //Catch an error if it pops up.
                setLoading(false) //No longer loading by the end of this.
                setError(err.toString()) //The error will be set to the error given.
            } )
    }


    // function called when logging out of the application
    const onLogout = () => {
        setJWT(null) //On logout, remove both the JWT and the current user. No longer used.
        setUser(null)
    }

    return (
        <AuthenticationContext.Provider
            value={{
                isAuthenticated: !!user,
                isVendor: user ? user.isVendor: false,
                jwt,
                loading,
                user,
                avatar,
                error,
                googlePlacesKey: gplacesKey,
                onResetPassword,
                onNewPassword,
                onLogin,
                onSignup,
                onLogout,
                setUser,
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    )
}
