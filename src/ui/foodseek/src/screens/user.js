import React from 'react';
import { useContext } from 'react';
import { Text, View } from 'react-native';
import { AuthContext } from '../components/caching/CreateAccountContext';
export const UserScreen = ({ navigation, route }) => {
    const {user} = useContext(AuthContext);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>User Details:</Text>
            <Text>Email:{user.Email}</Text>
            <Text>Password:{user.Pass}</Text>

        </View>
    );
};
{/*UserScreen.navigationOptions = {
    title: 'User Details'
};*/}