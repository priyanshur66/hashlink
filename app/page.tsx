"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Link, Save } from "lucide-react";
import { connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";

export default function Home() {
  const router = useRouter();
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const currentAccount = getConnectedAccount();
    setConnectedAccount(currentAccount);
    
    // If user is already connected, redirect to start page
    if (currentAccount) {
      router.push('/start');
      return;
    }
    
    // Check for wallet connection changes periodically
    const interval = setInterval(() => {
      const newAccount = getConnectedAccount();
      if (newAccount && newAccount !== connectedAccount) {
        setConnectedAccount(newAccount);
        router.push('/start');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [connectedAccount, router]);

  const onConnect = async () => {
    setIsConnecting(true);
    try {
      const info = await connectWallet();
      const accountId = info?.accountId ?? getConnectedAccount();
      setConnectedAccount(accountId);
      if (accountId) {
        router.push('/start');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 mx-8 mt-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl">
        <div className="px-8 py-4 flex items-center justify-between">
          {/* Left side - Project name */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Link className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur opacity-50"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Hashlinks
            </h1>
          </div>

          {/* Right side - Wallet connect button */}
          <div className="flex items-center">
            {!isWalletConnected() ? (
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
            ) : (
              <div className="flex items-center gap-3 text-white backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="font-medium">Connected:</span>
                <span className="font-mono text-purple-200 bg-black/20 px-3 py-1 rounded-lg text-sm">
                  {connectedAccount}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-12 p-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl">
          <h2 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Welcome to hashlinks
          </h2>
          <p className="text-purple-200 text-2xl mb-12 opacity-80 leading-relaxed max-w-3xl mx-auto">
            Experience the future of payments with secure, fast, and easy transactions on the Hedera network.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <Save className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Generate HashLinks
            </h3>
            <p className="text-purple-200 leading-relaxed text-center">
              Securely store recipient accounts, amounts, and memos. Create reusable payment templates for faster transactions.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Explore HashLinks
            </h3>
            <p className="text-purple-200 leading-relaxed text-center">
              Load saved payment details and execute transactions instantly. Your connected wallet is automatically set as the sender.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all duration-500 transform hover:scale-105 md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <Link className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Secure & Fast
            </h3>
            <p className="text-purple-200 leading-relaxed text-center">
              Built on the Hedera network with enterprise-grade security. Lightning-fast transactions with minimal fees.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-purple-200 mb-6 leading-relaxed">
            Connect your wallet using the button in the top right corner to access all payment features and start managing your transactions.
          </p>
          <div className="flex items-center justify-center gap-6 text-purple-300 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Encrypted Storage
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Instant Transactions
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              Zero Hassle
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="backdrop-blur-sm bg-black/20 border border-white/10 rounded-xl px-6 py-4 max-w-4xl">
          <div className="text-center">
            <p className="text-purple-300 text-sm leading-relaxed">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse block"></span>
                Powered by Hedera
              </span>
              <span className="mx-4">•</span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse block"></span>
                Create Hashlinks with AI
              </span>
              <span className="mx-4"></span>
              <span className="inline-flex items-center gap-2">
                
                
              </span>
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}