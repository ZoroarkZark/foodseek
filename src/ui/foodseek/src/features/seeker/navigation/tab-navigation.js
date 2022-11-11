import React from 'react'
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons' // used for tab icons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { tabnav as style } from '../../../style/styleSheet'
import { Stack as stack } from '.'

// add bottom tab navigation to the application
const SeekerTab = createBottomTabNavigator()

// function returns a bottom tab navigator component for seeker type user
export const SeekerTabNav = () => {
    return (
        <SeekerTab.Navigator
            screenOptions={style.screenOptions}
        >
            <SeekerTab.Screen
                name="PostList"
                component={stack.PostsNavigator}
                options={{
                    tabBarLabel: 'Posts',
                    tabBarIcon: () => <Ionicons name="document-text-outline" />,
                }}
            />
            <SeekerTab.Screen
                name="Map"
                component={stack.MapNavigator}
                options={{
                    tabBarLabel: 'Map',
                    tabBarIcon: () => <Entypo name="globe" />,
                }}
            />
            <SeekerTab.Screen
                name="Orders"
                component={stack.OrderNavigator}
                options={{
                    tabBarLabel: 'Orders',
                    tabBarIcon: () => <FontAwesome5 name="hand-holding-heart" />,
                }}
            />
            <SeekerTab.Screen
                name="SearchTab"
                component={stack.SearchNavigator}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: () => <Ionicons name="search" />,
                }}
            />
            <SeekerTab.Screen
                name="SettingsTab"
                component={stack.SettingsNavigator}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: () => <Ionicons name="options-outline" />,
                }}
            />
        </SeekerTab.Navigator>
    )
}


