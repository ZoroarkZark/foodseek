import React, { useContext, useEffect, useState } from "react";
import { Text, View, Image, Dimensions, KeyboardAvoidingView, TextInput, Platform, VirtualizedList } from 'react-native'


import {
    FlatList,
    TouchableOpacity
} from 'react-native-gesture-handler'
import styles from '../../../../style/styleSheet'
import { FoodCardContext } from '../../../../context/FoodCardContext'
import Container from '../../../../components/styling/Container'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { PickerInput, ScrollViewDismissKeyboard } from '../../../../components/common'
import { CheckBox } from 'react-native-rapi-ui'


export const HelperText = ( props ) => {
    const { error, ...rest } = props
    if ( !error ) return
    return (
        <View>
            {error.map( ( e ) => {
            return <Text {...rest} style={{fontSize: 20, color: 'red'}}>{e.message}</Text>
        })}

        </View>
        
)
}




export const toTitleCase = (str) => {
    return str.replace(/\b(\w)/g, k => k.toUpperCase())
}

// Probably change to the styles inside of features
export const Detail = ( { icon, label, description, rightContent, fontSize=16, ...rest } ) => {
    return (
        <View style={{ flexDirection: 'row'}} {...rest}>
            <View style={{ minWidth: '85%', flexDirection: 'column' }}>
                <View>
                    <Text {...rest} style={{fontSize: fontSize+2, fontWeight: '700'}} >
                        <>{icon({size: fontSize,...rest})}{label} </>
                    </Text>
                </View>
                <View>
                    <Text {...rest} style={{color: 'grey', fontSize: fontSize}} >
                        {description}
                    </Text>
                </View>
            </View>
            <View style={{paddingRight: 20}}>{rightContent}</View>
        </View>
    )
    
}



const EditTextInput = ( props ) => {
    const {width} = props
    return ( <TextInput {...props} style={{width: width,
        backgroundColor: '#fff',
        borderBottomColor: 'green',
        borderBottomWidth: 1,
        height: 50,
        paddingHorizontal: 5,
        
    }} /> )
}



const TimeInput = ( props ) => {
    const {value, setValue,  setNextState, ...rest} = props
    const [ hour, setHour ] = useState(value.hour)
    const [ minute, setMinute ] = useState(value.minute)
    const [ ampm, setAMPM ] = useState( value.hour >= 12 ? 'pm' : 'am' )
    const [ confirm, setConfirm ] = useState( false )

    useEffect( () => {
        if ( !confirm ) return
        setValue({hour: ampm == 'pm' ? hour + 12 : hour, minute: minute})
        setNextState(confirm)
    }, [confirm, setConfirm])
    
    return (
        <View style={{flexDirection: 'row'}}>
            <View>
                <EditTextInput {...rest} value={hour} onChangeText={( text ) => setHour( text.match( /\b1[0-2]\b|\b[0-1]?[0-2]\b/ ) )} onSubmitEditing={setNextState} blurOnSubmit={true} maxLength={2} />
            </View>
            <View>
            <Text {...rest} style={{ fontSize: 50 }}>:</Text>
            </View>
            <View>
            <EditTextInput {...rest} value={hour} onChangeText={( text ) => setHour( text.match( /\b5[0-9]\b|\b[0-4]?[0-9]\b/ ) )} onSubmitEditing={setNextState} blurOnSubmit={true} maxLength={2} />
            </View>
            <View>
            <PickerInput {...rest} value={ampm} onValueChange={setAMPM} options={[ { label: 'am', value: 'am' }, { label: 'pm', value: 'pm' }, ]} />
            </View>
            <View>
            <CheckBox {...rest} value={confirm} onValueChanges={setConfirm} />
                </View>

        </View>
    )
}


