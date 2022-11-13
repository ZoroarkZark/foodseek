import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context'
// custom build

import { Avatar } from '../../../components/common';
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import { ThemeContext } from '../../../context/ThemeContext'



export const CustomDrawer = props => {
  const { user, avatar, onLogout} = useContext( AuthenticationContext )
  const { darkTheme, toggleTheme } = useContext( ThemeContext )

  const { navigation, color, backgroundColor } = props
  


  return (<>
    <SafeAreaView>
      <View style={{flexDirection: 'column', alignItems: 'center'}}>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Avatar avatar={avatar} />
        </View>
        
        <View style={{justifyContent: 'flex-start', alignSelf: 'flex-start', start: '40%'}}>
          <TouchableOpacity onPress={() => navigation.closeDrawer()}>
            <Feather name="x" size={22} color={color} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ paddingTop: 20, fontWeight: '500', color: color }}>
        u: {user.un}
        </Text>
        
      </View>
      </SafeAreaView>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: {backgroundColor}}}>
            <DrawerItemList {...props} />
      </DrawerContentScrollView>
          

      <SafeAreaView style={{flexDirection: 'row'}}>
      <DrawerItem
      flex={5}
      label="Logout"
      icon={() => (
        <FontAwesome
          name="power-off"
          size={20}
          color={color}
        />
      )}
      onPress={() => onLogout()}
      {...props}
    />

      <DrawerItem
        flex={1}
        label=''
        labelStyle={{ display: 'none', padding: 0 }}
          icon={() => (
              <Ionicons
              name={darkTheme ? 'ios-moon' : 'ios-moon-outline'}
              size={20}
              color={color}
              />
          )}
      onPress={() => toggleTheme()}
      {...props}
      />
      
        
      </SafeAreaView>

    
      </>
  );
};
