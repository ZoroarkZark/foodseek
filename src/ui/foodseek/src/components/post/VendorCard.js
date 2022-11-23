import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Section, SectionContent, SectionImage } from 'react-native-rapi-ui'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';


// PostCard makes up a single list item
const VendorCard = (props) => {
    const data = props.data
    const navigation = useNavigation();

    return (
        //TODO: wrap section (card/item) in touchable opacity container here to include onPress behavior of navigating from post listing to another view screen that contains reservation button
        <TouchableOpacity onPress={() => {navigation.navigate('ExpandedPost', {card: data, id: data.id, vendor: data.vendor, image: data.image, cuisine: data.cuisine, item: data.item, distance: data.travel, time: data.time, address: data.address, phoneNumber: data.phoneNumber})}}>
            <Section>
                <SectionImage source={data.image} height={200} />
                <SectionContent padding={10}>
                    <View style={style.column}>
                        <View style={style.row}>
                            <Text style={style.title}>{data.vendor.name}</Text>
                            <TouchableWithoutFeedback>
                                <TouchableOpacity>
                                    {/* <FavoriteButton vendor={data.vendor} /> */}
                                </TouchableOpacity>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={style.row}>
                            <Text style={style.subtextLeft}>
                                {data.cuisine}
                            </Text>
                            <Text style={style.subtextRight}></Text>
                        </View>
                        <View style={style.row}>
                            <Text style={style.subtextLeft}>{data.item}</Text>
                            <Text style={style.subtextRight}>
                                {data.travel} / {data.time}
                            </Text>
                        </View>
                    </View>
                </SectionContent>
            </Section>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    title: {
        flex: 1,
        fontSize: 18,
        textAlign: 'left',
        fontWeight: 'bold',
        paddingVertical: 4,
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
})

export default memo(VendorCard)
