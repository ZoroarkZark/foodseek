import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabsNavigator } from './BottomTabNavigator';


// Returns a navigation container for the top-level navigator in the application.
export const AppNavigation = () => {
  return (
    // container wraps top-level navigator (BottomTabsNavigator), linking it to the app environment
    <NavigationContainer>
      < BottomTabsNavigator />       
    </NavigationContainer>
  );
};
