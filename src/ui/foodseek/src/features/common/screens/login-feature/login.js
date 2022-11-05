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

import { fetchRequest } from '../../../../scripts/deviceinterface'


// ATTENTION: THIS IS ONLY A TESTING Development build... to be removed at release

import { vendorAvatar, seekerAvatar } from '../../../../../assets'

export const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, onLogin, setUser } = useContext( AuthenticationContext )
    const [display, setDisplay] = useState(false)

    async function login() {
        setLoading(true)
        onLogin(email, password)
    }

    useEffect( () => { setDisplay( !display ) }, [ user ] ) // set the signal for displaying the result of user login onto login page for testing
    
    return(
        <ThemeProvider theme="light">
            <Layout>
                <ScrollViewDismissKeyboard>
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
                            disabled={loading}
                        />
                        <TextButton
                            style={styles.textButton}
                            onPress={() => navigation.navigate('Signup')}
                        >
                            Create Account
                        </TextButton>
                        <TextButton
                            style={styles.textButton}
                            onPress={() =>
                                navigation.navigate('Forgot Password')
                            }
                        >
                            Forgot Password?
                        </TextButton>
                        {display
                            ? < Text >{ user ? JSON.stringify(user) : 'User is still undefined bruh'}</Text>
                            : <></>}
                        <Button
                            text="Fake Vendor Login"
                            onPress={() => {
                                setUser({
                                    email: email ? email : 'ivetaCafe@ucsc.edu',
                                    id: 'VID1234',
                                    isVendor: true,
                                    un: email ? email.split('@')[0] : "Ivéta Cafe",
                                    avatar: vendorAvatar,
                                })
                            }}
                            style={{ marginTop: 20, marginBottom: 20 }}
                            disabled={loading}
                        />
                        <Button
                            text="Fake Seeker Login"
                            onPress={() => {
                                setUser({
                                    email: email ? email : 'sammy@ucsc.edu',
                                    id: 'SID456',
                                    isVendor: false,
                                    un: email ? email.split('@')[0] : "SammyWhammy69",
                                    avatar: seekerAvatar,
                                })
                            }}
                            style={{ marginTop: 20, marginBottom: 20 }}
                            disabled={loading}
                        />
                        <Button 
                            text="EC2 GET"
                            onPress={ () => {
                                fetch('http://ec2-54-193-142-247.us-west-1.compute.amazonaws.com:3000/test')
                                .then((response) => response.json())
                                .then((data) => alert(JSON.stringify(data)))
                                .catch((err) => alert(err));
                            }}
                        />
                        <Button
                            text="ECT POST"
                            onPress={ () => {
                                const t = fetchRequest('http://ec2-54-193-142-247.us-west-1.compute.amazonaws.com:3000/test',"POST", {test:"1234"});
                                t.then((res) => console.log(res));
                            }}
                        />
                    </View>
                </ScrollViewDismissKeyboard>
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
