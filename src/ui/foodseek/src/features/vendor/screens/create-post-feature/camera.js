import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Camera as camera, CameraType } from 'expo-camera'
import { Image } from 'react-native'

export const Camera = ({ navigation }) => {
    const [direction, setDirection] = useState(CameraType.back)
    const [permission, requestPermission] = camera.useCameraPermissions()
    const [pictureTaken, setTaken] = useState(false)

    if (!permission) {
        return <View />
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    Give us permission to see you bitch
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        )
    }

    const snap = async () => {
        if (this.camera) {
            this.photo = await this.camera.takePictureAsync()
            console.log(this.photo.uri)
            setTaken(true)
        }
    }

    if (!pictureTaken) {
        return (
            <View style={styles.container}>
                <camera
                    style={styles.camera}
                    type={direction}
                    ref={(ref) => {
                        this.camera = ref
                    }}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={snap}>
                            <Text style={styles.text}>Take Picture!!!</Text>
                        </TouchableOpacity>
                    </View>
                </camera>
            </View>
        )
    } else {
        return (
            <Image
                source={{ uri: this.photo.uri }}
                style={{ width: 400, height: 400 }}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
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
    },
})
