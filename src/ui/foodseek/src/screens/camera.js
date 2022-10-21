import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Camera, CameraType } from 'expo-camera';

export const CameraScreen = ({ navigation }) => {
  const [direction, setDirection] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style = {styles.container}>
        <Text style = {{textAlign: 'center'}}>Give us permission to see you bitch</Text>
        <Button onPress={requestPermission} title="grant permission"/>
      </View>
    );
  }

  const takePicture = async () => {
    const options = {quality: 1, base64: true};
    const photo = await Camera.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={direction}>
        <View styles={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture!!!</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 2,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  }
});
