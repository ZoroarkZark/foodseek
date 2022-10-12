import React from 'react';
import { Text, View } from 'react-native';


export const ResponseScreen = ({route, navigation}) => {
    const { resp, response } = route.params; // saves the json from the response given after the fetch function is called
    let str = json.stringify(response);

    return (
        <View style={{ padding: 20 }}>
            {isLoading ? <Text>Loading...</Text> :
            (
                <>
                <Text>The response body was...</Text>
                <Text>str</Text>
                </>
            )}
        </View>
    );
};