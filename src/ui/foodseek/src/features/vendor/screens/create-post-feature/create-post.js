import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ThemeProvider,  Layout, Text, Button } from 'react-native-rapi-ui';
import { ScrollViewDismissKeyboard, Title } from '../../../../components/common';
import Container from '../../../../components/styling/Container'
import TextWrapper from '../../../../components/styling/TextWrapper';

export const CreatePost = ({ route, navigation }) => {
    const [foodName, setFoodName] = useState('');
    const [timeAvailable, setTimeAvailable] = useState('');
    const uri = (route.params) ? route.params.uri : "";
    console.log(`recieved uri ${uri}`);

    function checkInputs(){
        const nameRegex = /^[A-Z]+$/i;
        console.log(nameRegex.test(foodName));
        if (nameRegex.test(foodName)) {
            navigation.navigate('Camera');
        } else {
            //give the error
            //Alert.alert()
        }
    }

    if (uri == ""){
        return (
            <ScrollViewDismissKeyboard>
                <Container>
                <Title>Upload Food</Title>
                <Button text='Take Picture' style={{marginTop:20, marginBottom:20}} onPress={() => checkInputs()}/>
                    <TextInput style={styles.input} value={foodName} placeholder="Enter Food Name..." onChangeText={setFoodName}/>
                    <TextWrapper>{foodName}</TextWrapper>
                </Container>
            </ScrollViewDismissKeyboard>
        );
    } else {
        return (
            <Container>
                <TextWrapper>Food Name: {foodName}</TextWrapper>
                <Image alt='image didnt load' style={styles.image} source = {{uri: uri}}/>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 400,
        width: 400,
    },
    input: {
      height: 40,
      margin: 12,
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: 'white',
      padding: 10,
    },
    buttonContainer: {
        padding: 10,
        borderRadius: 20,
        fontSize: 25,
        backgroundColor: 'blue',
        color: 'white',
    },
  });
  