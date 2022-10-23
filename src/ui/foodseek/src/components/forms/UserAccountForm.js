import React from "react";
import { Button } from "react-native";
import { TextInput } from "react-native-paper";
import { Text } from "react-native";
import { CustomTextInput} from "../common";
const UserAccountForm = ({props}) => {
    return (
    <>
        <Text>Username</Text>
        <CustomTextInput value={props.un} onChangeText={props.setUn} keyboardType="default">Enter desired username...</CustomTextInput>
        <Text>Location</Text>
        <CustomTextInput value={props.loc} onChangeText={props.setLoc} keyboardType="default">Enter location...</CustomTextInput>
    </>

    );
}
export default UserAccountForm;