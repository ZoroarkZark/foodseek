import React from "react";
import { TextInput } from "react-native-paper";
import { Button } from "react-native";
import { Text } from "react-native";
import { CustomTextInput, EmailInput, PasswordInput } from "../common";
const BaseAccountForm = (props) => {
    return (
        <>
        <Text>First Name</Text>
        <CustomTextInput value={props.fn} onChangeText={props.setFn} keyboardType="default">Enter first name...</CustomTextInput>
        <Text>Last Name</Text>
        <CustomTextInput value={props.ln} onChangeText={props.setLn} keyboardType="default">Enter last name...</CustomTextInput>
        <Text>Phone Number</Text>
        <CustomTextInput value={props.phone} onChangeText={props.setPhone} keyboardType="numeric">Enter phone number...</CustomTextInput>
        <Text>Email</Text>
        <EmailInput value={props.email} onChangeText={props.setEmail}>Enter your email...</EmailInput>
        <Text>Password</Text>
        <PasswordInput value={props.pwd} onChangeText={props.setPwd}>Enter your password...</PasswordInput>

        </>

    );
}

export default BaseAccountForm;