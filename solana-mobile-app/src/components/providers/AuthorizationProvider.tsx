import React, {ReactNode, createContext, useContext, useState, useCallback} from 'react';
import {PublicKey} from '@solana/web3.js';
import {
  AuthorizeAPI,
  AuthToken,
  Base64EncodedAddress,
} from '@solana-mobile/mobile-wallet-adapter-protocol';

export interface AuthorizationProviderContext {
  accounts: PublicKey[] | null;
  authorizeSession: (wallet: AuthorizeAPI) => Promise<AuthToken>;
  deauthorizeSession: (wallet: AuthorizeAPI) => void;
  onChangeAccount: (nextSelectedAccount: PublicKey) => void;
  selectedAccount: PublicKey | null;
}

const AuthorizationContext = createContext<AuthorizationProviderContext>({
  accounts: null,
  authorizeSession: async (_wallet: AuthorizeAPI) => {
    throw new Error('AuthorizationProvider not initialized');
  },
  deauthorizeSession: (_wallet: AuthorizeAPI) => {
    throw new Error('AuthorizationProvider not initialized');
  },
  onChangeAccount: (_nextSelectedAccount: PublicKey) => {
    throw new Error('AuthorizationProvider not initialized');
  },
  selectedAccount: null,
});

export interface AuthorizationProviderProps {
  children: ReactNode;
}

function getAccountFromBase64Address(address: Base64EncodedAddress): PublicKey {
  return new PublicKey(address);
}

export function AuthorizationProvider({children}: AuthorizationProviderProps) {
  const [accounts, setAccounts] = useState<PublicKey[] | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<PublicKey | null>(null);

  const authorizeSession = useCallback(async (wallet: AuthorizeAPI): Promise<AuthToken> => {
    const authorizationResult = await wallet.authorize({
      cluster: 'devnet',
      identity: {
        name: 'Solana Mobile App',
        uri: 'https://solanamobile.com',
        icon: 'favicon.ico',
      },
    });

    const receivedAccounts = authorizationResult.accounts.map(getAccountFromBase64Address);
    setAccounts(receivedAccounts);
    setSelectedAccount(receivedAccounts[0]);

    return authorizationResult.auth_token;
  }, []);

  const deauthorizeSession = useCallback(async (wallet: AuthorizeAPI) => {
    await wallet.deauthorize({auth_token: ''});
    setAccounts(null);
    setSelectedAccount(null);
  }, []);

  const onChangeAccount = useCallback((nextSelectedAccount: PublicKey) => {
    setSelectedAccount(nextSelectedAccount);
  }, []);

  return (
    <AuthorizationContext.Provider
      value={{
        accounts,
        authorizeSession,
        deauthorizeSession,
        onChangeAccount,
        selectedAccount,
      }}>
      {children}
    </AuthorizationContext.Provider>
  );
}

export const useAuthorization = (): AuthorizationProviderContext => useContext(AuthorizationContext);