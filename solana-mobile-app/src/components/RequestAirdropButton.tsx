import React, {useCallback, useState} from 'react';
import {Alert, Button} from 'react-native';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import {useConnection} from './providers/ConnectionProvider';
import {useAuthorization} from './providers/AuthorizationProvider';

export default function RequestAirdropButton() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [airdropInProgress, setAirdropInProgress] = useState(false);

  const requestAirdrop = useCallback(async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    try {
      setAirdropInProgress(true);
      const signature = await connection.requestAirdrop(
        selectedAccount,
        LAMPORTS_PER_SOL
      );
      
      await connection.confirmTransaction(signature);
      Alert.alert('Success', '1 SOL airdropped successfully!');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to request airdrop'
      );
    } finally {
      setAirdropInProgress(false);
    }
  }, [connection, selectedAccount]);

  if (!selectedAccount) {
    return null;
  }

  return (
    <Button
      title={airdropInProgress ? 'Requesting...' : 'Request Airdrop (1 SOL)'}
      onPress={requestAirdrop}
      disabled={airdropInProgress}
    />
  );
}