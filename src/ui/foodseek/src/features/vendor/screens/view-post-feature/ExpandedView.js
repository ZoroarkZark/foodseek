import React, { useEffect, useState } from "react";
import { Text, View, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import Container from '../../../../components/styling/Container'
import { ScrollViewDismissKeyboard, TextButton } from '../../../../components/common'
import { EditDetail, tagsToStr, toTags, toTitleCase } from './utils'

export const ExpandedView = ( props ) => {
  const { loading, setLoading, onUpdate, setComplete, timestamp, vendor, phone, address, time, distance, card, backgroundColor, item } = props
  const {id, tags, img_url} = card
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
                          <Image style={{ width: size.width, height: size.width }} source={{uri: img_url}} />
                          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 40, bottom: '12%', paddingHorizontal: 20, position: "absolute", textShadowColor: 'black', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }} >{name}</Text>
                          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 25, bottom: '5%', paddingHorizontal: 20, position: "absolute", textShadowColor: 'black', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10}} >{vendor}</Text>
                  </TouchableOpacity>
                  </View>
                  
          <View style={{ padding: 20 }}>
                          <EditDetail callback={() => setEditingName(!editingName)} value={name} setValue={setName} icon={props => <Ionicons name="fast-food-outline" {...props} />} label={` ${ name }`} description={toTitleCase( 'Edit item name' )} rightContent={<></>} />
              <EditDetail callback={() => setEditingTags(!editingTags)} value={tagged} setValue={setTagged} icon={props => <FontAwesome5 name="hashtag" {...props} />} label={` tags ${ tagged.length > 1 ? tagged : '(none)' }`} description={toTitleCase( tagged.length > 1 ? 'Edit hashtags' : 'Add hashtags' )} rightContent={<></>} />
              <EditDetail callback={() => setEditingTime(!editingTime)} value={end} setValue={setEnd} Alternative={true}  icon={props => <FontAwesome5 name="clock" {...props} />} label={` ${ time } remaining`} description={toTitleCase( 'Edit timer' )} rightContent={<></>} />
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

