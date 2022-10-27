// App.js: Application entry file.
import React from 'react';

import { AppNavigation } from './src/components/navigation/AppNavigation';



// context provider wrappers wrapping child (application)
export default function App() {
  return (
        <AppNavigation />
  );
}
