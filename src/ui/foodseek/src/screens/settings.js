import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const SettingsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Edit Display Name {">"}</Text>
            <Text style={styles.text}>Email</Text>
            <Text style={styles.text}>Vendor or Eater</Text>
            <Text style={styles.text}>Style</Text>
            <Text style={styles.text}>Log Out {">"}</Text>
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
})