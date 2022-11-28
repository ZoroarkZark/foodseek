import React, { useEffect, useState, useContext } from 'react'
import { Text } from 'react-native'
import { EmailInput, ScrollViewDismissKeyboard, TextButton, Title, Odin } from '../../../../components/common'
import { AuthenticationContext } from '../../../../context/AuthenticationContext'
import { Feather } from '@expo/vector-icons'
import { Container} from '../../../../components/styling'

// page to submit user signin id to server in order to request password reset email be sent to them
export const ForgotPassword = ( { navigation } ) => {
    const { loading, onResetPassword } = useContext( AuthenticationContext )
    const [ email, setEmail ] = useState( '' )

    useEffect( () => {
        if ( loading ) {
            // do the loading behavior here
        }
    }, [ loading ] )
    
    return (
        <ScrollViewDismissKeyboard>
            <Container>
                <Title>Reset Password</Title>
                {loading ? (<Odin></Odin>) : (<></>)}
                <Text style={{ padding: 10 }}>A link to reset your password will be sent to the email address associated with your sign-in ID.</Text>   
                <Text style={{paddingTop:10, padding:10}}>Sign-in ID</Text>
                <EmailInput value={email} onChangeText={setEmail} placeholder='enter email account'/>
                <TextButton onPress={() => { onResetPassword( email ) }}>
                {/* <TextButton onPress={() => { navigation.navigate('ChangePassword') }}> commented out, but used to jump to the other page for testing */}
                    <Feather name="mail" color='grey' />
                    <Text paddingLeft={10} color='grey'> Press to Send Email</Text>
                </TextButton>

            </Container>
            
        </ScrollViewDismissKeyboard>
        
    )
    
}
