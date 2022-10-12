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


const url = "http://localhost/login";

export const LoginScreen = ({ route, navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [json, setJSON] = useState([]);


  async function login({ route, navigation }){
    setLoading(true);
    const response = await fetch(formUrl(url,email,password),
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email, "pass":password }),
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

