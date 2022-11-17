import React from 'react'
import 'react-native-gesture-handler'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomDrawerContent from '../../../components/navigation/CustomDrawerContent'
// import screens for stack navigators
import * as screen from '../screens'


const Stack = createNativeStackNavigator() // Create stack navigator component
const Drawer = createDrawerNavigator() // TODO: see below



// export const SettingsNavigator = () => {
//     return (
//         <Drawer.Navigator
//             screenOptions={{ headerShown: false }}
//             drawerContent={(props) => <CustomDrawerContent {...props} />}
//             defaultStatus="open"
//             detachInactiveScreens={false}
//         >
//             <Drawer.Screen name="Settings" component={screen.Settings} />
//             <Drawer.Screen
//                 name="User"
//                 component={screen.Settings}
//                 options={{ title: 'User Screen' }}
//             />
//             <Drawer.Screen name="Favorites" component={screen.Favorites} />
//         </Drawer.Navigator>
//     )
// }

// Returns a stack navigator for the User screen
export const MapNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MapView" 
                component={screen.Map}
                options={{ title: 'Map View' }}
            />
        </Stack.Navigator>
    )
}


// Returns a stack navigator for the post listing screens
export const PostsNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Posts" 
                component={screen.Posts}
                options={{ title: 'Posts' }}
                initialParams={{searchName: ""}}
            />
            <Stack.Screen
                name="ExpandedPost" 
                component={screen.ExpandPost}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for the post listing screens
export const OrderNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="OrderList" 
                component={screen.Orders}
                options={{ title: 'Orders' }}
            />
        </Stack.Navigator>
    )
}


// Returns a stack navigator for the post listing screens
export const SearchNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Search" 
                component={screen.Search}
                options={{ title: 'Search' }}
            />
        </Stack.Navigator>
    )
}

// Returns a stack navigator for the post listing screens
export const SettingsNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SeekerSettings" 
                component={screen.SeekerSettings}
                options={{ title: 'Orders' }}
            />
        </Stack.Navigator>
    )
}