import React, { useContext, useRef, useEffect, useState } from 'react'
import { AutocompleteSearchBar } from '../../../../components/api/GooglePlacesInput'
import PostList from '../../../../components/post/PostList' // import the component with the implemented flatlist
import { DATA } from '../../../../components/post/TestData' // import some local dummy data for demo purposes
import { FoodCardContext } from '../../../../context/FoodCardContext'
import { View, Text, useWindowDimensions, Modal } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { ToggleButton } from 'react-native-paper'

export const ToggleButtonExample = ({ label }) => {
    const [status, setStatus] = React.useState('unchecked')

    const onButtonToggle = (value) => {
        setStatus(status === 'checked' ? 'unchecked' : 'checked')
    }

    return (
        <ToggleButton
            icon={() => (
                <View>
                    <Text
                        style={{
                            borderTopLeftRadius: 9,
                            borderTopRightRadius: 9,
                            borderBottomLeftRadius: 9,
                            borderBottomRightRadius: 9,
                            height: 18,
                            color: 'grey',
                        }}
                    >
                        {label}
                    </Text>
                </View>
            )}
            style={{
                borderWidth: 0.5,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                width: label.length * 12,
                height: 23,
                marginRight: 4,
            }}
            value={label}
            status={status}
            onPress={onButtonToggle}
        >
            <Text>{label}</Text>
        </ToggleButton>
    )
}

const exampleFilters = [
    { label: 'Fast Food' },
    { label: 'Snacks' },
    { label: 'Drinks' },
    { label: 'American' },
    { label: 'Mexican' },
    { label: 'Vegan' },
    { label: 'Sort By: Nearest' },
    { label: 'Sort By: Newest' },
    { label: 'Sort By: Oldest' },
    { label: 'Salad' },
    { label: 'Sandwiches' },
    { label: 'Chinese' },
    { label: 'Thai' },
    { label: 'Mediterranean ' },
]

// Returns a PostList to display a list of available vendor posts to the user
export const Posts = ({ navigation }) => {
    const { cards, test, onRefresh, loading } = useContext(FoodCardContext)
    const { width, height } = useWindowDimensions()
    const insets = useSafeAreaInsets()
    const filters = exampleFilters
    const placesRef = useRef()

    const searchBar = () => ({
        width: width - 20,
        paddingRight: 10,
        paddingLeft: 10,
    })
    // TODO sql server keeps going down but we need to operate on cards so this just sets the default cards before anything
    useEffect(() => {
        test(DATA)
    }, [])

    return (
    <><SafeAreaView>
            <Modal>
                
                <AutocompleteSearchBar
                placesRef={placesRef}
                style={searchBar}
                    />
                    <ScrollView
                flex={1}
                horizontal={true}
                keyboardShouldPersistTaps={'handled'}
                paddingTop={6}
                contentInset={{
                    top: 0,
                    left: 10,
                    bottom: 0,
                    right: 10,
                }}
                showsHorizontalScrollIndicator={false}
            >
                {filters.map((filter) => {
                    return (
                        <View
                            style={{
                                flexDirection: 'horizontal',
                                flex: 10,
                            }}
                        >
                            <ToggleButtonExample
                                flex={9}
                                label={filter.label}
                            />
                            <View flex={1}></View>
                        </View>
                    )
                })}
            </ScrollView>
                
            
        </Modal>
        <View style={{ color: '#fff', paddingTop: 6 }}>
            <PostList
                DATA={cards ? cards : DATA}
                refreshing={loading}
                onRefresh={() => onRefresh()}
            />
        </View>
        </SafeAreaView>
    </>
    )
}
