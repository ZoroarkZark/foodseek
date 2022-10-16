import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabsNavigator } from './components/navigators/BottomTabNavigator';
export const Main = () => {
  return (
    <NavigationContainer>
      < BottomTabsNavigator />
    </NavigationContainer>
  );
};
