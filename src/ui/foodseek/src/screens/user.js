import React, {useState} from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-rapi-ui'
import { SI } from '../scripts/serverinterface.js'



export const UserScreen = ({ navigation, route }) => {
    const [test, setTest] = useState("");

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>User Details 12334</Text>
            <Button text="Continue" onPress={() => {
                console.log("button clicked")
                let a = SI.xmlTest((body) => {
                    console.log(body);
                    setTest(body.test);
                });

                
            
                }}/>
            <Text>{test}</Text>
        </View>
    );
};
{/*UserScreen.navigationOptions = {
    title: 'User Details'
};*/}