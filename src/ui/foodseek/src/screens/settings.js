import React from 'react';
import { Text, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';

const RootDrawerNavigatior = createDrawerNavigator({
    Sett: {
        screen: Settings
    }
})

export const SettingsScreen = ({ navigation }) => {
    return (
        <Text>Edit Name {">"}</Text>
        {(['right'] as const).map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <SwipeableDrawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </React.Fragment>
          ))}
    );
};