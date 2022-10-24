import React, {useState, createRef} from 'react';
import {styles} from '../../components/styleSheet.js'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

/*
Intended functionality: Came from Sign-up page. Now at "Eater Sign-up" page. 

Eater form information examples: Name, Email, Income.
Store this information in the cloud, ideally; might be hard to let SQL database run all of the information.
*/
export const EatSignupScreen = ({ navigation }) => {


//Source for inspiration: https://aboutreact.com/react-native-login-and-signup/
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errortext, setErrortext] = useState('');
  const [isVendor, setIsVendor] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);

  const emailInputRef = createRef();
  const ageInputRef = createRef();
  const addressInputRef = createRef();
  const passwordInputRef = createRef();

  const handleButton = () => {
    setErrortext('');
    //Errors if fields not filled in. In order, username, email, created password.
    if (!userName){
        alert ('Need info on username. Please fill in.');
        return;
    }
    if (!userEmail){
        alert ('Need info on user email. Please fill in.');
        return;
    }
    if (!userPassword){
        alert ('Need info on user password. Please fill in.');
        return;
    }
    //Store the information you do get into this, if you do receive info.
    var dataToSend = {
        name: userName,
        email: userEmail,
        password: userPassword,
      };
      //Keep information into a JSON string, coded by key and value.
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      //We now have a pretty valid JSON string, made with the key and value given.
      //What we should do with this JSON string is to utilize it to sign up a user.
    };
    return (
    <View style={{flex: 1, backgroundColor: '#307ecc'}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current &&
                ageInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={handleButton}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
           </KeyboardAvoidingView>
          </ScrollView>
        </View>
    );
}

