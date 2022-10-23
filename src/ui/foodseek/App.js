// App.js: Application entry file.
import React from 'react';
import { AppNavigation } from './src/components/navigation/AppNavigation';
import { PaperProvider } from './src/components/provider/react-native-paper';
// context provider wrappers wrapping child (application)
export default function App() {
  return (
    <>
      <PaperProvider>
        <AppNavigation />
      </PaperProvider>
    </>
    
    
  );
}
