import React from "react";
import { StyleSheet, Text, View, ImageBackground} from 'react-native'
import { Section, SectionContent, SectionImage } from 'react-native-rapi-ui'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import { styles } from "../../../../components/styleSheet";
// Probably change to the styles inside of features

export const ExpandPost = (props) => {
    const data = props.data;
    const { id, cuisine, item } = props.route.params;
    const identity = JSON.stringify(id);

    //Ideally, want to have data from postCard read in, and data then referenced from info in postCard, and looked up for the 
    return (
    <View>
    <ImageBackground source={require('../../../../../assets/icons/beer-outline.png')} resizeMode= "contain" style={{borderColor: "black", borderWidth: 6, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: 360, height: 320}}>
        <View style={{position: 'absolute', top: 0, left: 10, right: 0, bottom: 0, justifyContent: 'center', textAlign: 'center', paddingTop: 220 }}>    
            <Text 
              numberOfLines={1}>{cuisine} </Text>
            <Text 
              numberOfLines={1}>{item} </Text>    
        </View>
    </ImageBackground>
    
    {/* Section for the info to be placed into. Button to accept is right after.*/}
    
    <Section>
        <SectionContent>
            <Text> Restaurant: </Text>
            <Text> </Text>
            <Text> Address:  </Text>
            <Text> </Text>
            <Text> Time to Arrive: </Text>
            <Text> </Text>
            <Text> Current Distance: </Text>
        </SectionContent>
    </Section>

    <TouchableOpacity style={styles.buttonStyle} onPress={() => {props.navigation.goBack()}}>
        <Text style={styles.buttonTextStyle}> Accept </Text>
    </TouchableOpacity>
    </View>
    );
}

// <SectionImage source= {require('../../../../../assets/icons/fast-food-outline.png')} height ={200}/>