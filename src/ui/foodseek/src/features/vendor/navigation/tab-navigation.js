import React, { useContext } from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons' // used for tab icons
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { tabnav as style } from '../../../style/styleSheet'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as stack from './stack-navigation'
// add bottom tab navigation to the application
const VendorTab = createBottomTabNavigator()

// function returns a vendor's bottom tab navigator component with nested stack navigators for each tab
export const VendorTabNav = () => {
    return (
        <VendorTab.Navigator
            screenOptions={style.screenOptions}
        >
            <VendorTab.Screen
                name="StorePosts"
                component={stack.ViewPost}
                options={{
                    tabBarLabel: 'Posts',
                    tabBarIcon: () => <Ionicons name="document-text-outline" />,
                }}
            />
            <VendorTab.Screen
                name="Create"
                component={stack.CreatePost}
                options={{
                    tabBarLabel: 'Post Food',
                    tabBarIcon: () => <Ionicons name="camera-outline" />,
                }}
            />
            <VendorTab.Screen
                name="Store"
                component={stack.StoreProfile}
                options={{
                    tabBarLabel: 'Store',
                    tabBarIcon: () => <MaterialIcons name="storefront" />,
                }}
            />
        </VendorTab.Navigator>
    )
}
