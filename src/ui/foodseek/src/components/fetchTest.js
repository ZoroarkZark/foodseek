// function calls fetch to url, sucks out the json, returns a display of loading (while awaiting data) or the data keyed to the user
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export const Users = props => {
    const [isLoading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    getUsers = () => {
        fetch('https://jsonplaceholder.typicode.com/users/')
          .then((response) => response.json())
          .then((json) => setUsers(json))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
    }
    useEffect(() => {
        setLoading(true);
        getUsers();
    }, []);
    return(
        <View style={{ padding: 20 }}>
            {isLoading ? <Text>Loading...</Text> :
            (
                <FlatList
                    data={users}
                    keyExtractor={({ id }) => id.toString()}
                    renderItem={({ item }) => <Text>{item.name}  </Text>}
                />
            )}
        </View>
    )
}
