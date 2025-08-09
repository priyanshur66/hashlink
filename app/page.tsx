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
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* New geometric shapes */}
        <div className="absolute top-20 right-1/4 w-32 h-32 border border-purple-300/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 border border-pink-300/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-r from-purple-400/30 to-pink-400/30 transform rotate-12 animate-float"></div>
      </div>

      {/* Floating particles - enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-2 h-2 bg-purple-300/40' : 
              i % 3 === 1 ? 'w-1.5 h-1.5 bg-pink-300/40' : 
              'w-1 h-1 bg-blue-300/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header - keeping exactly the same */}
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

      <main className="relative z-10 min-h-screen">
        {/* New split-screen hero layout */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left side - Hero content */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
            <div className="max-w-2xl">
              {/* Animated badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200 text-sm font-medium">Powered by Hedera Network</span>
              </div>

              <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent block">
                  hashlinks
                </span>
              </h2>
              
              <p className="text-xl text-purple-100/80 mb-12 leading-relaxed max-w-xl">
                Create, share, and execute payment links with ease.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold text-white mb-1">0.001s</div>
                  <div className="text-purple-200 text-sm">Transaction Speed</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold text-white mb-1">$0.0001</div>
                  <div className="text-purple-200 text-sm">Average Fee</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-purple-200 text-sm">Uptime</div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Ready to revolutionize payments?</h3>
                <p className="text-purple-200/80 text-sm mb-4">
                  Connect your wallet to access all features and start creating secure payment links instantly.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-purple-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    Generate HashLinks
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    AI-Powered Txn Creation
                  </div>
                  <div className="flex items-center gap-2">
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Interactive feature showcase */}
          <div className="flex-1 flex items-center justify-center px-8 py-16 lg:py-24">
            <div className="max-w-lg w-full space-y-8">
              {/* Feature cards in vertical stack with staggered animations */}
              <div className="relative">
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 rounded-3xl p-8 hover:from-white/20 hover:to-white/10 transition-all duration-700 transform hover:scale-105 hover:rotate-1 shadow-2xl">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                        <Save className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-40 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">Generate HashLinks</h3>
                      <p className="text-purple-100/80 text-sm leading-relaxed">
                        Create payment links with AI on hedera network.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-purple-300">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span>Secure • customizable • Instant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative transform translate-x-4">
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 rounded-3xl p-8 hover:from-white/20 hover:to-white/10 transition-all duration-700 transform hover:scale-105 hover:-rotate-1 shadow-2xl">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                        <Wallet className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl blur opacity-40 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">Execute HashLinks</h3>
                      <p className="text-purple-100/80 text-sm leading-relaxed">
                        Load payment details instantly and execute transactions with your wallet.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-purple-300">
                        <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                        <span>One-Click • Fast</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative transform -translate-x-2">
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 rounded-3xl p-8 hover:from-white/20 hover:to-white/10 transition-all duration-700 transform hover:scale-105 hover:rotate-1 shadow-2xl">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                        <Link className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl blur opacity-40 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">Customizable</h3>
                      <p className="text-purple-100/80 text-sm leading-relaxed">
                        Tailor your links UI with prompts and AI-generated designs.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-purple-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        <span>Customizable UI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

        
            </div>
          </div>
        </div>
      </main>

      {/* Collision Animation Section */}
      <section className="relative z-10 py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              The Magic of <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI-Powered Hashlinks</span>
            </h3>
            <p className="text-purple-200 text-lg">AI transforms payments into instant Links</p>
          </div>
          
          {/* Animation Container */}
          <div className="relative h-32 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            {/* AI Icon - comes from right */}
            <div className="absolute top-1/2 -translate-y-1/2 right-8 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-slide-left">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            
            {/* Dollar Icon - comes from left */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-slide-right">
              <span className="text-white font-bold text-xl">$</span>
            </div>
            
            {/* Collision Point with Sparkles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center">
              <div className="collision-sparkle opacity-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-sparkle"></div>
              
              {/* Multiple sparkle particles */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-particle-1 opacity-0"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-pink-400 rounded-full animate-particle-2 opacity-0"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-particle-3 opacity-0"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-particle-4 opacity-0"></div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-particle-5 opacity-0"></div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-particle-6 opacity-0"></div>
              <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-particle-7 opacity-0"></div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-particle-8 opacity-0"></div>
            </div>
            
            {/* Result Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-6 opacity-0 animate-result-text">
              <div className="text-white font-semibold text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                ✨ HashLink Created!
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-purple-300 text-sm">
              AI + Money = Intelligent Payment Magic ✨
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Collision Animation Keyframes */
        @keyframes slide-left {
          0% {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
          45% {
            transform: translateX(-400px) translateY(-50%);
            opacity: 1;
          }
          50% {
            transform: translateX(-420px) translateY(-50%);
            opacity: 0;
          }
          50.1% {
            transform: translateX(0) translateY(-50%);
            opacity: 0;
          }
          55% {
            opacity: 1;
          }
          100% {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }
        
        @keyframes slide-right {
          0% {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
          45% {
            transform: translateX(400px) translateY(-50%);
            opacity: 1;
          }
          50% {
            transform: translateX(420px) translateY(-50%);
            opacity: 0;
          }
          50.1% {
            transform: translateX(0) translateY(-50%);
            opacity: 0;
          }
          55% {
            opacity: 1;
          }
          100% {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }
        
        @keyframes sparkle {
          0%, 40% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          60% {
            opacity: 0.8;
            transform: scale(1.2) rotate(270deg);
          }
          70%, 100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }
        
        @keyframes particle-1 {
          0%, 45% { opacity: 0; transform: translate(0, 0) scale(0); }
          50% { opacity: 1; transform: translate(-20px, -20px) scale(1); }
          70% { opacity: 0; transform: translate(-40px, -40px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }
        
        @keyframes particle-2 {
          0%, 45% { opacity: 0; transform: translate(0, 0) scale(0); }
          52% { opacity: 1; transform: translate(20px, -20px) scale(1); }
          72% { opacity: 0; transform: translate(40px, -40px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }
        
        @keyframes particle-3 {
          0%, 45% { opacity: 0; transform: translate(0, 0) scale(0); }
          54% { opacity: 1; transform: translate(-20px, 20px) scale(1); }
          74% { opacity: 0; transform: translate(-40px, 40px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }
        
        @keyframes particle-4 {
          0%, 45% { opacity: 0; transform: translate(0, 0) scale(0); }
          56% { opacity: 1; transform: translate(20px, 20px) scale(1); }
          76% { opacity: 0; transform: translate(40px, 40px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }
        
        @keyframes particle-5 {
          0%, 45% { opacity: 0; transform: translate(-50%, 0) scale(0); }
          51% { opacity: 1; transform: translate(-50%, -30px) scale(1); }
          71% { opacity: 0; transform: translate(-50%, -60px) scale(0); }
          100% { opacity: 0; transform: translate(-50%, 0) scale(0); }
        }
        
        @keyframes particle-6 {
          0%, 45% { opacity: 0; transform: translate(-50%, 0) scale(0); }
          53% { opacity: 1; transform: translate(-50%, 30px) scale(1); }
          73% { opacity: 0; transform: translate(-50%, 60px) scale(0); }
          100% { opacity: 0; transform: translate(-50%, 0) scale(0); }
        }
        
        @keyframes particle-7 {
          0%, 45% { opacity: 0; transform: translate(0, -50%) scale(0); }
          55% { opacity: 1; transform: translate(-30px, -50%) scale(1); }
          75% { opacity: 0; transform: translate(-60px, -50%) scale(0); }
          100% { opacity: 0; transform: translate(0, -50%) scale(0); }
        }
        
        @keyframes particle-8 {
          0%, 45% { opacity: 0; transform: translate(0, -50%) scale(0); }
          57% { opacity: 1; transform: translate(30px, -50%) scale(1); }
          77% { opacity: 0; transform: translate(60px, -50%) scale(0); }
          100% { opacity: 0; transform: translate(0, -50%) scale(0); }
        }
        
        @keyframes result-text {
          0%, 60% {
            opacity: 0;
            transform: translateX(-50%) translateY(24px) scale(0.8);
          }
          65% {
            opacity: 1;
            transform: translateX(-50%) translateY(24px) scale(1);
          }
          85% {
            opacity: 1;
            transform: translateX(-50%) translateY(24px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(24px) scale(0.8);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-left {
          animation: slide-left 4s ease-in-out infinite;
        }
        
        .animate-slide-right {
          animation: slide-right 4s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 4s ease-in-out infinite;
        }
        
        .animate-particle-1 {
          animation: particle-1 4s ease-out infinite;
        }
        
        .animate-particle-2 {
          animation: particle-2 4s ease-out infinite;
        }
        
        .animate-particle-3 {
          animation: particle-3 4s ease-out infinite;
        }
        
        .animate-particle-4 {
          animation: particle-4 4s ease-out infinite;
        }
        
        .animate-particle-5 {
          animation: particle-5 4s ease-out infinite;
        }
        
        .animate-particle-6 {
          animation: particle-6 4s ease-out infinite;
        }
        
        .animate-particle-7 {
          animation: particle-7 4s ease-out infinite;
        }
        
        .animate-particle-8 {
          animation: particle-8 4s ease-out infinite;
        }
        
        .animate-result-text {
          animation: result-text 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}