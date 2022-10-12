import React from 'react';
import { Text, View } from 'react-native';
export const UserScreen = ({ navigation, route }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>User Details</Text>
        </View>
    );
};
{/*UserScreen.navigationOptions = {
    title: 'User Details'
};*/}
