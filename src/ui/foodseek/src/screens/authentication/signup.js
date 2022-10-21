import React, { useState } from 'react';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    const [location, setLocation] = useState("");


    return (
      <ThemeProvider theme="light">
      <Layout>  
        <View 
          style={styles.container}
        >
        <Title label="Create Account" />
        <EmailInput value={email} onChangeText={(e) => setEmail(e)} style={{label: styles.input, item: styles.input}}/>
        <PasswordInput value={password} onChangeText={(e) => setPassword(e)} style={{label: styles.input, item: styles.input}}/>
        <PickerInput value={role} onValueChange={(e) => setRole(e)} placeholder="Please select a role..." label="User Role" style={{label: styles.input, item: styles.input}}/>
        <Button text={loading ? "Loading" : "Continue"}  onPress={(email,password,role,location) =>  {printUser(); createAccount({e: email, p: password, r: role, l: location}); printUser();} } style={{ marginTop: 20, }} />
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