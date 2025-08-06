"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, CreditCard, Save, ArrowRight, Sparkles } from "lucide-react";
import { connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";

export default function Home() {
  const router = useRouter();
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setConnectedAccount(getConnectedAccount());
    
    // Check for wallet connection changes periodically
    const interval = setInterval(() => {
      const currentAccount = getConnectedAccount();
      if (currentAccount !== connectedAccount) {
        setConnectedAccount(currentAccount);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [connectedAccount]);

  const onConnect = async () => {
    setIsConnecting(true);
    try {
      const info = await connectWallet();
      const accountId = info?.accountId ?? getConnectedAccount();
      setConnectedAccount(accountId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
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

      <main className="relative z-10 flex min-h-screen flex-col items-center gap-8 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mt-8 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur opacity-50"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            HashLinks
          </h1>
        </div>

        <p className="text-purple-200 text-center max-w-md opacity-80">
          Experience the future of payments hashLinks
        </p>

        {/* Wallet Connection */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
          {!isWalletConnected() ? (
            <button 
              onClick={onConnect}
              disabled={isConnecting}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold
                         hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-3"
            >
              <Wallet className="w-5 h-5" />
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
            <div className="flex items-center gap-3 text-white">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="font-medium">Connected:</span>
              <span className="font-mono text-purple-200 bg-black/20 px-3 py-1 rounded-lg">
                {connectedAccount}
              </span>
            </div>
          )}
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
                  Save Payment Details
                </h3>
                <ArrowRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <p className="text-purple-200 leading-relaxed">
              Securely store recipient accounts, amounts, and memos in Supabase. 
              Create reusable payment templates for faster transactions.
            </p>
            <div className="mt-4 flex items-center text-sm text-purple-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              Encrypted & Secure Storage
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
                  Load & Pay
                </h3>
                <ArrowRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <p className="text-purple-200 leading-relaxed">
              Instantly load saved payment details and execute transactions. 
              Your connected wallet is automatically set as the sender.
            </p>
            <div className="mt-4 flex items-center text-sm text-purple-300">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse"></div>
              One-Click Payments
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="backdrop-blur-sm bg-black/20 border border-white/10 rounded-xl px-6 py-4 mt-8">
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            The payer is always the currently connected wallet. No sender address field is needed.
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