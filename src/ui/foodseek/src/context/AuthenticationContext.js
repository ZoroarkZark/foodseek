import React, { createContext, useEffect, useState, useRef } from 'react'
import {
    loginRequest,
    signupRequest,
    setPushToken,
    logoutRequest,
    resetPasswordRequest,
    patchPasswordRequest,
    userTransform
} from './authentication.service'
import * as Notifications from 'expo-notifications' 
import * as Device from 'expo-device'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  export async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

export const AuthenticationContext = createContext()
import { defaultAvatar } from '../../assets'
// provides a wrapper for sharing global context and mutator functions for authentication of the user session (leading to a logged in or logged out status)
export const AuthenticationContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false) // create state holder for setting the loading state (while waiting for request responses show loading behavior)
    const [user, setUser] = useState(null) // create state holder for user (currently logged in)
    const [ error, setError ] = useState( '' ) // create state holder for storing error state for logging in
    const [ jwt, setJWT ] = useState( '' )          // TODO: store more securely jwt
    const [ avatar, setAvatar ] = useState( defaultAvatar )
    const [ gplacesKey, setGPlacesKey ] = useState( null )
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [ data, setData ] = useState( null )
    const notificationListener = useRef();
    const responseListener = useRef();



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
        loginRequest(email, password)
            .then( ( response ) => {
                // TODO: parse response.data
                if ( response.success === 0 ) {
                    throw new Error( response.issues.message, { cause: response.issues } )
                }
                setGPlacesKey(response.gplacesKey)
                setJWT(response.jwt)
                setUser( userTransform(response) ) // pretend its parsed for now 
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                setError(err.toString())
            })
    }

    // function called when signing up for an account
    const onSignup = (email, password, data) => {
        setLoading(true)
        // return error for data checks client side
        if (!data) {
            setError('Error: no data provided when creating account')
            return
        }
        // call signup request and set user
        signupRequest(email, password, data)
            .then( ( response ) => {
                if ( response.message === 'Succsesful signup' ) { // lol!
                    onLogin(email, password)
                }
            })
            .catch((err) => {
                setLoading(false)
                setError(err.toString())
            } )
    }

    // sends a request to the server to reset an account with the given email
    const onResetPassword = (email) => {
        setLoading(true)
        // return error for data checks client side
        if (!email) {
            setError('Error: no email provided when resetting password')
            return
        }
        // call signup request and set user
        resetPasswordRequest(email)
            .then( ( response ) => {
                if ( response.message === 'Reset request recieved' ) 
                { 
                    setLoading( false )
                    return
                }
            })
            .catch((err) => {
                setLoading(false)
                setError(err.toString())
            } )
    }

    // submits new password to update the db
    const onNewPassword = ( email, tok, password ) => {
        setLoading(true)
        // return error for data checks client side
        if (!email) {
            setError('Error: no email provided when resetting password')
            return
        }
        // call signup request and set user
        patchPasswordRequest(tok, password)
            .then( ( response ) => {
                if ( response.message === 'Password successfully updated' ) 
                { 
                    onLogin(email, password)
                }
            })
            .catch((err) => {
                setLoading(false)
                setError(err.toString())
            } )
    }


    // function called when logging out of the application
    const onLogout = () => {
        setJWT(null)
        setUser(null)
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, [])

      useEffect(() => {
        if (!user) return
        if (!expoPushToken) return
        setPushToken(user.email, expoPushToken, jwt)

      }, [user, setUser, expoPushToken, setExpoPushToken])

    

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
