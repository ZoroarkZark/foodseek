import React, { useContext, useEffect, useState } from "react";
import { Text, View, Image, Dimensions, KeyboardAvoidingView, TextInput, Platform } from 'react-native'


import {
    TouchableOpacity
} from 'react-native-gesture-handler'
import styles from '../../../../style/styleSheet'
import { FoodCardContext } from '../../../../context/FoodCardContext'
import Container from '../../../../components/styling/Container'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { PickerInput, ScrollViewDismissKeyboard, TextButton } from '../../../../components/common'
import { Button, CheckBox } from 'react-native-rapi-ui'
import { useNavigation } from "@react-navigation/native";




export const toTitleCase = (str) => {
    return str.replace(/\b(\w)/g, k => k.toUpperCase())
}

// Probably change to the styles inside of features
export const Detail = ( { icon, label, description, rightContent, fontSize=16, ...rest } ) => {
    return (
        <View style={{ flexDirection: 'row'}} {...rest}>
            <View style={{ minWidth: '85%', flexDirection: 'column' }}>
                <View>
                    <Text {...rest} numberOfLines={1} style={{fontSize: fontSize+2, fontWeight: '700'}} >
                        <>{icon({size: fontSize,...rest})}{label} </>
                    </Text>
                </View>
                <View>
                    <Text {...rest} numberOfLines={1} style={{color: 'grey', fontSize: fontSize}} >
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
    return ( <TextInput {...props} style={{ width: width,
        backgroundColor: '#fff',
        borderBottomColor: 'green',
        borderBottomWidth: 1,
        height: 50,
        paddingHorizontal: 5,
        
    }} /> )
}


// TODO: get this to display all in a row
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
        <>
        <EditTextInput {...rest} numberOfLines={1} width='27%' value={hour} onChangeText={( text ) => setHour( text.match( /\b1[0-2]\b|\b[0-1]?[0-2]\b/ ) )} onSubmitEditing={setNextState} blurOnSubmit={true} maxLength={2} />
        <Text {...rest} numberOfLines={1} style={{fontSize: 50 }}>:</Text>
        <EditTextInput {...rest}  value={hour} onChangeText={( text ) => setHour( text.match( /\b5[0-9]\b|\b[0-4]?[0-9]\b/ ) )} onSubmitEditing={setNextState} blurOnSubmit={true} maxLength={2} />
        <PickerInput {...rest} value={ampm} onValueChange={setAMPM} options={[ { label: 'am', value: 'am' }, { label: 'pm', value: 'pm' }, ]} />
        <CheckBox value={confirm} onValueChanges={setConfirm} />
        </>
    )
}


const Edit = ( props ) => {
    const { Alternative, value, setValue, setNextState, minLength = 4, maxLength = 50} = props
    const [ text, setText ] = useState( value )
    const [ ready, setReady ] = useState( false )
    const [ error, setError ] = useState( [] ) // TODO: add helper text
    

    useEffect( () => {
        if ( !ready ) return
        setValue( text )
        setNextState()
    }, [ ready, setReady ] )
    
    if ( !Alternative ) {
        return   (<EditTextInput width="100%" value={text} onChangeText={setText} onSubmitEditing={setReady} blurOnSubmit={true} minLength={minLength} maxLength={maxLength} /> )
    } else {
        return ( <Alternative value={text} setValue={setText} setNextState={setReady} /> )
        
    }
    

}
    





