import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { ThemeProvider } from "react-native-rapi-ui";
import { Layout, TopNav } from 'react-native-rapi-ui'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, themeColor } from 'react-native-rapi-ui';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()


const App = () => {
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
  return (
  <ThemeProvider theme="light">
          <Layout>
            <TopNav
              middleContent={
                <Button
                  title="Profile"
                  onPress={() =>
                  navigation.navigate('Profile', { name: 'Ferdy' })
                   }
                />
              }
            />
            <TopNav
              rightContent={
                <Ionicons name="ellipsis-vertical" size={20} color={themeColor.black} />
              }
              rightAction={() => console.log('setting icon pressed')}
              middleContent="Settings"
            />
            <TopNav middleContent={
              <TextInput
                style={textStyles.input}
                placeholder="Let's gooooo!"
                keyboardType="default"
                multiline={true}
                numberOfLines={3}
                />
              }
            /> 
            <TopNav middleContent={
              <TextInput
                style={textStyles.input}
                placeholder="Let's gooooo!"
                keyboardType="default"
              />
            }
          /> 
          </Layout>
          <View style={styles.container}>
            <Text>Hello FoodSeek!</Text>
            <StatusBar style="auto" />
          </View>
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