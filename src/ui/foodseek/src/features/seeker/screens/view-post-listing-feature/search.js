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


export const Search = ( { navigation } ) => {
    const [search, setSearch] = useState('');
    const [cuisine, setCuisine] = useState('');

    
    return (
        <ScrollViewDismissKeyboard>
        <View>
            <Text> Post Name </Text>
            <SearchInput
                    value={search}
                    onChangeText={(text) => setSearch(text)}
            >
                    Search name...
            </SearchInput>
            <Text> 


            </Text>
            <Text> Cuisine </Text>
            <SearchInput
                    value={cuisine}
                    onChangeText={(text) => setCuisine(text)}
            >
                    Search cuisine...
            </SearchInput>
            <TextButton
                    style={styles.textButton}
                    onPress={() => {
                        if ((search === '') && (cuisine === '')){
                           alert("Nothing entered into search bar. Please enter something in.")
                        }
                        else if ((search != '') && (cuisine != '')){
                            navigation.navigate('Posts', {searchName: search})
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