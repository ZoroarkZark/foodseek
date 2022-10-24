import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextButton, Title, PasswordInput, EmailInput } from '../../components/common';
import {UserForm, VendorForm, BaseForm} from '../../components/forms';



// Function returns the user registration screen as a component 
const SignupScreen = ({ navigation }) => {

// variables used for conditional rendering vendor or user forms
const [state, setState] = useState('Base');
const [prev, setPrev] = useState('Base');

 // block contains: form variables and mutators
    const [fn ,     setFn] = useState("");          // first name
    const [ln ,     setLn] = useState("");          // last name
    const [phone,   setPhone] = useState("");     // phone number
    const [un,      setUn] = useState("");           // username
    const [loc,     setLoc] = useState("");         // location
    const [email,   setEmail] = useState("");     // email
    const [pwd,     setPwd] = useState("");         // password
    const [acc,     setAcc] = useState("");         // account type (vendor/seeker)
    const [bn ,     setBn] = useState("");          // business name
    const [ba,      setBa] = useState("");           // business address
    const [bphone,  setBPhone] = useState("");   // business phone number
    const [bemail,  setBEmail] = useState("");   // business email
    const [inc,     setInc] = useState("");         // income or earnings
    const [period,  setPeriod] = useState("");   // pay period
    const [ptravel, setPTravel] = useState(""); // travel preference
    const [display, setDisplay] = useState(null);


// function applies logic behind conditionally displaying the form fields
const renderSwitch = (state) => {
    switch(state){
        case 'Base':
            return <BaseForm fn={fn} ln={ln} phone={phone} email={email} pwd={pwd} acc={acc} setFn={(firstName) => setFn(firstName)} setLn={(lastName) => setLn(lastName)} setPhone={(phonenumber) => setPhone(phonenumber)} setEmail={(email) => setEmail(email)} setPwd={(password) => setPwd(password)} setAcc={(accountType) => setAcc(accountType)}
            />;
        case 'Vendor':
            return <VendorForm bn={bn} ba={ba} bphone={bphone} bemail={bemail} setBn={(businessName) => setBn(businessName)} setBa={(businessAddress) => setBa(businessAddress)} setBPhone={(businessPhone) => setBPhone(businessPhone)} setBEmail={(businessEmail) => setBEmail(businessEmail)}
            />;
        case 'User':
             return <UserForm un={un} loc={loc} inc={inc} period={period} ptravel={ptravel} setUn={(username) => setUn(username)} setLoc={(local) => setLoc(local)} setInc={(income) => setInc(income)} setPeriod={(payperiod) => setPeriod(payperiod)} setPTravel={(travelPreference) => setPTravel(travelPreference)}
             />;
    }
}

// button triggered event: updates the state based on user input
const updateState = () => {
    if (!acc) {
        alert("User must choose to be vendor or seeker...");
    }else if ( acc === 'USR_SEEK') {
        setPrev(state);
        setState('User');
    }else{
        setPrev(state);
        setState('Vendor');
    }
}

// button triggered event: behavior for the back button
const goBack = () => {
    let temp = prev;
    setPrev(state);
    setState(temp);
}

// button triggered event: form submission behavior
const onSubmit = () => {

}

// renders the title, a return to login button, and conditionally renders form fields and buttons based on user input
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
                {state !== 'Base'
                ? <Button title="Submit" onPress={() => onSubmit()}>Insert submission behavior</Button>
                : <></>
                }

                {state === 'Base' 
                ? <Button title="Continue" onPress={() => updateState()}>Advances to the secondary form pages</Button>
                : <Button title="Back" onPress={() => goBack()}>Returns to previous page</Button>
                }
                
                

</View>
);
}

export {SignupScreen};