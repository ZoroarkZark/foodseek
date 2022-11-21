import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, View, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ThemeProvider,  Layout, Text, Button } from 'react-native-rapi-ui';
import { ScrollViewDismissKeyboard, Title } from '../../../../components/common';
import { ThemeContextProvider } from '../../../../context/ThemeContext';
import Container from '../../../../components/styling/Container'
import TextWrapper from '../../../../components/styling/TextWrapper';
import { createPostStyles } from "../../../../style/styleSheet"

export const CreatePost = ( { route, navigation } ) => {
    const [foodName, setFoodName] = useState('');
    const [tags, setTags] = useState();
    const [testTags, setTestTags] = useState('');
    const [currentTags, setCurrentTags] = useState('');
    const [numTags, setNumTags] = useState(0);
    const [timeAvailable, setTimeAvailable] = useState('');
    const uri = (route.params) ? route.params.uri : "";
    console.log(`recieved uri ${uri}`);

    //To do, make this not navigate after picture is taken
    function checkInputs(input){
        const nameRegex = /^[A-Z]+$/i;
        console.log(nameRegex.test(foodName));
        if (nameRegex.test(foodName)) {
            navigation.navigate('Camera');
        } else {
            alert('Improper input')
        }
    }

    function checkTags(){
        const ar = currentTags.split('#')
        let t = ''
        for (let i = 1; i < ar.length; i=i+1){
            t = t + ' #' + ar[i]
        }
        setTestTags(t)
    }

    if (uri == ""){
        return (
            <ScrollViewDismissKeyboard>
                <Container>
                    <Title>Upload Food</Title>
                    <Button text='Take Picture' style={{marginTop:20, marginBottom:20}} onPress={() => checkInputs(foodName)}/>
                    <TextInput style={createPostStyles.input} value={foodName} placeholder="Enter Item Name..." onChangeText={setFoodName}/>
                </Container>
            </ScrollViewDismissKeyboard>
        );
    } else {
        return (
            <ScrollViewDismissKeyboard>
                <View style={createPostStyles.container}>
                    <TextWrapper>New Item</TextWrapper>
                    <View style={createPostStyles.row}>
                        <Image alt='image didnt load' style={createPostStyles.image} source = {{uri: uri}}/>
                        <Text style={createPostStyles.text2}>Item Name: {foodName}</Text>
                    </View>
                    <Text>{testTags}</Text>
                    <View style={createPostStyles.row}>
                        <TextInput style={createPostStyles.input} value={currentTags} placeholder="Enter Tags..." onChangeText={setCurrentTags}/>
                        <Button text='Testing button' style={{marginTop:20, marginBottom:20}} onPress={() => checkTags()}/>
                    </View>
                    <Button text='Submit Post' style={{marginTop:20, marginBottom:20}} onPress={() => alert('not implemented yet')}/>
                </View>
            </ScrollViewDismissKeyboard>
        );
    }
}

  