import React, { useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemeProvider, Layout, Text, Button } from 'react-native-rapi-ui'
import { AuthenticationContext } from '../../context/AuthenticationContext'
import {
    TextButton,
    Title,
    PasswordInput,
    EmailInput,
    DismissKeyboard,
} from '../../components/common'

export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { onLogin } = useContext(AuthenticationContext)

    async function login() {
        setLoading(true)
        onLogin(email, password)
        navigation.navigate('HomeTab')
    }
    return (
        <ThemeProvider theme="light">
            <Layout>
                <DismissKeyboard>
                    <View
                        style={{
                            flex: 3,
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
                    </View>
                </DismissKeyboard>
            </Layout>
        </ThemeProvider>
    )
}

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
