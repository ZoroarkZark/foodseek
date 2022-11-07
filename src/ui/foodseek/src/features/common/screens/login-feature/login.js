import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeProvider, Layout, Text, Button } from 'react-native-rapi-ui'
import { AuthenticationContext } from '../../../../context/AuthenticationContext'
import {
    TextButton,
    Title,
    PasswordInput,
    EmailInput,
    ScrollViewDismissKeyboard,
} from '../../../../components/common'

// ATTENTION: THIS IS ONLY A TESTING Development build... to be removed at release

import { DrawerLayout } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'
import { fetchRequest } from '../../../../scripts/deviceinterface'
import { vendorAvatar, seekerAvatar } from '../../../../../assets'


export const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, onLogin, setUser, error } = useContext( AuthenticationContext )
    const [ready, setReady] = useState(false)

    // Login function called with the user's email and password
    async function login() {
        setLoading(true)
        onLogin(email, password)
    }

    useEffect( () => {
        if ( !password ) return
        if ( !email ) return
        login()
    }, [ready])

    // ** EXPERIMENT HERE ** This is for adding test buttons and stuff edit this all you want add buttons
    // idc just leave the other one alone lol
    const TestScreen = () => {
        return (
            <View
                style={{
                    flex: 6,
                    paddingHorizontal: 20,
                    paddingTop: 30,
                }}
            >
                <Title>Login</Title>
                <Text>Email</Text>
                <EmailInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                >
                    Enter email...
                </EmailInput>
                <Text style={{ marginTop: 15 }}>Password</Text>
                <PasswordInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                >
                    Enter password...
                </PasswordInput>

                <Button
                    text={loading ? 'Loading' : 'Continue'}
                    onPress={() => {
                        // I deleted what ever was here during testing stuff
                        login()
                    }}
                    style={{ marginTop: 20, marginBottom: 20 }}
                    //disabled={loading}
                />
                <TextButton
                    style={styles.textButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    Create Account
                </TextButton>
                <TextButton
                    style={styles.textButton}
                    onPress={() => navigation.navigate('Forgot Password')}
                >
                    Forgot Password?
                </TextButton>

                <Button
                    text={
                        !error
                            ? 'Mock Vendor Login'
                            : 'EC2 Error: Press again...'
                    }
                    onPress={() => {
                        if (!error) {
                            setEmail('cal')
                            setPassword( '123' )
                            setReady(!ready)
                        } else {
                            setUser({
                                email: email ? email : 'ivetaCafe@ucsc.edu',
                                id: 'VID1234',
                                isVendor: true,
                                un: email ? email.split('@')[0] : 'Ivéta Cafe',
                                avatar: vendorAvatar,
                            })
                        }
                    }}
                    style={{ marginTop: 20, marginBottom: 20 }}
                    //disabled={loading}
                />
                <Button
                    text={
                        !error
                            ? 'Mock Seeker Login'
                            : 'EC2 Error: Press again...'
                    }
                    onPress={() => {
                        if ( !error ) {
                            setEmail('za')
                            setPassword( 'zu' )
                            setReady(!ready)
                        } else {
                            setUser({
                                email: email ? email : 'sammy@ucsc.edu',
                                id: 'SID456',
                                isVendor: false,
                                un: email
                                    ? email.split('@')[0]
                                    : 'SammyWhammy69',
                                avatar: seekerAvatar,
                            })
                        }
                    }}
                    style={{ marginTop: 20, marginBottom: 20 }}
                    //disabled={loading}
                />
                <Button
                    text="EC2 GET"
                    onPress={() => {
                        fetch(
                            'http://ec2-54-193-142-247.us-west-1.compute.amazonaws.com:3000/test'
                        )
                            .then((response) => response.json())
                            .then((data) => alert(JSON.stringify(data)))
                            .catch((err) => alert(err))
                    }}
                    style={{ marginTop: 5, marginBottom: 5 }}
                />
                <Button
                    text="ECT POST"
                    onPress={() => {
                        const t = fetchRequest(
                            'http://ec2-54-193-142-247.us-west-1.compute.amazonaws.com:3000/test',
                            'POST',
                            { test: '1234' }
                        )
                        t.then((res) => console.log(res))
                    }}
                />
            </View>
        )
    }

    // ** HANDLE WITH CARE ** This view is what we want to show during demonstrations
    //                       so only make changes that we want to see in the final
    //                       application
    const RealScreen = () => {
        return (
            <View
                style={{
                    flex: 6,
                    paddingHorizontal: 20,
                    paddingTop: 30,
                }}
            >
                <Title>Login</Title>
                <Text>Email</Text>
                <EmailInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                >
                    Enter email...
                </EmailInput>
                <Text style={{ marginTop: 15 }}>Password</Text>
                <PasswordInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                >
                    Enter password...
                </PasswordInput>

                <Button
                    text={loading ? 'Loading' : 'Continue'}
                    onPress={() => {
                        // I deleted what ever was here during testing stuff
                        login()
                    }}
                    style={{ marginTop: 20, marginBottom: 20 }}
                    //disabled={loading}
                />
                <TextButton
                    style={styles.textButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    Create Account
                </TextButton>
                <TextButton
                    style={styles.textButton}
                    onPress={() => navigation.navigate('Forgot Password')}
                >
                    Forgot Password?
                </TextButton>
            </View>
        )
    }


    return (
        <ThemeProvider theme="light">
            <Layout>
                <DrawerLayout
                    drawerType="slide"
                    renderNavigationView={RealScreen}
                    drawerWidth={Dimensions.get('screen').width}
                    drawerPosition={DrawerLayout.positions.Left}
                    drawerBackgroundColor="#fff"
                >
                    <ScrollViewDismissKeyboard>
                        <TestScreen />
                    </ScrollViewDismissKeyboard>
                </DrawerLayout>
            </Layout>
        </ThemeProvider>
    )
}

// export const Login = ({ navigation }) => {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [loading, setLoading] = useState(false)
//     const { onLogin } = useContext(AuthenticationContext)

//     async function login() {
//         setLoading(true)
//         onLogin(email, password)
//     }
//     return (
//         <ThemeProvider theme="light">
//             <Layout>
//                 <DismissKeyboard>
//                     <View
//                         style={{
//                             flex: 3,
//                             paddingHorizontal: 20,
//                             paddingTop: 30,
//                         }}
//                     >
//                         <Title>Login</Title>
//                         <Text>Email</Text>
//                         <EmailInput
//                             value={email}
//                             onChangeText={(text) => setEmail(text)}
//                         >
//                             Enter email...
//                         </EmailInput>
//                         <Text style={{ marginTop: 15 }}>Password</Text>
//                         <PasswordInput
//                             value={password}
//                             onChangeText={(text) => setPassword(text)}
//                         >
//                             Enter password...
//                         </PasswordInput>

//                         <Button
//                             text={loading ? 'Loading' : 'Continue'}
//                             onPress={() => {
//                                 login()
//                             }}
//                             style={{ marginTop: 20, marginBottom: 20 }}
//                             disabled={loading}
//                         />
//                         <TextButton
//                             style={styles.textButton}
//                             onPress={() => navigation.navigate('Signup')}
//                         >
//                             Create Account
//                         </TextButton>
//                         <TextButton
//                             style={styles.textButton}
//                             onPress={() =>
//                                 navigation.navigate('Forgot Password')
//                             }
//                         >
//                             Forgot Password?
//                         </TextButton>
//                     </View>
//                 </DismissKeyboard>
//             </Layout>
//         </ThemeProvider>
//     )
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        color: 'black',
    },
})
