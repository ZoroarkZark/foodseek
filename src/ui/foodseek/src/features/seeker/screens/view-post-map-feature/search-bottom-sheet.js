import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
  memo,
  forwardRef,
} from 'react'
import { Text, TextInputProps, View } from 'react-native'
import ViewMap from '../../../../components/common/map.js'
import { map as style } from '../../../../style/styleSheet.js'
import { Ionicons } from '@expo/vector-icons'
import TextButton from '../../../../components/common/textbutton.js'
import { LocationContext } from '../../../../context/LocationContext.js'
import { Marker } from 'react-native-maps'
import { AuthenticationContext } from '../../../../context/AuthenticationContext.js'
import BottomSheet, {
  BottomSheetSectionList,
  BottomSheetTextInput,
  useBottomSheet,
} from '@gorhom/bottom-sheet'
import { AutocompleteSearchBar } from '../../../../components/api/AutocompleteSearchBar.js'
import { FoodCardContext } from '../../../../context/FoodCardContext.js'
import { useSharedValue } from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'


// stretchy container will contain the search bar

const BottomSheetSearchInputComponent = ( { setKeyword, setLocation, search, onFocus, onBlur, ...rest }) => {
  const shouldHandleKeyboardEvents = useSharedValue(true)
  //#region callbacks
  const handleOnFocus = useCallback(
      (args) => {
          shouldHandleKeyboardEvents.value = true
          if (onFocus) {
              onFocus(args)
          }
      },
      [onFocus, shouldHandleKeyboardEvents]
  )
  const handleOnBlur = useCallback(
      (args) => {
          shouldHandleKeyboardEvents.value = false
          if (onBlur) {
              onBlur(args)
          }
      },
      [onBlur, shouldHandleKeyboardEvents]
  )
  //#endregion

  const { expand } = useBottomSheet()
  useEffect(() => expand(), [])

  return (
      <View
          style={{ paddingTop: 110, padding: 10, paddingBottom: 10 }}
      >
          <AutocompleteSearchBar
              {...{
                  setKeyword,
                  setLocation,
                  search,
                  onFocus: handleOnFocus,
                  onBlur: handleOnBlur,
                  ...{...rest}
              }}
      />
      </View>
  )
}

const BottomSheetSearchInput = memo( BottomSheetSearchInputComponent )
BottomSheetSearchInput.displayName = 'BottomSheetSearchInput'
export { BottomSheetSearchInput }


export const BottomSheetContainer = ({ setCards, onLocate }) => {
  const { location: loc, keyword: key } = useContext(LocationContext) // load the initial variables for the device
  const { onRefresh } = useContext(FoodCardContext)
  const [keyword, setKeyword] = useState(key)
  const [location, setLocation] = useState(loc)

  const search = useCallback(() => {
      onRefresh(location, setCards)
  }, [])

  const sections = useMemo(
      () =>
          Array(10)
              .fill(0)
              .map((_, index) => ({
                  title: `Section ${index}`,
                  data: Array(10)
                      .fill(0)
                      .map((_, index) => `Item ${index}`),
              })),
      []
  )
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []) // snap points for the bottom sheet display coverage

  const handleSheetChange = useCallback((index) => {
      console.log('handleSheetChange', index)
  }, [])

  const handleSnapPress = useCallback((index) => {
      sheetRef.current?.snapToIndex(index)
  }, [])

  const handleClosePress = useCallback(() => {
      sheetRef.current?.close()
  }, [])

  // used to render section header
  const renderSectionHeader = useCallback(
      ( { item } ) => (
          <BottomSheetSearchInput
              {...
              {
                  setKeyword,
                  setLocation,
                  search,
              }
              } 
          />
      ),
      [] ) // end renderSectionHeader

  // used to render section items
  const renderItem = useCallback(({ item }) => <></>, []) // end renderItem

  useEffect( () => {
      if ( !location ) return
      onLocate( location )
  }, [ location, setLocation ] )
  

  return (
      <View >
          <BottomSheet
              focusHook={useFocusEffect}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChange}
              keyboardBehavior='fillParent'
              animateOnMount={true}
          >
              <BottomSheetSectionList
                  sections={sections}
                  keyExtractor={(i) => i}
                  renderSectionHeader={renderSectionHeader}
                  renderItem={renderItem}
                  contentContainerStyle={{}}
              />
          </BottomSheet>
      </View>
  )
}
