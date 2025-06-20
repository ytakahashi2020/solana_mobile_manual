import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import RequestAirdropButton from '../components/RequestAirdropButton';
import SignMessageButton from '../components/SignMessageButton';
import SignInButton from '../components/SignInButton';
import {useAuthorization} from '../components/providers/AuthorizationProvider';

export default function MainScreen() {
  const {selectedAccount} = useAuthorization();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>Solana Mobile App</Text>
          <Text style={styles.subtitle}>React Native dApp Example</Text>
        </View>

        <View style={styles.section}>
          <ConnectButton />
        </View>

        {selectedAccount && (
          <>
            <AccountInfo />
            
            <View style={styles.section}>
              <RequestAirdropButton />
            </View>

            <View style={styles.section}>
              <SignMessageButton />
            </View>

            <View style={styles.section}>
              <SignInButton />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    margin: 16,
  },
});