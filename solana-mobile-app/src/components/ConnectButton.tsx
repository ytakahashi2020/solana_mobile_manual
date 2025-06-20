import React, {useCallback, useState} from 'react';
import {Alert, Button} from 'react-native';
import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {useAuthorization} from './providers/AuthorizationProvider';

export default function ConnectButton() {
  const {authorizeSession} = useAuthorization();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);

  const handleConnectPress = useCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await transact(async (wallet) => {
        await authorizeSession(wallet);
      });
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.message || 'Failed to connect to wallet',
      );
    } finally {
      setAuthorizationInProgress(false);
    }
  }, [authorizeSession, authorizationInProgress]);

  return (
    <Button
      title={authorizationInProgress ? 'Connecting...' : 'Connect Wallet'}
      onPress={handleConnectPress}
      disabled={authorizationInProgress}
    />
  );
}