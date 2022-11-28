// App.js: Application entry file.
import React, { useState, useEffect, useRef } from 'react'
import { Navigation } from './src/features/all/navigation/Navigation'
import { AuthenticationContextProvider } from './src/context/AuthenticationContext'
import { ThemeContextProvider } from './src/context/ThemeContext'
import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications' 
import * as Device from 'expo-device'
import { LogBox, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
// another deep linking thing
const prefix = Linking.createURL( '/' )
LogBox.ignoreLogs(['Constants.platform.ios.model','working with Linking to avoid creating a broken build'])

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

// context provider wrappers wrapping child (application)
export default function App () {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [ data, setData ] = useState( null )
    const notificationListener = useRef();
    const responseListener = useRef();


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




    // used for linking by supplying configuration as a prop to navigation container
    const linking = {
        prefixes: [ prefix ],
        config: {
            screens: {
                ForgotPassword: 'forgotpassword',
                ChangePassword: 'changepassword'
            }
           
        }
    }

    // function handles the deep link response
    function handleDeepLink ( event ) {
        const parsed = Linking.parse( event.url )
        setData(parsed)
    }

    // listens for deep link being called either while app is running or not
    useEffect( () => {
        async function getInitialUrl () {
            const initialUrl = await Linking.getInitialURL() // returns null if not from deep link otherwise returns the deep link url
            if (initialUrl) setData(Linking.parse(initialUrl))
        }

        const data = Linking.addEventListener( 'url', handleDeepLink ) // only works if app was already running in background
        if ( !data ) {
            getInitialUrl() // works even from a cold start (app was not running in the background)
        }
        return () => data.remove()
        
    }, [] )
    
    return (
        <ThemeContextProvider>
            <AuthenticationContextProvider>
                <SafeAreaProvider>
                    <Navigation linking={linking} />
                </SafeAreaProvider>
            </AuthenticationContextProvider>
        </ThemeContextProvider>
    )
}



async function registerForPushNotificationsAsync() {
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