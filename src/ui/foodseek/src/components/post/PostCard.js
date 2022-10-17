import React, { memo, useState } from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from 'react-native';
import {Section, SectionContent, SectionImage} from 'react-native-rapi-ui';
import { FontAwesome } from '@expo/vector-icons';



// PostCard makes up a single list item
const PostCard = (props) => { 
    const data = props.data;
    const expandPost = props.expandPost;
    const setFavorite = props.setFavorite;
    return (
    //TODO: wrap section (card/item) in touchable opacity container here to include onPress behavior of navigating from post listing to another view screen that contains reservation button
    <TouchableOpacity onPress={expandPost}>
        <Section >
            <SectionImage source={data.image} height={200} />
            <SectionContent padding={10}>
                <View style={ styles.column } >
                    <View style={ styles.row } >
                        <Text style={ styles.title }>{data.vendor}</Text>
                        <TouchableWithoutFeedback>
                            <FontAwesome.Button name={data.favorite ? "heart" : "heart-o"} color={styles.favorite.color} style={styles.favorite} onPress={setFavorite} />
                        </TouchableWithoutFeedback>
                        
                    </View>
                    <View style={ styles.row } >
                        <Text style={ styles.subtextLeft }>{data.cuisine}</Text>
                        <Text style={ styles.subtextRight }></Text>
                    </View>
                    <View style={ styles.row } >
                        <Text style={ styles.subtextLeft }>{data.item}</Text>
                        <Text style={ styles.subtextRight }>{data.travel}</Text>
                    </View>
                </View>
            </SectionContent>
        </Section>
    </TouchableOpacity>
);
};



const styles = StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: 'column', 
        alignContent: 'center'
    },
    row: {
        flex:1,
        flexDirection: 'row', 
        alignContent:'space-between'
    },
    title: {
        flex: 1,
        fontSize: 18,
        textAlign: 'left',
        fontWeight: 'bold',
        paddingVertical: 4
    },
    favorite: {
        flex: 1,
        color: 'grey',
        backgroundColor: '#fff',
        fontSize: 16,
        textAlign: 'right',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        paddingVertical: 4,
      },
    subtextLeft: {
        flex: 1,
        fontSize: 16,
        color: 'grey',
        textAlign: 'left',
    },
    subtextRight: {
        flex: 1,
        fontSize: 16,
        color: 'grey',
        textAlign: 'right',
      },
  });

  export default memo(PostCard);