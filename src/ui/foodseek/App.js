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
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function loginHandler(email,password){
  console.log("I don't do anything yet. Entered: "+email+" and "+password);
}

function App () {

return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home Screen' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile Screen'}}
        />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

  async function login(){
    setLoading(true);
    await loginHandler(email, password).catch(function ( error ) {

      var errorCode = error.code;
      var errorMessage = error.message;
      setLoading(false);
      alert(errorMessage);
    });
  };
  
  return (
    <ThemeProvider theme="light">
      <Layout>  
        <TopNav
            /*middleContent={
              <Button
                title="Profile"
                onPress={() =>
                navigation.navigate('Profile', { name: 'Ferdy' })
                }
              />
            }*/
          />
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
                navigation.navigate('Profile', { name: 'Ferdy' })       
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

const ProfileScreen = ({ navigation, route }) => {
  return (
  <ThemeProvider theme="light">
  <Layout>
    <TopNav
      middleContent={
       <Button
        title="Home"
        onPress={() =>
        navigation.navigate('Home')
         }
      />
    }
  />
   </Layout>
   </ThemeProvider>
  );
};

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

export default App;