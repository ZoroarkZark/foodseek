import { StyleSheet, Dimensions } from 'react-native'

// Placeholder: Create a home screen possibly containing a search bar and not much else
export const styles2 = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        backgroundColor: '#000000',
        height: 40,
        marginTop: 40,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: '#000000',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        alignItems: 'center',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'black',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
})

const styles = StyleSheet.create({
    SectionStyle: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        height: 40,
        marginTop: 40,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: '#000000',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    buttonTextStyleWhite: {
        backgroundColor: 'black',
        color: 'white',
        margin: 'auto',
        paddingVertical: 0,
        fontSize: 20,
    },
    inputStyle: {
        flex: 1,
        color: 'black',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    successTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        padding: 30,
    },
})

export default styles

export const map = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    component: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
} )

export const tabnav = StyleSheet.create({
    
    screenOptions : {
        headerShown: false,
        tabBarStyle: {
            backgroundColor: '#fff',
        },
    },
    
} )


export const nav = StyleSheet.create({
    
    screenOptions : {
        headerShown: false,
    },
    
} )
  
