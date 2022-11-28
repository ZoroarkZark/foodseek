import React, { useState, useContext, useEffect } from 'react'
import { Text } from 'react-native'
import { CustomTextInput, ScrollViewDismissKeyboard, TextButton, Title, Odin } from '../../../../components/common'
import { AuthenticationContext } from '../../../../context/AuthenticationContext'
import { Feather } from '@expo/vector-icons'
import { Container } from '../../../../components/styling'

// landing page for link from email to reset password
export const ChangePassword = ( { navigation } ) => {
    const { loading, onNewPassword } = useContext( AuthenticationContext )
    const [ newPassword, setNewPassword ] = useState( '' )
    const [ confirmPassword, setConfirmPassword ] = useState( '' )
    
    useEffect( () => {
        if ( loading ) {
            // do the loading behavior here
        }
    }, [ loading ] )
    

    return (
        <ScrollViewDismissKeyboard>
            <Container>
                <Title>Verified: Change Password</Title>
                {loading ? (<Odin></Odin>) : (<></>)}
                <Text style={{ padding: 10 }}>Please enter your new password.</Text>   
                <Text style={{paddingTop:10, padding:10}}>New Password</Text>
                <CustomTextInput value={newPassword} onChangeText={setNewPassword} placeholder='********' />
                <Text style={{paddingTop:20, padding:10}}>Confirm Password</Text>
                <CustomTextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder='********'/>
                <TextButton onPress={() => { onNewPassword(newPassword) }}>
                    <Feather name="lock" color='grey' />
                    <Text paddingLeft={10} color='grey'> Set Password</Text>
                </TextButton>

            </Container>
            
        </ScrollViewDismissKeyboard>
        
    )
    
}