const EditDetail = ( props ) => {
    const { callback, value, setValue, ...rest } = props
    const [ edit, setEdit ] = useState( false )
    
    const setNextState = () => {
        setEdit( !edit )
        callback()
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

export const tagsToStr = (arr) => {
    if (arr && arr.length >= 1){
        let str = arr.join( ' #' )
        return '#'+str
    }
    return '#'
}

export const toTags = ( str ) => {
    let result = str.split( '#' )
    return result.map((e) => {if (e) {return e.trim()}}).filter(function(item){return item !== undefined})
}

export const ExpandedView = ( props ) => {
    const { loading, setLoading, onUpdate, setComplete, timestamp, vendor, phone, address, time, distance, card, image, backgroundColor, item } = props
    const {id, tags} = card
    const [ name, setName ] = useState( item )
    const [ tagged, setTagged ] = useState(tagsToStr(tags))
    const [ size, setSize ] = useState( Dimensions.get( 'window' ) )
    const [ end, setEnd ] = useState( {hours: new Date().getHours(), minutes: new Date().getMinutes()} )
    const [ changed, setChanged ] = useState( false )
    const [ editingName, setEditingName ] = useState( false )
    const [ editingTags, setEditingTags ] = useState( false )
    const [ editingTime, setEditingTime ] = useState( false )

    

    

    // checks to see if two arrays contains the same elements
    // https://bobbyhadz.com/blog/javascript-check-if-two-arrays-have-same-elements#:~:text=Use%20the%20every()%20to,met%20for%20all%20array%20elements.
    function areEqual(array1, array2) {
        if (array1.length === array2.length) {
          return array1.every(element => {
            if (array2.includes(element)) {
              return true;
            }
            return false;
          })
        }
        return false;
      }
    
    const nameChanged = () => {
        if ( name != item ) return true
    }

    const tagsChanged = () => {
        // if ( !areEqual( tags, toTags( tagged ) ) ) return true  TODO: throwing error undefined is not an object
        return true
    }

    const timeChanged = () => {
        // if ( end != time ) return true
    }
    
    // only alows update if all fields are submitted (no longer in editing mode) also only if the values have changed
    const readyUpdate = () => {
        if ( !changed ) return false
        if ( editingName || editingTags || editingTime ) return false
        return true
    }

    const onSaveChanges = () => {
        if ( nameChanged() ) onUpdate( id, 'item', name ) 
        console.log('tags: ', toTags(tagged))
        if ( tagsChanged() ) onUpdate( id, 'tags', toTags( tagged ) ) 
        // if (timeChanged()) onUpdate( id, 'time', end )
        setComplete(true) // signal jump back to posts once done loading
    }

    useEffect( () => {
        if (!name) return
        setChanged( nameChanged() )
        
    }, [name, setName] )
    
    useEffect( () => {
        if (!tagged ) return
        setChanged( tagsChanged() )
        
    }, [tagged, setTagged] )
    
    // once we set up time change function properly uncomment the line
    useEffect( () => {
        if ( !end ) return
        // setChanged( timeChanged() )
        
    }, [ end, setEnd ] )
    
    
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
                            <EditDetail callback={() => setEditingName(!editingName)} value={name} setValue={setName} icon={props => <Ionicons name="fast-food-outline" {...props} />} label={` ${ name }`} description={toTitleCase( 'Edit item name' )} rightContent={<></>} />
                <EditDetail callback={() => setEditingTags(!editingTags)} value={tagged} setValue={setTagged} icon={props => <FontAwesome5 name="hashtag" {...props} />} label={` tags ${ tagged.length > 1 ? tagged : '(none)' }`} description={toTitleCase( tagged.length > 1 ? 'Edit hashtags' : 'Add hashtags' )} rightContent={<></>} />
                <EditDetail callback={() => setEditingTime(!editingTime)} value={end} setValue={setEnd} Alternative={props => <TimeInput {...props} />}  icon={props => <FontAwesome5 name="clock" {...props} />} label={` ${ time } remaining`} description={toTitleCase( 'Edit timer' )} rightContent={<></>} />
            </View>
                        {readyUpdate
                            ? <TextButton onPress={onSaveChanges}>{readyUpdate ? 'Save Changes' : !changed ? toTitleCase('Tap on details to edit') : toTitleCase('Type return to finish editing')}</TextButton>
                            : <Text>Make changes by tapping on post details, and hit return when you are done editing.</Text>
                        }
            

            </View>
            </ScrollViewDismissKeyboard>
            </KeyboardAvoidingView>
    </Container>

    )
}

export const ExpandPost = ( props ) => {
    const { loading, setLoading, onUpdate } = useContext( FoodCardContext )
    const { phoneNumber, vendor } = props.route.params
    const backgroundColor = '#fff'
    const [ complete, setComplete ] = useState( false )
    useEffect( () => {
        if ( !complete ) return
        props.navigation.navigate('PostHistory', {refresh: true})
    }, [complete, setComplete])

    //Ideally, want to have data from postCard read in, and data then referenced from info in postCard, and looked up for the 
    return (
        <ExpandedView {...{...props, ...props.route.params, vendor: vendor.name, phone: phoneNumber, setComplete, loading, setLoading, onUpdate, backgroundColor}} />

    )
}

// <SectionImage source= {require('../../../../../assets/icons/fast-food-outline.png')} height ={200}/>