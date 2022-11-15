import React, { useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Feather, Ionicons } from '@expo/vector-icons'

import { SeekerTabNav } from './tab-navigation'
import { CustomDrawer } from './custom-drawer'

import * as stack from './stack-navigation'
import { BackButton } from '../../../components/common/backbutton'
import { Avatar } from '../../../components/common'
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Drawer = createDrawerNavigator()

export const SeekerNavigator = () => {
    const { avatar } = useContext(AuthenticationContext)

    return (
        <Drawer.Navigator
            initialRouteName="App"
            screenOptions={({ navigation }) => ({
                headerShown: true,
                headerTitle: '',
                headerTransparent: true,
                drawerType: 'front',
                drawerPosition: 'right',
                headerLeft: () => (<></>),
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                        <Avatar
                            avatar={avatar}
                            style={{
                                height: 60,
                                width: 60,
                                borderRadius: 30,
                                right: 6,
                            }}
                        />
                    </TouchableOpacity>
                ),
            })}
            drawerContent={(props) => <CustomDrawer color="grey" {...props} />}
        >
            <Drawer.Screen
                name="App"
                component={SeekerTabNav}
                options={({ navigation }) => ({
                    drawerItemStyle: { display: 'none' },
                    drawerIcon: ({ color }) => (
                        <Feather name="x" size={22} color={color} />
                    ),
                })}
            />
            <Drawer.Screen
                name="FavoritesDrawer"
                component={stack.FavoritesNavigator}
                options={({ navigation }) => ({
                    drawerLabel: 'Favorites',
                    drawerIcon: ({ color }) => (
                        <Feather name="star" size={22} color={color} />
                    ),
                })}
            />
            <Drawer.Screen
                name="SettingsDrawer"
                component={stack.SettingsNavigator}
                options={({ navigation }) => ({
                    headerLeft: () => (
                    <BackButton
                        style={{
                            left: 6,
                            color: 'grey',
                            fontSize: 30,
                            size: 30,
                        }}
                        onPress={() => navigation.goBack()}
                    />
                    ),
                    drawerLabel: 'Settings',
                    drawerIcon: ({ color }) => (
                        <Ionicons
                            name="settings-outline"
                            size={22}
                            color={color}
                        />
                    ),
                } )}
            />
        </Drawer.Navigator>
    )
}
