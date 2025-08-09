"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { connectWallet, disconnectWallet, getConnectedAccount, isWalletConnected } from '@/lib/hashconnect';
import { LogOut, Wallet } from 'lucide-react'; 

interface WalletConnectButtonProps {
  onConnect?: (accountId: string) => void;
  onDisconnect?: () => void;
}

export default function WalletConnectButton({ onConnect: onConnectProp, onDisconnect: onDisconnectProp }: WalletConnectButtonProps) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  useEffect(() => {
    const updateAccount = () => {
      const account = getConnectedAccount();
      setConnectedAccount(account);
    };

    updateAccount();

    const interval = setInterval(updateAccount, 1000); 
    return () => clearInterval(interval);
  }, []);

  const onConnect = async () => {
    setIsConnecting(true);
    try {
      const info = await connectWallet();
      const accountId = info?.accountId ?? getConnectedAccount();
      if (accountId) {
        setConnectedAccount(accountId);
        if (onConnectProp) {
          onConnectProp(accountId);
        } else {
          router.push('/start');
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setConnectedAccount(null);
      if (onDisconnectProp) {
        onDisconnectProp();
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      router.push('/');
    }
  };

  if (connectedAccount) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-white backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          <span className="font-medium">Connected:</span>
          <span className="font-mono text-purple-200 bg-black/20 px-3 py-1 rounded-lg text-sm">
            {connectedAccount}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/20 hover:border-red-400/40 rounded-xl text-red-300 hover:text-red-200 transition-all duration-300"
          title="Disconnect Wallet"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={onConnect}
      disabled={isConnecting}
      className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold
                 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
                 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center gap-3"
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Connecting...
        </span>
      ) : (
        "Connect Wallet"
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-50 -z-10 group-hover:opacity-75 transition-opacity"></div>
    </button>
  );
}
