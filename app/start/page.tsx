"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, CreditCard, Save, ArrowRight, Sparkles, LogOut } from "lucide-react";
import { getConnectedAccount, isWalletConnected, disconnectWallet } from "@/lib/hashconnect";

export default function StartPage() {
  const router = useRouter();
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentAccount = getConnectedAccount();
    setConnectedAccount(currentAccount);
    
    // If no wallet is connected, redirect to landing page
    if (!currentAccount) {
      router.push('/');
      return;
    }
    
    setIsLoading(false);
    
    // Check for wallet connection changes periodically
    const interval = setInterval(() => {
      const newAccount = getConnectedAccount();
      if (!newAccount) {
        router.push('/');
      } else if (newAccount !== connectedAccount) {
        setConnectedAccount(newAccount);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [connectedAccount, router]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      // After successful disconnect, redirect to landing page
      router.push('/');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      // Even if disconnect fails, redirect to landing page
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

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
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur opacity-50"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              hashlink
            </h1>
          </div>

          {/* Right side - Wallet status */}
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
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen flex-col items-center gap-8 p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Payment Dashboard
          </h2>
          <p className="text-purple-200 text-xl max-w-md opacity-80">
            Manage your payments with ease
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-8">
          <div 
            onClick={() => handleNavigation('/save')}
            className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 
                       hover:bg-white/15 hover:border-white/30 transition-all duration-500 cursor-pointer
                       shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl 
                               flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Save className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  Generate HashLinks
                </h3>
                <ArrowRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <p className="text-purple-200 leading-relaxed">
             make custom payment links with just a prompt
            </p>
            <div className="mt-4 flex items-center text-sm text-purple-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              share your payment links with anyone
            </div>
          </div>

          <div 
            onClick={() => handleNavigation('/pay')}
            className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 
                       hover:bg-white/15 hover:border-white/30 transition-all duration-500 cursor-pointer
                       shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl 
                               flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  Explore HashLinks
                </h3>
                <ArrowRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <p className="text-purple-200 leading-relaxed">
              Explore all links generated by other users
            </p>
            <div className="mt-4 flex items-center text-sm text-purple-300">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse"></div>
              One-Click Payments
            </div>
          </div>
        </div>

        {/* Footer Info */}
        
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