const Edit = ( props ) => {
    const { Option, value, setValue, setNextState, minLength = 4, maxLength = 16} = props
    const [ text, setText ] = useState( value )
    const [ ready, setReady ] = useState( false )
    const [ error, setError ] = useState( [] )
    

    useEffect( () => {
        if ( !ready ) return
        setValue( text )
        setNextState()
    }, [ ready, setReady ] )
    
    if ( !Option ) {
        return ( <EditTextInput  width="100%" value={text} onChangeText={setText} onSubmitEditing={setReady} blurOnSubmit={true} minLength={minLength} maxLength={maxLength} /> )
    } else {
        return (
            <Option value={text} setValue={setText} setNextState={setReady} />
        )
    }
    

}
    





const EditDetail = ( props ) => {
    const { value, setValue, ...rest } = props
    const [ edit, setEdit ] = useState( false )
    
    const setNextState = () => {
        setEdit(!edit)
    }

    const display = () => {
        if ( !edit ) return <Detail {...rest} />
        return <Edit {...{ value, setValue, setNextState }} />
    }

    return (
        <TouchableOpacity style={{paddingVertical: 10}} onPress={setNextState}>
            {display()}
        </TouchableOpacity>
    )
    
    
}


export const ExpandedView = ( props ) => {
    
    const { timestamp, vendor, phone, address, time, distance, id, card, image, backgroundColor, item, tags } = props
    const [ name, setName ] = useState( item )
    const [ tagged, setTagged ] = useState( [ tags ].join( ' #' ) )
    const [ size, setSize ] = useState( Dimensions.get( 'window' ) )
    const [ end, setEnd ] = useState( {hours: new Date().getHours(), minutes: new Date().getMinutes()} )
    
    

    return (
        <Container paddingTop={100} >
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollViewDismissKeyboard>
            <View backgroundColor={backgroundColor} borderRadius={10} overflow='hidden' flexDirection='column'>
                    <View style={{ flexDirection: 'row', flexGrow: .9}}>
                    <TouchableOpacity style={{width: size.width, height: size.width}}>
                            <Image style={{ width: size.width, height: size.width }} source={image} />
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 40, bottom: '12%', paddingHorizontal: 20, position: "absolute", textShadowColor: 'black', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }} >{name}</Text>
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 25, bottom: '5%', paddingHorizontal: 20, position: "absolute", textShadowColor: 'black', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10}} >{vendor}</Text>
                    </TouchableOpacity>
                    </View>
                    
            <View style={{ padding: 20 }}>
                <EditDetail value={name} setValue={setName} icon={props => <Ionicons name="fast-food-outline" {...props} />} label={` ${ name }`} description={toTitleCase( 'Edit item name' )} rightContent={<Text style={{color: 'grey', fontSize: 16, fontWeight: '300', right: 0}}>{distance}</Text>} />
                            <EditDetail value={tagged} setValue={setTagged} icon={props => <FontAwesome5 name="hashtag" {...props} />} label={` ${ tagged }`} description={toTitleCase( tagged ? 'Edit hashtags' : 'Enter hashtags' )} rightContent={<></>} />
                            <EditDetail value={end} setValue={setEnd} Option={TimeInput}  icon={props => <FontAwesome5 name="clock" {...props} />} label={` ${ time } remaining`} description={toTitleCase( 'Edit timer' )} rightContent={<></>} />
                        
            
                        </View>
                       
            <TouchableOpacity style={styles.buttonStyle} onPress={() => {
                onReserve(id, card),
                yesNoAlert()
            }}>
        <Text style={styles.buttonTextStyle}> Accept </Text>
                </TouchableOpacity>
                </View>
            </ScrollViewDismissKeyboard>
            </KeyboardAvoidingView>
    </Container>

    )
}

export const ExpandPost = ( props ) => {
    const { onReserve } = useContext( FoodCardContext )
    const { phoneNumber, vendor } = props.route.params
    const backgroundColor = '#fff'

    //Ideally, want to have data from postCard read in, and data then referenced from info in postCard, and looked up for the 
    return (
        <ExpandedView {...{...props, ...props.route.params, vendor: vendor.name, phone: phoneNumber, onReserve, backgroundColor}} />

    )
}

// <SectionImage source= {require('../../../../../assets/icons/fast-food-outline.png')} height ={200}/>