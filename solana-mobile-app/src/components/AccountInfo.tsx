import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import {useConnection} from './providers/ConnectionProvider';
import {useAuthorization} from './providers/AuthorizationProvider';

export default function AccountInfo() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [balance, setBalance] = useState<number | null>(null);

  const fetchAndUpdateBalance = useCallback(async () => {
    if (!selectedAccount) {
      return;
    }
    try {
      const lamports = await connection.getBalance(selectedAccount);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(null);
    }
  }, [connection, selectedAccount]);

  useEffect(() => {
    if (selectedAccount) {
      fetchAndUpdateBalance();
    } else {
      setBalance(null);
    }
  }, [selectedAccount, fetchAndUpdateBalance]);

  if (!selectedAccount) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Info</Text>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>{selectedAccount.toBase58()}</Text>
      <Text style={styles.label}>Balance:</Text>
      <Text style={styles.value}>
        {balance !== null ? `${balance} SOL` : 'Loading...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});