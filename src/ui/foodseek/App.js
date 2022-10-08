import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from "react-native-rapi-ui";
import { Layout, TopNav } from 'react-native-rapi-ui'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, themeColor } from 'react-native-rapi-ui';

const App = () => {
  return (
    <ThemeProvider theme="light">
      <Layout>
        <TopNav middleContent="Home" />
        <TopNav
          leftContent={
            <Ionicons name="chevron-back" size={20} color={themeColor.black} />
          }
          leftAction={() => console.log('back icon pressed')}
          middleContent="Profile"
        />
        <TopNav
          rightContent={
            <Ionicons name="ellipsis-vertical" size={20} color={themeColor.black} />
          }
          rightAction={() => console.log('setting icon pressed')}
          middleContent="Settings"
        />
      </Layout>
      <View style={styles.container}>
        <Text>Hello FoodSeek!</Text>
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
