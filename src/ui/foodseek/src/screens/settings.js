import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AuthenticationContext } from '../context/AuthenticationContext';

export const SettingsScreen = ({ navigation }) => {
    const {user} = useContext(AuthenticationContext);
    const [allegiance, setAllegiance] = useState('an eater');
    const [email, setEmail] = useState('loading email');

    function allegianceHandler() {
        if (allegiance == 'an eater') {
            setAllegiance('a vendor');
        }
        else {
            setAllegiance('an eater');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Username: {user.un}{">"}</Text>
            <Text style={styles.text}>Email: {email}</Text>
            <Text style={styles.text}>type: {user.type}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Change allegiance' onPress={allegianceHandler}/>
            </View>
            <Text style={styles.text}>Style {">"}</Text>
            <Text style={styles.text}>Barcode Goes Here!</Text>
            <View style={styles.buttonContainer}>
                <Button title='Log Out'/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6E6E3',
        alignItems: 'left',
        justifyContent: 'left',
    },
    text: {
        padding: 10,
        fontSize: 25,
    },
    buttonContainer: {
        padding: 10,
        fontSize: 25,
        backgroundColor: 'blue',
    },
}
)