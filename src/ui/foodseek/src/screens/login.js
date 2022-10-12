import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {  
  ThemeProvider,
  Layout,
  TopNav,
  Text,
  TextInput,
  Button,
  useTheme, 
  themeColor, 
} from 'react-native-rapi-ui';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
function buildURL(base = "http://localhost:3000", url, params = {}){
    var URL = concat(base,url); // create the main url with the url appended to the root 
    
    
    if(params){
      var keys = Object.keys(params); // get the keys and values
      var vals = Object.values(params); 

      var query = "?";
      for( let i=0; i<keys.length; i++){
        var amp = (i!=keys.length-1) ? "&" : ""; // if we are not the last element add an & to split up parameters
        query = concat(query,`${keys[i]}=${vals[i]}`, amp);
      }

      return concat(URL,query);
    }

    return URL;

}

const def_root = "http://localhost:3000";

export const LoginScreen = ({ route, navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [json, setJSON] = useState([]);


  async function login({ route, navigation }){
    setLoading(true);
    //  So Nico and I can set the keys to whatever we want them to be
    // when you form the object to pass to build url you can ask us or we can start documentign more what they will be
    // 
    const response = await fetch(buildURL(def_root,"/login", {email: email, pass: password}),
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify({ "email": email, "pass":password }), Currently we recieve our headers in the url but we should probably move the backend to take body items. Commented out so the build would work for now
        })
          .then((response) => response.json())
          .then((json) => setJSON(json))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false)); 
    navigation.navigate("LoginResponse", {resp: json});
  }
  return (
    <ThemeProvider theme="light">
      <Layout>  
        <View 
          style={{
            flex: 3,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          <Text
              fontWeight='bold'
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
              >Log-in</Text>
          <Text>Email</Text>
          <TextInput
            style={textStyles.input}
            value={email}
            keyboardType="email-address"
            placeholder="enter your email"
            multiline={true}
            numberOfLines={3}
            onChangeText={(text) => setEmail(text)}
            />
          <Text style={{ marginTop: 15 }}>Password</Text>
          <TextInput
            style={textStyles.input}
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
            disabled={loading}
          />

      </View> 
      </Layout>
    </ThemeProvider>
  );
};

