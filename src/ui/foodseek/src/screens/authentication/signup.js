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
// const usr={
//     fn : "",        // first name
//     ln : "",        // last name
//     phone: "",      // phone number
//     un: "",         // username
//     loc: "",        // location
//     email: "",      // email
//     pwd: "",        // password
//     acc: "",        // account type (vendor/seeker)
//     bn : "",        // business name
//     ba: "",         // business address
//     bphone: "",     // business phone number
//     bemail: "",     // business email
//     inc: "",        // income or earnings
//     period: "",     // pay period
//     pTravel: "",    // travel preference

// };

const usr = () => {
    const [fn , setFn] = useState("");          // first name
    const [ln , setLn] = useState("");          // last name
    const [phone, setPhone] = useState("");     // phone number
    const [un, setUn] = useState("");           // username
    const [loc, setLoc] = useState("");         // location
    const [email, setEmail] = useState("");     // email
    const [pwd, setPwd] = useState("");         // password
    const [acc, setAcc] = useState("");         // account type (vendor/seeker)
    const [bn , setBn] = useState("");          // business name
    const [ba, setBa] = useState("");           // business address
    const [bphone, setBPhone] = useState("");   // business phone number
    const [bemail, setBEmail] = useState("");   // business email
    const [inc, setInc] = useState("");         // income or earnings
    const [period, setPeriod] = useState("");   // pay period
    const [pTravel, setPTravel] = useState(""); // travel preference

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