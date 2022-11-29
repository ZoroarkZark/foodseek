import React, { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CheckBox } from 'react-native-rapi-ui'
import { PickerInput } from '../../../../../components/common'


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



export const EditTextInput = ( props ) => {
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
export const TimeInput = ( props ) => {
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
      <View style={{flexDirection: 'row', alignContent: 'stretch'}}>
      <View style={{flex: 2, paddingHorizontal: 2}}><EditTextInput {...rest}  value={hour} onChangeText={( text ) => setHour( text.match( /\b1[0-2]\b|\b[0-1]?[0-2]\b/ ) )} onSubmitEditing={setNextState} blurOnSubmit={true} maxLength={2} />
      </View>
      <View style={{flex: 0, paddingHorizontal: 2}}>
      <Text {...rest} style={{fontSize: 50 }}>:</Text>
      </View>
      <View style={{flex: 2, paddingHorizontal: 2}}>
      <EditTextInput {...rest}  value={hour} onChangeText={( text ) => setHour( text.match( /\b5[0-9]\b|\b[0-4]?[0-9]\b/ ) )} onSubmitEditing={setNextState} blurOnSubmit={true} maxLength={2} />
      </View>
      <View style={{flex: 2, paddingHorizontal: 2, left: 10}}>
      <PickerInput {...rest} value={ampm} onValueChange={setAMPM} options={[ { label: 'am', value: 'am' }, { label: 'pm', value: 'pm' }, ]} />
      </View>
      <View style={{flex: 2, paddingHorizontal: 4, left: 25}}>
      <CheckBox size={50} value={confirm} onValueChanges={setConfirm} />
      </View>
      </View>
  )
}


export const Edit = ( props ) => {
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
      return ( <TimeInput value={text} setValue={setText} setNextState={setReady} /> )
      
  }
  

}
  





export const EditDetail = ( props ) => {
  const { callback, value, setValue, ...rest } = props
  const [ edit, setEdit ] = useState( false )
  
  const setNextState = () => {
      setEdit( !edit )
      callback()
  }

  const display = () => {
      if ( !edit ) return <Detail {...rest} />
      return <Edit {...{...rest, value, setValue, setNextState} } />
  }

  return (
      <TouchableOpacity style={{paddingVertical: 10}} onPress={setNextState}>
          {display()}
      </TouchableOpacity>
  )
  
  
}


