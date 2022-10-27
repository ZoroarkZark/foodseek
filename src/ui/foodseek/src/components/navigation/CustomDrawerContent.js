import React, { useContext } from "react";
import { View, Text, Image } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar } from "../common";
import { TouchableOpacity } from "react-native-gesture-handler";
const CustomDrawerContent = ( props, {navigation}) => {
    const {user, onLogout} = useContext(AuthenticationContext);
    const logoutHandler = () => {
        onLogout();
        navigation.navigate("LoginTab");
    }
    return (
        <DrawerContentScrollView {...props}>
            {user
            ?   <>
                    <DrawerItem label="" icon={() => <Avatar user={user} />}  labelStyle={{flex: 0, textAlign: 'center', }} style={{alignSelf:'center', flexDirection: "column", paddingTop: '10%', paddingBottom: '2%'}}/>
                    <DrawerItem label={user.un} labelStyle={{paddingTop: 20, fontWeight: '500' }} style={{alignSelf:'center', flexDirection: "column"}}/>
                    <DrawerItemList {...props} />
                    <DrawerItem label="Logout" icon={() => <FontAwesome name="power-off" size={20} color="grey" />} onPress={() => onLogout()} labelStyle={{fontSize:20, alignSelf: 'left'}}/>
                </> 
            :   <>
                    <DrawerItem label="" icon={() => <><Image style={{width: 120, height: 120}}source={require('../../../assets/splash.png')} /></>} style={{alignSelf:'center', flexDirection: "column", paddingLeft: '20%'}}/>
                    <DrawerItem label="" icon={() => <><Text>Well that's awkward... please create account or login to access settings...</Text></>} style={{alignSelf:'center', flexDirection: "column", paddingLeft: '10%',paddingRight: '10%'}}/>

                </>}
            


            
        </DrawerContentScrollView>
    );
}

export default CustomDrawerContent;