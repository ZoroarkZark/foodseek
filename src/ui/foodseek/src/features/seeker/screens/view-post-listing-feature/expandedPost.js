import React, { useContext } from "react";
import { StyleSheet, Text, View, ImageBackground, Alert } from 'react-native'
import { Section, SectionContent, SectionImage } from 'react-native-rapi-ui'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import styles from '../../../../style/styleSheet'
import { FoodCardContext } from '../../../../context/FoodCardContext'
// Probably change to the styles inside of features

export const ExpandPost = ( props ) => {
    const { onReserve } = useContext( FoodCardContext )
    const data = props.data;
    const { card, id, vendor, cuisine, item, distance, time, address, phoneNumber, image} = props.route.params;
    const identity = JSON.stringify(id);

    const yesNoAlert = () => {
        Alert.alert(
            "Confirmation",
            "Would you like to accept this post?",
            [
                {
                    text: "Yes",
                    onPress: () => {Alert.alert("Confirmation","Got it! Sending back to list."), props.navigation.goBack()}
                },
                {
                    text: "No",
                    onPress: () => {Alert.alert("Confirmation","Got it! Returning to post.")}
                },
            ],
        );
    };

    //Ideally, want to have data from postCard read in, and data then referenced from info in postCard, and looked up
    return (
    <View>
    <ImageBackground source={image} resizeMode= "stretch" style={{borderColor: "black", borderWidth: 6, width: 360, height: 300}}>
        <View style={{flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-start', textAlign: 'left', paddingTop: 240, flexDirection:'row' , flexWrap:'wrap'}}>    
            <Text style={styles.buttonTextStyleWhite}
              numberOfLines={1}>Name: {item}</Text>
        </View>
        <View style={{flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-start', textAlign: 'left', paddingTop: 265, flexDirection:'row' , flexWrap:'wrap'}}>
            <Text style={styles.buttonTextStyleWhite}
              numberOfLines={1}>Food: {cuisine}</Text>    
        </View>
    </ImageBackground>
    
    {/* Section for the info to be placed into. Button to accept is right after.*/}
    
    <Section>
        <SectionContent>
            <Text> Restaurant: {vendor.name}  </Text>
            <Text> </Text> 
            <Text> Phone Number: {phoneNumber}  </Text>
            <Text> </Text> 
            <Text> Address: {address} </Text>
            <Text> </Text>
            <Text> Time to Arrive: {time} </Text>
            <Text> </Text>
            <Text> Current Distance: {distance} </Text>
        </SectionContent>
    </Section>

            <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                onReserve(id, card),
                yesNoAlert()
            }}>
        <Text style={styles.buttonTextStyle}> Accept </Text>
    </TouchableOpacity>
    </View>
    );
}
