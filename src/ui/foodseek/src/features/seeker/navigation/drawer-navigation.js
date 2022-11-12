import React, { useContext, useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Feather } from '@expo/vector-icons'

import { SeekerTabNav } from './tab-navigation';
import { CustomDrawer } from './custom-drawer'

import * as screen from '../screens';
import { ThemeContext } from '../../../context/ThemeContext'
import { BackButton } from '../../../components/common/backbutton'
import { useNavigation } from '@react-navigation/native'

const Drawer = createDrawerNavigator()

export const SeekerNavigator = ({navigation}) => {
  const { darkTheme } = useContext( ThemeContext )
  const [ backgroundColor, setBackgroundColor ] = useState( '#fff' )
  const [ color, setColor ] = useState( 'grey' )

  useEffect( () => {
    if ( darkTheme === true ) {
      setBackgroundColor( '#000' )
      setColor( '#fff' )
    }
    setBackgroundColor( '#fff' )
    setColor( 'grey' )
  }, [ darkTheme ] )
  
  return (
    <Drawer.Navigator
      screenOptions={( {navigation}) => ( {
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
        drawerType: 'front',
        drawerPosition: 'right',
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
        headerLeft: ({navigation}) => (
          <BackButton style={{paddingLeft: 5, fontSize: 22 }} onPress={navigation.goBack} />
        ),
      } )}
      drawerContent={props => <CustomDrawer backgroundColor={backgroundColor} color={color} {...props} />}
    >
      <Drawer.Screen
        name="App"
        component={SeekerTabNav}
        options={({ navigation }) => ({
          drawerItemStyle: {display: 'none'},
          drawerIcon: ({color}) => (
            <Feather name="x" size={22} color={color} />
          ),
            
        } )}
      />
      <Drawer.Screen
        name="Favorites"
        component={screen.Favorites}
        options={({ navigation }) => ({
          drawerLabel: 'Favorites',
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          drawerIcon: ({color}) => (
            <Feather name="star" size={22} color={color} />
          ),
          
        } )}
            
        
      />
      
      {/* <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={MomentsScreen}
        options={{
          drawerIcon: ({color}) => (
            <FontAwesome name="heart-o" size={22} color="black" />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};
