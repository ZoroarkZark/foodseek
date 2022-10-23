import React, { useState } from 'react';
import { useContext } from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { PasswordInput, EmailInput, Title, PickerInput } from '../../components/text/TextInput.js';
import { AuthContext } from '../../components/caching/CreateAccountContext.js';
import { ThemeProvider, Layout, Button } from 'react-native-rapi-ui';
import { useNavigation } from '@react-navigation/native';

/*
Intended functionality: To ask first whether or not you want to be an "Eater" or "Vendor". 
                        Leads into respective pages. One for "Eater signup" and another for "Vendor signup".

*/



export const SignupScreen = ({ navigation }) => {
    const {loading, user, setLoading, setUser, createAccount, logout, printUser} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [prefTravel, setPrefTravel] = useState("");
    const [location, setLocation] = useState("");
    const [next, setNext] = useState(false);
    const [complete, setComplete] = useState(false);
    const [businessEmail, setBusinessEmail] = useState("");
    const [endResponse, setEndResponse] = useState("");
    const completeHandler = () => {
      setComplete(true);
      setUser({
        Email: email,
        Pass: password,
        Role: role,
        PrefTravel: prefTravel,
        BusinessEmail: businessEmail,
      });
      console.log("Create account completed... here is what it looks like...");
      console.log(user);

    }

    return (
      <ThemeProvider theme="light">
      <Layout>  
        <View 
          style={styles.container}
        >
        <Title label="Create Account" />
        {(!next && (role === "") ) &&
          <>
          <EmailInput value={email} onChangeText={(e) => setEmail(e)} style={{label: styles.input, item: styles.input}}/>
          <PasswordInput value={password} onChangeText={(e) => setPassword(e)} style={{label: styles.input, item: styles.input}}/>
          <PickerInput value={role} onValueChange={(e) => setRole(e)} placeholder="Please select a role..." label="User Role" style={{label: styles.input, item: styles.input}}/>
          <Button text={loading ? "Loading" : "Continue"}  onPress={(email,password,role,location) =>  {email && password && role && !next ? setNext(!next) : console.log("There are still empty fields...")} } style={{ marginTop: 20, }} />
          </>
        }
        {(!next && (role === "USR_VEND") ) &&
          <>
          <EmailInput value={businessEmail} label="Business/Work Email" onChangeText={(e) => setBusinessEmail(e)} style={{label: styles.input, item: styles.input}}/>
          <Button text={loading ? "Loading" : "Submit"}  onPress={(businessEmail) =>  {businessEmail ? completeHandler() : console.log("There are still empty fields...")} } style={{ marginTop: 20, }} />
          </>
        }
        {(!next && (role === "USR_SEEK") ) &&
          <>
          <PickerInput value={prefTravel} onValueChange={(e) => setPrefTravel(e)} placeholder="Please select your favorite method of travel..." label="Preferred Travel" style={{label: styles.input, item: styles.input}} options={[{label: 'Seeker', value: 'USR_SEEK'},{label: 'Vendor', value: 'USR_VEND'}]}/>
          <Button text={loading ? "Loading" : "Submit"}  onPress={(prefTravel) =>  {prefTravel ? completeHandler() : console.log("There are still empty fields...")} } style={{ marginTop: 20, }} />
          </>
        }
        {(complete && !loading) && 
        <>
        <Text>{endResponse}</Text>
        </>}
        
      </View>
      </Layout>
      </ThemeProvider>
    )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    label: {
      flex: 1,
      alignSelf: 'flex-start',
      marginTop: 15,
      marginLeft: 15,
      padding: 5,
    },
    link:{
      flex: 1,
      color: 'black',
      backgroundColor: '#fff',
      alignItems: 'center',
      size: 'sm',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      marginLeft: 15,
      padding: 10,
    },
  });