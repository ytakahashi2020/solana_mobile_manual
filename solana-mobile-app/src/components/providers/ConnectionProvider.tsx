import React, {ReactNode, createContext, useContext} from 'react';
import {Connection, clusterApiUrl} from '@solana/web3.js';

export interface ConnectionProviderContext {
  connection: Connection;
}

const DEFAULT_CONTEXT: ConnectionProviderContext = {
  connection: new Connection(clusterApiUrl('devnet'), 'confirmed'),
};

const ConnectionContext = createContext<ConnectionProviderContext>(DEFAULT_CONTEXT);

export interface ConnectionProviderProps {
  children: ReactNode;
  endpoint?: string;
}

export function ConnectionProvider({
  children,
  endpoint = clusterApiUrl('devnet'),
}: ConnectionProviderProps) {
  const connection = new Connection(endpoint, 'confirmed');

  return (
    <ConnectionContext.Provider value={{connection}}>
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnection = (): ConnectionProviderContext => useContext(ConnectionContext);