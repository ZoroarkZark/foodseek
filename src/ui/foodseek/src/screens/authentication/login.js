import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeProvider, Layout, Text, TextInput, Button } from 'react-native-rapi-ui';
import TextButton from '../../components/buttons/textbutton';



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
export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

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

    navigation.navigate("Home");
  }
  return (
    <ThemeProvider theme="light">
      <Layout>  
        <View 
          style={styles.container}
        >
          <Text 
              fontWeight='bold'
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
              >Log-in</Text>
          <Text style={{...styles.label}}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            placeholder="enter your email"
            multiline={true}
            numberOfLines={3}
            onChangeText={(text) => setEmail(text)}
            />
          <Text style={{...styles.label}}>Password</Text>
          <TextInput 
            style={{...styles.input}}
            value={password}
            placeholder="enter your password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <Button
            text={loading ? "Loading" : "Continue"}
            onPress={() => {
                login();
            }}
            style={{
              marginTop: 20,
            }}
          />
          <View style={{flex: 1, flexDirection: "row", padding: 5}}>
          <TextButton onPress={ () => navigation.navigate("Signup") } style={styles.link}>Create Account</TextButton>
          <TextButton onPress={ () => navigation.navigate("Forgot Password") } style={styles.link}>Forgot Password?</TextButton>
          </View>
          
      </View> 
      </Layout>
    </ThemeProvider>
  );
};

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
  label: {
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

