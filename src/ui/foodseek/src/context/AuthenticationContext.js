import React, { createContext, useEffect, useState, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import {
    loginRequest,
    signupRequest,
    setPushToken,
    resetPasswordRequest,
    patchPasswordRequest,
    userTransform,
} from './authentication.service'

// asynchronus controller of push token notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})

// function used to register for push notifications
export async function registerForPushNotificationsAsync() {
    let token

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!')
            return
        }
        token = (await Notifications.getExpoPushTokenAsync()).data
        console.log(token)
    } else {
        alert('Must use physical device for Push Notifications')
    }

    return token
}

export const AuthenticationContext = createContext()

import { defaultAvatar } from '../../assets'

// AuthenticationContextProvider: provides context and mutator functions for account authentication for the current user session (login/logout/account services)
export const AuthenticationContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false) // create state holder for setting the loading state (while waiting for request responses show loading behavior)
    const [ gplacesKey, setGPlacesKey ] = useState( null )
    const [ jwt, setJWT ] = useState( '' )          // TODO: store more securely jwt
    const [user, setUser] = useState(null) // create state holder for user (currently logged in)
    const [ error, setError ] = useState( '' ) // create state holder for storing error state for logging in

    const [ avatar, setAvatar ] = useState( defaultAvatar )

    const [ expoPushToken, setExpoPushToken ] = useState( '' )
    const [ pushAllowed, setPushAllowed ] = useState( false )
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()

    // checks if incoming user is valid or null and updates the user
    // eslint-disable-next-line no-unused-vars
    const checkAuthState = (usr) => {
        if (usr) {
            setUser(usr)
            setLoading(false)
        }
    }


    /*
     onLogin: account login handler
     input: email (str) password (str)
     output: none
     caller: response to onPress event in Login screen
     states updated (all local):
        error: set to thrown Error object (str)
        gPlacesKey: google api key served from backend storage
        jwt: token for authenticating application communication with server
        user: object for storing account details for a logged in user
        loading: state for loading behavior while the service is being completed
     */
    const onLogin = (email, password) => {
        setLoading(true) // set loading status = true while making request for login
        loginRequest(email, password)
            .then((response) => {
                setGPlacesKey( response.gplacesKey )
                setJWT( response.jwt )
                setUser( userTransform( response ) ) // pretend its parsed for now
                setLoading(false)
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
            .then((response) => {
                if (response.message === 'Succsesful signup') {
                    // lol!
                    onLogin(email, password)
                }
            })
            .catch((err) => {
                setLoading(false)
                setError(err.toString())
            })
    }


    // sends a request to the server to reset an account with the given email
    const onResetPassword = (email) => {
        setLoading(true) //Now loading.
        // return error for data checks client side
        if (!email) {
            setError('Error: no email provided when resetting password')
            return
        }
        resetPasswordRequest(email)
            .then((response) => {
                if (response.message === 'Reset request recieved') {
                    setLoading(false)
                    return
                }
            })
            .catch((err) => {
                setLoading(false)
                setError(err.toString())
            })
    }


    // submits new password to update the db
    const onNewPassword = (email, tok, password) => {
        setLoading(true)
        // return error for data checks client side
        if (!email) {
            setError('Error: no email provided when resetting password')
            return
        }
        // call signup request and set user
        patchPasswordRequest(tok, password)
            .then((response) => {
                if (response.message === 'Password successfully updated') {
                    onLogin(email, password)
                }
            })
            .catch((err) => {
                setLoading(false)
                setError(err.toString())
            })
    }

    // function called when logging out of the application
    const onLogout = () => {
        setJWT(null) //On logout, remove both the JWT and the current user. No longer used.
        setUser(null)
    }


    useEffect( () => {
        if ( !pushAllowed ) {
            setExpoPushToken( '' )
            return
        }
        registerForPushNotificationsAsync().then((token) =>
            setExpoPushToken(token)
        )

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification)
            })

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response)
                }
            )

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            )
            Notifications.removeNotificationSubscription(
                responseListener.current
            )
        }
    }, [pushAllowed, setPushAllowed])

    useEffect(() => {
        if (!user) return
        setPushToken(user.email, expoPushToken, jwt)
    }, [user, setUser, expoPushToken, setExpoPushToken])

    return (
        <AuthenticationContext.Provider
            value={{
                isAuthenticated: !!user,
                isVendor: user ? user.isVendor : false,
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
                pushAllowed,
                setPushAllowed
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    )
}
