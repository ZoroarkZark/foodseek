// returns a search page that simply jumps to the posts page with the search submitted there
import React, {useState} from "react";
import { StyleSheet, Text, View, ImageBackground} from 'react-native'
import { Section, SectionContent, SectionImage } from 'react-native-rapi-ui'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import { styles } from "../../../../components/styleSheet";
import {
    TextButton,
    Title,
    SearchInput,
    ScrollViewDismissKeyboard,
} from '../../../../components/common'


export const Search = ( {navigation} ) => {
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');

    return (
        <ScrollViewDismissKeyboard>
        <View>
            <Text> Name </Text>
            <SearchInput
                    value={search}
                    onChangeText={(text) => setSearch(text)}
            >
                    Search name...
            </SearchInput>
            <Text> 


            </Text>
            <Text> Location </Text>
            <SearchInput
                    value={location}
                    onChangeText={(text) => setLocation(text)}
            >
                    Search location...
            </SearchInput>
            <TextButton
                    style={styles.textButton}
                    onPress={() => {
                        if ((search === '') && (location === '')){
                           alert("Nothing entered into search bar. Please enter something in.")
                        }
                        else if ((search != '') && (location != '')){
                            navigation.navigate('Posts')
                        }
                        else {
                           alert("Incomplete input. Please enter in any remaining fields.")
                        }
                    }
                }
            >
                    Submit Search
            </TextButton>
        </View>
        </ScrollViewDismissKeyboard>
    );
}