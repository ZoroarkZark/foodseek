import React, { useContext } from 'react'
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// custom build

import { Avatar } from '../../../components/common';
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'


export const CustomDrawer = props => {
  const { user, avatar } = useContext( AuthenticationContext )
  
  // returns a small box with the formatted icon, label and number figure
  const MiniBanner = ({Icon, Figure, Label}) => {
    return (
      <View style={{ flexDirection: row, flex: 3 }} >
        <View style={{ flex: 1 }}>
          <Icon />
        </View>
        <View style={{ flex: 2 }}>
          <View style={{ flex: 2, flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <Label />
            </View>
            <View style={{ flex: 1 }}>
              <Figure />
            </View>
          </View>
        </View>
      </View>
    )
  }

  const Meals = ( {icon, style, figure} ) => {
    return (
      <MiniBanner 
        Icon={<MaterialCommunityIcons name="baguette" size={icon.size} color={icon.color} />}
        Figure={<Text style={style.figure}>{figure}</Text>}
        Label={<Text style={style.label}>Meals</Text>} />
    )
  }

  const  = ( {icon, style, figure} ) => {
    return (
      <MiniBanner 
        Icon={<MaterialCommunityIcons name="baguette" size={icon.size} color={icon.color} />}
        Figure={<Text style={style.figure}>{figure}</Text>}
        Label={<Text style={style.label}>Meals</Text>} />
    )
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column'}}>
      {/* put in custom header stuff top of page */}
      <Avatar avatar={avatar} username={user.un} />
      <View style={{ flex: 2, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          
        </View>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#8200d6'}}>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* {put still buttons here} */}
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="share-social-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
