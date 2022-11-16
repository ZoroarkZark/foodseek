import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Animated, Image, ImageBackground, Easing, Button} from 'react-native'

const Odin = () => {
  let rotateValueHolder = new Animated.Value(0)
  let rev = false

  const startRotateFunction = () => {
    Animated.timing(rotateValueHolder, {
      toValue: rev ? 0 : 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(() => startRotateFunction())
    rev = !rev
  }

  const LeftRotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '90deg']
  })

  const RightRotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '45deg']
  })

  useEffect(() => {
    startRotateFunction()
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    left: {
      position: 'absolute',
      left: 11,
      bottom: 50,
      height: 70,
      width: 125,
    },
    right: {
      position: 'absolute',
      right: 24,
      top: 28,
      height: 90,
      width: 113,
    }
  })

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/OdinBody.png')} style={{height: 160, width: 120}}>
        <Animated.Image source={require('../../../assets/OdinLeftArm.png')} style={[styles.left, {transform: [{rotate: LeftRotateData}]}]}/>
        <Animated.Image source={require('../../../assets/OdinRightArm.png')} style={[styles.right, {transform: [{rotate: RightRotateData}]}]}/>
      </ImageBackground>
    </View>
  )
}

export default Odin