import React from "react";
import { TextInput } from "react-native-paper";
import { Button } from "react-native";
import { Text } from "react-native";
import { EmailInput, CustomTextInput} from "../common";

const VendorAccountForm = ({props}) => {
    return (
        <>
        <Text>Business Name</Text>
        <CustomTextInput value={props.bn} onChangeText={props.setBn} keyboardType="default">Enter the business name...</CustomTextInput>
        <Text>Business Address</Text>
        <CustomTextInput value={props.ba} onChangeText={props.setBa} keyboardType="default">Enter the business address...</CustomTextInput>
        <Text>Business Phone Number</Text>
        <CustomTextInput value={props.bphone} onChangeText={props.setBPhone} keyboardType="numeric">Enter the business phone number...</CustomTextInput>
        <Text>Business Email</Text>
        <EmailInput value={props.bemail} onChangeText={props.setBEmail}>Enter the business email...</EmailInput>


        </>
    );
};

export default VendorAccountForm;

