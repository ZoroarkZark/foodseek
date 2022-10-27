import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider,  Layout, Text, Button, } from 'react-native-rapi-ui';
import { TextButton, Title, PasswordInput, EmailInput, DismissKeyboard } from '../../components/common';
import { AuthenticationContext } from '../../context/AuthenticationContext';

import { SI } from '../../scripts/serverinterface.js'


/*
----------------------------------------------------------------------------------------
URL BUILDING
*/

//Create the URL for the form. 
// - url: given url
// - email: given email to append to URL
// - password: given password to append to URL
function formUrl(url,email,password) {
    const emailKey="email";
    const passKey="pass";
    let URL = concat(url,'?',emailKey,'=',email,'&',passKey,'=',password);
    return(URL);
}

// This function will take in:
//  -base   : root for the app
//  -url    : action resource for the request
//  -params : an object like {email: "example@ex.com", pass: "secure_pass"}
// and return the finalized version of the url to pass in the request
function buildURL(base = "http://localhost:3000", url, params = null){
    var URL = base+url; // create the main url with the url appended to the root 
    
    
    if(params){
      var keys = Object.keys(params); // get the keys and values
      var vals = Object.values(params); 

      var query = "?";
      for( let i=0; i<keys.length; i++){
        var amp = (i!=keys.length-1) ? "&" : ""; // if we are not the last element add an & to split up parameters
        query +=`${keys[i]}=${vals[i]}`+amp;
      }
      return (URL+query);
    }

    return URL;

}

/*
----------------------------------------------------------------------------------------
LOGIN SCREEN
*/

const def_root = "http://localhost:3000";
export const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {onLogin} = useContext(AuthenticationContext);

  async function login(){
    setLoading(true);
    //  So Nico and I can set the keys to whatever we want them to be
    // when you form the object to pass to build url you can ask us or we can start documentign more what they will be
    // 
    //const response = await fetch(buildURL(def_root,"/login", {email: email, pass: password}),

    //

    // Screens CreateAcc, MainLoggedIn, Error

    var creds = {
      email: email,
      pass: password
    }
    onLogin(email,password);
    navigation.navigate("HomeTab");
  }
  return (
    <ThemeProvider theme="light">
      <Layout>  
        <DismissKeyboard>
          <View 
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingTop: 30,
            }} >
              <Title>Login</Title>
              <Text>Email</Text>
              <EmailInput value={email} onChangeText={(text) => setEmail(text)}>Enter email...</EmailInput>
              <Text style={{ marginTop: 15 }}>Password</Text>
              <PasswordInput value={password} onChangeText={(text) => setPassword(text)}>Enter password...</PasswordInput>

              <Button text={loading ? "Loading" : "Continue"} onPress={() => { login();}} style={{ marginTop: 20, marginBottom: 20, }} disabled={loading} /> 
              <TextButton style={styles.textButton} onPress={() => navigation.navigate("Signup")}>Create Account</TextButton>
              <TextButton style={styles.textButton} onPress={() => navigation.navigate("Forgot Password")}>Forgot Password?</TextButton>
          </View>

        </DismissKeyboard>
         
      </Layout>
    </ThemeProvider>
  );
};
// nothing to commit?
/*
----------------------------------------------------------------------------------------
STYLES
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: 'black',
  },
});

const textStyles = StyleSheet.create({
  input: {
    height: 40, 
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});