import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';

/*
Intended functionality: To ask first whether or not you want to be an "Eater" or "Vendor". 
                        Leads into respective pages. One for "Eater signup" and another for "Vendor signup".

*/
export const SignupScreen = ({ navigation }) => {
    const [isVendor, setIsVendor] = useState(false);
    const [selected, setSelected] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    //BUTTON TO ASK WHETHER OR NOT THEY ARE AN EATER OR VENDOR. IF EATER, FALSE. IF VENDOR, TRUE.
    //Now have information on that.
    
    

    

    //FIELDS FOR NAME, EMAIL, AND PASSWORD. 

    return (
        /*VIEW CONTAINER*/
        <View style={{flex: 1, backgroundColor: '#307ecc'}}> 

        /*SCROLL VIEW, TO ALLOW FOR SCREEN TO BE SCROLLED.*/
          <ScrollView 
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              justifyContent: 'center',
              alignContent: 'center',
            }}>

            /*SEPERATED VIEWS FOR DIFFERENT USER, EMAIL, PASSWORD FIELDS.*/
            /*KeyboardAvoidingView used to allow the scrolled screen to move upwards when needed.*/

            /*ADD BUTTON FOR EATER OR VENDOR HERE. HIDE EVERYTHING ELSE.*/
            <Pressable
                style={styles.buttonStyle}
                onPress={setIsVendor(false)}>
                <Text style={styles.buttonTextStyle}>EATER</Text>
            </Pressable>

            <Pressable
                style={styles.buttonStyle}
                onPress={setIsVendor(true)}>
                <Text style={styles.buttonTextStyle}>VENDOR</Text>
            </Pressable>

            <KeyboardAvoidingView enabled>

                /*VIEW CONTAINER FOR USERNAME.*/
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

                /*VIEW CONTAINER FOR EMAIL.*/
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

                /*VIEW CONTAINER FOR PASSWORD.*/
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

                /*INTERFACE FOR BUTTON TO FINISH REGISTRATION.*/
              <Pressable
                style={styles.buttonStyle}
                onPress={handleButton}>
                <Text style={styles.buttonTextStyle}>REGISTER</Text>
              </Pressable>


               </KeyboardAvoidingView>
              </ScrollView>
            </View>
        );



    //DEPENDING IF EATER OR VENDOR, DISPLAY DIFFERENT THINGS OUT.
    //FOR EATER, DISPLAY INCOME.
    //FOR VENDOR, DISPLAY BUSINESS NAME.




    //HAVE ALL NECESSARY INFORMATION. ONCE DONE, SIGNUP SHOULD BE COMPLETE. LAY OUT ALL OF THE DATA TO USE.
    //TAKE TO HOME SCREEN.


};