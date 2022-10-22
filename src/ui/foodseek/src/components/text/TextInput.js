import React, { useState } from "react";
import { useRef } from "react";
import { View } from "react-native";
import { TextInputMask } from "react-native-paper";
import { TextInput, Text, Picker } from 'react-native-rapi-ui';



const validator = (text="") => {
    return true;
}


// phone input field which is not yet in use... will be added/tested later for input
export const PhoneNumberInput = ({label, style}) => {
    const [text, setText] = React.useState("");


    return (
        <TextInput 
            value={text}
            onChangeText={text => setText(text)}
            render={props => <TextInputMask {...props} mask="+[00] [000] [000] [000]" /> }
            style={style}
            keyboardType={"phone-pad"}
        />
    )
}

// creates a Title for the Auth flow screens
export const Title = ({style, label="Email"}) => (
        <>
            <Text fontWeight='bold' style={{ alignSelf: "center", padding: 30, }} size="h3" >
            {label}
            </Text>
        </>
);

// adds an email field to the form along with a text label for it
export const EmailInput = ({value, style, onChangeText, label="Email"}) => {
    const [text, setText] = React.useState("");

    const valid = (text) => {
        // TODO: add more validation
        return (
            text.includes("@")
            )
    }
    return (<>
        <Text fontWeight='bold' style={{ alignSelf: "left", padding: 4, }} size="h4" >
        {label}
        </Text>
        <TextInput 
            mode="outlined"
            outlineColor="grey"
            activeOutlineColor="white"
            placeholder="Please enter your email..."
            value={value}
            onChangeText={onChangeText}
            style={style.item}
            keyboardType={"email-address"}
        />
        </>
    )
}

// adds a password field to the form as well as a label for it
export const PasswordInput = ({value, style, onChangeText, placeholder="Please enter a password...", label="Password"}) => {

    return (<>
    <Text fontWeight='bold' style={{ alignSelf: "left", padding: 4, }} size="h4" >
        {label}
    </Text>
    <TextInput 
        mode="outlined"
        outlineColor="grey"
        activeOutlineColor="white"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={style.item}
        secureTextEntry={true}
    />
    </>)
}

// creates a picker (dropdown selection tool) field for selecting the role of the user
export const PickerInput = ({value, style, onValueChange, placeholder, label="Picker"}) => {
    const options = [
        {label: 'Seeker', value: 'USR_SEEK'},
        {label: 'Vendor', value: 'USR_VEND'}
    ];

    return (
    <>
    <Text fontWeight='bold' style={{ alignSelf: "left", padding: 4, }} size="h4" >
        {label}
    </Text>
    <View style={{alignSelf: 'left'}}>
    <Picker
        items={options}
        value={value}
        style={{...style.item, flexGrow: 10}}
        placeholder={placeholder}
        onValueChange={onValueChange}
    />
    </View>
    
    </>
    )
}

export default TextInput;
