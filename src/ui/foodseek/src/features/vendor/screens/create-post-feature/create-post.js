import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ThemeProvider,  Layout, Text, Button } from 'react-native-rapi-ui';
import { DismissKeyboard, Title } from '../../../../components/common';
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
        console.log((timeAvailable != '') && (timeAvailable > 0) && (timeAvailable < 24));
        if ((nameRegex.test(foodName)) && ((timeAvailable != '') && (timeAvailable > 0) && (timeAvailable < 24))) {
            navigation.navigate('Camera');
        } else {
            //give the error
        }
    }

    if (uri == ""){
        return (
            <Layout>
                <DismissKeyboard>
                    <Container>
                    <Title>Upload Food</Title>
                    <Button text='Take Picture' style={{marginTop:20, marginBottom:20}} onPress={() => checkInputs()}/>
                        <TextInput style={styles.input} value={foodName} placeholder="Enter Food Name..." onChangeText={setFoodName}/>
                        <TextWrapper>{foodName}</TextWrapper>
                        <TextInput style={styles.input} value={timeAvailable} keyboardType="number-pad" placeholder="Enter Time Available..." onChangeText={setTimeAvailable}/>
                        <TextWrapper>{timeAvailable}</TextWrapper>

                    </Container>
                </DismissKeyboard>
            </Layout>
        );
    } else {
        return (
            <Container>
                <Image alt='image didnt load' style={styles.image} source = {{uri: uri}}/>
                <TextWrapper>Food Name: {foodName}</TextWrapper>
                <TextWrapper>Time Available: {timeAvailable}</TextWrapper>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: 128,
        width: 128,
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
  