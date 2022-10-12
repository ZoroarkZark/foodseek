import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });

  export const LoadingScreen = ({ navigation }) => {
    return (
      <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" />
      </View>
    );
  };