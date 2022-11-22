import { DATA } from '../../../../components/post/TestData' 
import React, { useContext, useEffect, useState } from 'react'
import { Text, FlatList, View } from 'react-native'
import { Title } from '../../../../components/common'

// globals: imports provide the food card services and location services
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { LocationContext } from '../../../../context/LocationContext'

// rendering: imports provide the viewable components to render
import { PostsSectionList } from '../view-post-listing-feature/PostsSectionList'
import { SearchInput } from '../../../../components/common'

// Provides Odin
import { Odin } from '../../../../components/common/Odin'
import { Button } from 'react-native-rapi-ui'

// TODO: move to config for testing

export const Orders = () => {
    const { orders } = useContext( FoodCardContext )
    
    
    // defines the props for the Posts SectionList (the view for the screen)
    function fieldCheck (field){
        var newField; 
        if (field)
            newField = field
        else
            newField = "NULL"
        return newField;
    }

    const renderListEmptyComponent = () => (
        <View>
            <Text>
                No work yet!
            </Text>
        </View>
    );

    return (
        
        <View>
            <Title>Orders</Title>
            <FlatList
                data={orders}  
                renderItem={({ item }) => (
                    <>
                        <Text>Vendor ID: {fieldCheck(item.id)}</Text>
                        <Text>Name: {fieldCheck(item.name)}</Text>
                    </>
                )}
                keyExtractor={(data) => {data.id}}
                ListEmptyComponent={renderListEmptyComponent()}
            />
        </View>
    )
}