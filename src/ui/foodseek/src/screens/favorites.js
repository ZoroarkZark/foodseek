import React, { useContext } from 'react'
import { Text, View, FlatList } from 'react-native'
import { Title } from '../components/common'

import { FavoritesContext } from '../context/FavoritesContext'

// simply lists the favorite items for this user
const Favorites = ({ navigation }) => {
    const { favorites } = useContext(FavoritesContext)

    return (
        <View
            style={{
                flex: 3,
                paddingHorizontal: 20,
                paddingTop: 30,
            }}
        >
            <Title>Favorites</Title>
            <FlatList
                data={favorites}
                renderItem={({ item }) => (
                    <>
                        <Text>Vendor ID: {item.id}</Text>
                        <Text>Name: {item.name}</Text>
                    </>
                )}
                keyExtractor={(data) => data.id}
            />
        </View>
    )
}

export default Favorites
