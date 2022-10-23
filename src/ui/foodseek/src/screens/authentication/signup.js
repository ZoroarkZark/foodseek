import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextButton, Title, PasswordInput, EmailInput } from '../../components/common';
import {UserForm, VendorForm, BaseForm} from '../../components/forms';

// const renderSwitch = (state) => {
//     switch(state){
//         case 'Base':
//             return <Text>Base here...</Text>;
//         case 'Vendor':
//             return <Text>Vendor here...</Text>;
//         case 'User':
//             return <Text>User here...</Text>;
//     }
// }
const usr={
    fn : "",
    ln : "",
    phone: "",
    un: "",
    loc: "",
};

const renderSwitch = (state) => {
    switch(state){
        case 'Base':
            return <BaseForm props={usr}/>;
        case 'Vendor':
            return <VendorForm props={usr}/>;
        case 'User':
            return <UserForm props={usr}/>;
    }
}
/*
Intended functionality: To ask first whether or not you want to be an "Eater" or "Vendor". 
                        Leads into respective pages. One for "Eater signup" and another for "Vendor signup".

*/
const SignupScreen = ({ navigation }) => {

const [state, setState] = useState('Base');



return(
<View
            style={{
                flex: 3,
                paddingHorizontal: 20,
                paddingTop: 30,

            }}>
                <Title>Create Account</Title>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontWeight:'400', fontSize: 14,}}>Already have an account?</Text>
                <TextButton style={{color: 'green'}} onPress={() => navigation.navigate("Login")}>Login</TextButton>
                </View>
                {renderSwitch(state)}
                <Button title="user" onPress={() => setState('User')}>penis</Button>
                <Button title="vendor" onPress={() => setState('Vendor')}>yumm</Button>
                <Button title="base" onPress={() => setState('Base')}>hiu</Button>
                
                
                

</View>
);
            

}

export {SignupScreen};