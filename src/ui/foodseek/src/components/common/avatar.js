import React from "react";
import { View, Image, Text } from "react-native";


const Avatar = ({children, user, style={width: 120, height: 120, borderRadius: 60, shadowColor: 'black', shadowOffset: {height: 3, width: 3}, shadowRadius: 6 , shadowOpacity: 0.3}}) => {
    return (
        <View>
            <View style={{...style, elevation: 5}}>
            <View style={{...style, overflow:'hidden'}}>
            <Image source={user.avatar} style={style}>
            {children}
            </Image>
            </View>
            </View>
            <Text style={{paddingTop: 20, fontWeight: '500' }}>u: {user.un}</Text>
        </View>
        
        
    );
}

export default Avatar;