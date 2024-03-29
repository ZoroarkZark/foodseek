import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AuthenticationContext } from '../../../../context/AuthenticationContext'
import { Avatar } from '../../../../components/common'

export const StoreSettings = ({ navigation }) => {
    const { user } = useContext(AuthenticationContext)

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <View flex={1} flexDirection="column" paddingTop="20%">
                        <Avatar user={user} />
                        <Text style={{ paddingTop: 20, fontWeight: '500' }}>
                            user: {user.un}
                        </Text>
                    </View>
                    <View flex={1} flexDirection="column">
                        <Text>Email: {user.email}</Text>
                        <Text>type: {user.type}</Text>
                    </View>
                </>
            ) : (
                <Text>
                    Please login or create account to access settings...
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        padding: 10,
        fontSize: 25,
        backgroundColor: 'blue',
    },
})
