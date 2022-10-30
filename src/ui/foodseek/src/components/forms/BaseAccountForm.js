import React from 'react'
import { Text } from 'react-native'
import {
    CustomTextInput,
    EmailInput,
    PasswordInput,
    PickerInput,
} from '../common'

// contains the input fields required for all accounts
const BaseAccountForm = (props) => {
    return (
        <>
            <Text>First Name</Text>
            <CustomTextInput
                value={props.fn}
                onChangeText={props.setFn}
                keyboardType="default"
            >
                Enter first name...
            </CustomTextInput>
            <Text>Last Name</Text>
            <CustomTextInput
                value={props.ln}
                onChangeText={props.setLn}
                keyboardType="default"
            >
                Enter last name...
            </CustomTextInput>
            <Text>Phone Number</Text>
            <CustomTextInput
                value={props.phone}
                onChangeText={props.setPhone}
                keyboardType="numeric"
            >
                Enter phone number...
            </CustomTextInput>
            <Text>Email</Text>
            <EmailInput value={props.email} onChangeText={props.setEmail}>
                Enter your email...
            </EmailInput>
            <Text>Password</Text>
            <PasswordInput value={props.pwd} onChangeText={props.setPwd}>
                Enter your password...
            </PasswordInput>
            <Text>Are you a food seeker, or a food vendor?</Text>
            <PickerInput value={props.acc} onValueChange={props.setAcc}>
                Select account type...
            </PickerInput>
        </>
    )
}

export default BaseAccountForm
