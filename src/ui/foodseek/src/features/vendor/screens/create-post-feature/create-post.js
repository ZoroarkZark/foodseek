import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, View, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ThemeProvider,  Layout, Text, Button } from 'react-native-rapi-ui';
import { ScrollViewDismissKeyboard, Title } from '../../../../components/common';
import Container from '../../../../components/styling/Container'
import TextWrapper from '../../../../components/styling/TextWrapper';
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { AuthenticationContext } from '../../../../context/AuthenticationContext'

export const CreatePost = ( { route, navigation } ) => {
    const { onUpload } = useContext( FoodCardContext )
    const { user } = useContext( AuthenticationContext )
    const [foodName, setFoodName] = useState('');
    const [tags, setTags] = useState([]);
    const [testTags, setTestTags] = useState('');
    const [currentTags, setCurrentTags] = useState('');
    const [numTags, setNumTags] = useState(0);
    const [timeAvailable, setTimeAvailable] = useState('');
    const uri = (route.params) ? route.params.uri : "";
    //console.log( `recieved uri ${ uri }` );
    

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

    function upload () {
        console.log(tags)
        if (uri) onUpload({uri, item: foodName, tags, timestamp: new Date(), vendor: user.id})
    }

    if (uri == ""){
        return (
            <ScrollViewDismissKeyboard>
                <Container>
                    <Title>Upload Food</Title>
                    <Button text='Take Picture' style={{marginTop:20, marginBottom:20}} onPress={() => checkInputs(foodName)}/>
                    <TextInput style={styles.input} value={foodName} placeholder="Enter Item Name..." onChangeText={setFoodName}/>
                </Container>
            </ScrollViewDismissKeyboard>
        );
    } else {
        return (
            <ScrollViewDismissKeyboard>
                <View style={styles.container}>
                    <TextWrapper>New Item</TextWrapper>
                    <View style={styles.row}>
                        <Image alt='image didnt load' style={styles.image} source = {{uri: uri}}/>
                        <Text style={styles.text2}>Item Name: {foodName}</Text>
                    </View>
                    <Text>{testTags}</Text>
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={currentTags} placeholder="Enter Tags..." onChangeText={setCurrentTags}/>
                        <Button text='Testing button' style={{marginTop:20, marginBottom:20}} onPress={() => checkTags()}/>
                    </View>
                    <Button text='Submit Post' style={{marginTop:20, marginBottom:20}} onPress={() => upload()}/>
                </View>
            </ScrollViewDismissKeyboard>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        resizeMode: 'contain',
        height: 104,
        width: 70,
        borderRadius: 15,
        borderWidth: 2,
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        padding: 10,
    },
    text2: {
        fontSize: 25,
        paddingLeft: 30,
        paddingRight: 60,
    }
  });
  