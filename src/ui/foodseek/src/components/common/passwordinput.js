import React from "react";
import { TextInput } from 'react-native-rapi-ui';


const PasswordInput = ({
    children,
    value, 
    onChangeText,
    placeholder="Enter password...", 
    style={
        height: 40, 
        margin: 12,
        borderWidth: 1,
        padding: 10,
}
}) => (
    <TextInput style={style} value={value} secureTextEntry={true} placeholder={children ? children : placeholder} onChangeText={onChangeText} >
    </TextInput>
);

export default PasswordInput;