import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, View, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AntDesign, Entypo, FontAwesome5, Fontisto, Ionicons } from '@expo/vector-icons'
import Container from '../../../../../components/styling/Container'
import { ScrollViewDismissKeyboard, TextButton } from '../../../../../components/common'
import { Detail } from '../../../../vendor/screens/view-post-feature/utils/EditDetail'
import { tagsToStr, toTitleCase } from '../../../../vendor/screens/view-post-feature/utils'
import { TimeRemaining } from '../../../../../util'





// expanded view for the seeker's orders
export const ExpandedView = ( props ) => {
  const { loading, setLoading, setComplete, vendor, phone, address, time, distance, card, backgroundColor, item, actionName } = props
  const { id, tags, img_url, expiration } = card
  const [ tagged, setTagged ] = useState(tagsToStr(tags))
  const [ size, setSize ] = useState( Dimensions.get( 'window' ) )
  const [ action, setAction ] = useState( false )
  const [timeRemaining, setTimeRemaining] = useState(TimeRemaining({end: new Date(expiration)}))
  
  const pressedAction = () => {
      setAction(true)
  }

  const pressedNevermind = () => {
    setAction(false)
  }

  const pressedConfirm = () => {
    setComplete(true)
  }

  
  useEffect( () => {
    const interval = setInterval( () => {
      setTimeRemaining( TimeRemaining( { end: new Date( expiration ) } ) )
    }, 60000 )
    return () => clearInterval(interval)
  }, [])

    return (
        <Container paddingTop={100} >
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollViewDismissKeyboard>
            <View backgroundColor={backgroundColor} borderRadius={10} overflow='hidden' flexDirection='column'>
                    <View style={{ flexDirection: 'row', flexGrow: .9}}>
                    <TouchableOpacity style={{width: size.width, height: size.width}}>
                            <Image style={{ width: size.width, height: size.width }} source={{uri: img_url}} />
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 40, bottom: '12%', paddingHorizontal: 20, position: "absolute", textShadowColor: 'black', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }} >{item}</Text>
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 25, bottom: '5%', paddingHorizontal: 20, position: "absolute", textShadowColor: 'black', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10}} >{vendor}</Text>
                    </TouchableOpacity>
                    </View>
                    
            <View style={{ padding: 20 }}>
                <Detail icon={props => <Fontisto name="shopping-store" {...props} />} label={` ${ vendor }`} description={toTitleCase( 'vendor name' )} rightContent={<></>} />
                <Detail fullLength={true} icon={props => <FontAwesome5 name="walking" {...props} />} label={` ${ time } walk`} description={toTitleCase( address )} rightContent={<Text style={{color: 'grey', fontSize: 16}}>{distance}</Text>} />
                <Detail icon={props => <AntDesign name="phone" {...props} />} label={` ${phone}`} description={'Business Phone'} rightContent={<></>} />
                <Detail icon={props => <FontAwesome5 name="clock" {...props} />} label={` ${ timeRemaining.message == '' ? 'Offer Has Expired' : timeRemaining.message }`} description={` ${ timeRemaining.message == '' ? '' : 'Time Remaining' }`} rightContent={<></>} />
            </View>
              {!action
                            ? <TextButton onPress={pressedAction}>{toTitleCase(actionName)}</TextButton>
                :
                <>
                  <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    <View>
                      <TextButton onPress={pressedConfirm}>{toTitleCase(`Confirm (${actionName})`)}</TextButton>
                    </View>
                    <View>
                      <TextButton onPress={pressedNevermind}>{toTitleCase('Nevermind')}</TextButton>
                    </View>
                  </View>
                </>
              }
            </View>
            </ScrollViewDismissKeyboard>
            </KeyboardAvoidingView>
    </Container>

    )
}
