import React, {useCallback, useState} from 'react';
import {Alert, Button} from 'react-native';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useAuthorization} from './providers/AuthorizationProvider';

export default function SignInButton() {
  const {selectedAccount} = useAuthorization();
  const [signInInProgress, setSignInInProgress] = useState(false);

  const signIn = useCallback(async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    try {
      setSignInInProgress(true);
      const domain = 'solanamobile.com';
      const statement = 'Please sign this message to authenticate with our app.';
      const uri = 'https://solanamobile.com';
      const version = '1';
      const nonce = Math.random().toString(36).substring(7);
      const issuedAt = new Date().toISOString();

      await transact(async (wallet) => {
        const result = await wallet.signIn({
          domain,
          statement,
          uri,
          version,
          nonce,
          issuedAt,
          address: selectedAccount.toBase58(),
        });
        
        Alert.alert(
          'Sign In Successful!',
          `Signed message for domain: ${result.signedMessage?.domain || domain}`
        );
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to sign in'
      );
    } finally {
      setSignInInProgress(false);
    }
  }, [selectedAccount]);

  if (!selectedAccount) {
    return null;
  }

  return (
    <Button
      title={signInInProgress ? 'Signing In...' : 'Sign In'}
      onPress={signIn}
      disabled={signInInProgress}
    />
  );
}