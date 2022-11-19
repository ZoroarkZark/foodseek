import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef} from 'react'
import { Camera, CameraType } from 'expo-camera'
import { Image } from 'react-native'

export const Cam = ({ navigation }) => {
    const cameraRef = useRef(null)
    const [permission, setPermission] = useState()
    const [image, setImage] = useState(null)
    const [pictureTaken, setTaken] = useState(false)

    useEffect(() => {
        (async () => {
            const cStatus = await Camera.requestCameraPermissionsAsync()
            if (cStatus.status === 'granted') {
                setPermission(true)
            }
            else {
                setPermission(false)
            }
        })();
    }, []);

    const snap = async () => {
        if (cameraRef) {
            const data = await cameraRef.current.takePictureAsync()
            console.log(data)
            setImage(data.uri)
            setTaken(true)
        }
    }

    useEffect( () => {
        if (!image) return
        navigation.navigate('PostFood', { uri : image })
    }, [pictureTaken, setTaken])

    
    

    if (permission === undefined){
        return (
            <Text>Requesting Permissions...</Text>
        )
    } else if (!permission){
        return(
            <Text>Permissions Denied. Please change in device settings.</Text>
        )
    } else if (!pictureTaken) {
        return (
            <View style={styles.container}>
                <Camera
                    style={styles.camera}
                    type={CameraType.back}
                    ref={cameraRef}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={snap}>
                            <Text style={styles.text}>Snap!</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        )
    } else {
        // navigation.navigate('PostFood', { uri : image })
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
