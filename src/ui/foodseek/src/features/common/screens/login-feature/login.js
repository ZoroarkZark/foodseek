import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeProvider, Layout, Text, Button } from 'react-native-rapi-ui'
import { AuthenticationContext } from '../../../../context/AuthenticationContext'
import {
    TextButton,
    Title,
    PasswordInput,
    EmailInput,
    DismissKeyboard,
} from '../../../../components/common'


// ATTENTION: THIS IS ONLY A TESTING Development build... to be removed at release

import { vendorAvatar, seekerAvatar } from '../../../../../assets'

export const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { onLogin, setUser } = useContext(AuthenticationContext)

    async function login() {
        setLoading(true)
        onLogin(email, password)
    }
    return (
        <ThemeProvider theme="light">
            <Layout>
                <DismissKeyboard>
                    <View
                        style={{
                            flex: 5,
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
                    </View>
                </DismissKeyboard>
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
