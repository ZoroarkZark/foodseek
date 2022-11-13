import React, { useContext, useRef, useEffect, useState } from 'react'
import { AutocompleteSearchBar } from '../../../../components/api/GooglePlacesInput'
import PostList from '../../../../components/post/PostList' // import the component with the implemented flatlist
import { DATA } from '../../../../components/post/TestData' // import some local dummy data for demo purposes
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { StyleSheet, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler'

export const FilterButton = (label, styles, toggleOn, toggleOff) => {

    const [ selected, setSelected ] = useState( false )
    const touch = {
        activeOpacity: 1,
        underlayColor: 'green',
        style: selected ? styles.toggleOn : styles.toggleOff,
        onHideUnderlay: () => toggleOn(),
        onShowUnderlay: () => toggleOff(),
        onPress: () => setSelected(!selected)
    }
    return (
        <TouchableHighlight {...touch}>
            <Text style={{paddingLeft: 10, paddingRight: 10}}>{label}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create( {
    toggleOn: {
        borderColor: 'green',
        borderWidth: 1,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        height: 18,

        
    },
    toggleOff: {
        borderColor: 'green',
        borderWidth: 1,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        height: 18,

    }
})

const exampleFilters = [
{ label: "Fast Food",},
{ label: "Snacks",},
{ label: "Drinks",},
{ label: "American",},
{ label: "Mexican",},
{ label: "Vegan",},
{ label: "Sort By: Nearest",},
{ label: "Sort By: Newest",},
{ label: "Sort By: Oldest",},
{ label: "Salad",},
{ label: "Sandwiches",},
{ label: "Chinese",},
{ label: "Thai",},
{ label: "Mediterranean ", }
]
// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ( { navigation } ) => {
    const { cards, test, onRefresh, loading } = useContext( FoodCardContext )
    const filters = exampleFilters
    const placesRef = useRef()

    const FilterButton = (label, styles, toggleOn, toggleOff) => {

        const [ selected, setSelected ] = useState( false )
        const touch = {
            activeOpacity: 1,
            underlayColor: 'green',
            style: selected ? styles.toggleOn : styles.toggleOff,
            onHideUnderlay: () => toggleOn(),
            onShowUnderlay: () => toggleOff(),
            onPress: () => setSelected(!selected)
        }
        return (
            <TouchableHighlight {...touch}>
                <Text style={{paddingLeft: 10, paddingRight: 10}}>{label}</Text>
            </TouchableHighlight>
        )
    }


    // TODO sql server keeps going down but we need to operate on cards so this just sets the default cards before anything
    useEffect( () => {
        test(DATA)      
    }, [] )
    

    return (
        <>
            <SafeAreaView>
                <View style={{ color: '#fff', paddingTop: 60, paddingBottom: 0, paddingLeft: 10, paddingRight: 10}}>
                    <AutocompleteSearchBar placesRef={placesRef} />
                    <ScrollView
                        horizontal={true}
                        contentInset={{ top: 0, left: 10, bottom: 0, right: 10 }}
                        showsHorizontalScrollIndicator={false}
                    >
                        {filters.map( ( filter ) => FilterButton( filter.label, styles, () => console.log( 'on' ), () => console.log( 'off' )) )}
                    </ScrollView>
                </View>
            </SafeAreaView>
            
            <View style={{ color: '#fff', paddingTop: 6 }}>
            <PostList DATA={cards ? cards : DATA} refreshing={loading} onRefresh={() => onRefresh()} /> 

            </View>
            
        </>
        
    )
}
