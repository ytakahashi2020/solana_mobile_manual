import 'react-native-get-random-values';
import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {ConnectionProvider} from './src/components/providers/ConnectionProvider';
import {AuthorizationProvider} from './src/components/providers/AuthorizationProvider';
import MainScreen from './src/screens/MainScreen';

export default function App() {
  return (
    <ConnectionProvider>
      <AuthorizationProvider>
        <MainScreen />
        <StatusBar style="auto" />
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}