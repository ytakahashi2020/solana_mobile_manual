import React, {useCallback, useState} from 'react';
import {Alert, Button} from 'react-native';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useAuthorization} from './providers/AuthorizationProvider';

export default function SignMessageButton() {
  const {selectedAccount} = useAuthorization();
  const [signingInProgress, setSigningInProgress] = useState(false);

  const signMessage = useCallback(async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    try {
      setSigningInProgress(true);
      const message = `Hello from Solana Mobile! Timestamp: ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);

      await transact(async (wallet) => {
        const signedMessages = await wallet.signMessages({
          addresses: [selectedAccount.toBase58()],
          payloads: [messageBytes],
        });
        
        Alert.alert(
          'Message Signed!',
          `Message: ${message}\nSignature: ${signedMessages[0].slice(0, 32)}...`
        );
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to sign message'
      );
    } finally {
      setSigningInProgress(false);
    }
  }, [selectedAccount]);

  if (!selectedAccount) {
    return null;
  }

  return (
    <Button
      title={signingInProgress ? 'Signing...' : 'Sign Message'}
      onPress={signMessage}
      disabled={signingInProgress}
    />
  );
}