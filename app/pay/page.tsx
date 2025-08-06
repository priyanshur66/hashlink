"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";
import { Wallet, CreditCard, Plus, ExternalLink, Sparkles, ArrowRight } from "lucide-react";

// DB type
type PaymentLink = {
  id: string;
  title: string;
  to_account: string;
  amount: number;
  memo: string | null;
  description: string | null;
};

export default function PayListPage() {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [links, setLinks] = useState<PaymentLink[]>([]);

  useEffect(() => {
    setConnectedAccount(getConnectedAccount());
    refreshLinks();
  }, []);

  const refreshLinks = async () => {
    try {
      const res = await fetch("/api/links", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load links");
      setLinks((data.links || []).map((l: any) => ({
        id: l.id,
        title: l.title,
        to_account: l.to_account,
        amount: Number(l.amount),
        memo: l.memo,
        description: l.description,
      })));
    } catch {}
  };

  const onConnect = async () => {
    const info = await connectWallet();
    setConnectedAccount(info?.accountId ?? getConnectedAccount());
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
        {[...Array(15)].map((_, i) => (
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
        <div className="w-full max-w-5xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur opacity-50"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Choose a HashLink
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {!isWalletConnected() ? (
                <button 
                  onClick={onConnect} 
                  className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold
                             hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
                             shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-50 -z-10 group-hover:opacity-75 transition-opacity"></div>
                </button>
              ) : (
                <div className="backdrop-blur-sm bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-2">
                  <div className="flex items-center gap-2 text-green-300 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Payer: <span className="font-mono text-white">{connectedAccount}</span>
                  </div>
                </div>
              )}
              
              <Link 
                href="/save" 
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-semibold
                           hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300
                           shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Create new payment link
                <Plus className="w-4 h-4" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-50 -z-10 group-hover:opacity-75 transition-opacity"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Links Grid */}
        <div className="w-full max-w-5xl">
          {links.length === 0 ? (
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Plus className="w-8 h-8 text-purple-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl blur opacity-50"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-white text-lg font-medium">No payment links found</div>
                  <div className="text-purple-200">Create your first payment link to get started</div>
                </div>
                <Link 
                  href="/save" 
                  className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold
                             hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300
                             shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Go to Save page
                  <ArrowRight className="w-4 h-4" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-50 -z-10 group-hover:opacity-75 transition-opacity"></div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((l) => (
                <div 
                  key={l.id} 
                  className="group backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl
                             hover:bg-white/15 hover:border-white/30 transition-all duration-500
                             transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-white text-lg group-hover:text-purple-200 transition-colors line-clamp-2">
                          {l.title}
                        </h3>
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                        </div>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="text-purple-200 text-sm flex items-center gap-2">
                          <span className="font-bold text-lg text-white">{l.amount} HBAR</span>
                          <ArrowRight className="w-4 h-4 text-purple-300" />
                          <span className="font-mono text-xs bg-black/20 px-2 py-1 rounded">{l.to_account}</span>
                        </div>
                      </div>

                      {l.memo && (
                        <div className="text-purple-300 text-sm">
                          <span className="text-purple-400 font-medium">Memo:</span> {l.memo}
                        </div>
                      )}

                      {l.description && (
                        <div className="text-purple-200 text-sm leading-relaxed line-clamp-3">
                          {l.description}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <Link 
                        href={`/pay/${l.id}`} 
                        className="group/btn relative px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold
                                   hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300
                                   shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-50 -z-10 group-hover/btn:opacity-75 transition-opacity"></div>
                      </Link>
                      
                      <div className="text-purple-300 text-xs font-mono bg-black/20 px-2 py-1 rounded">
                        /pay/{l.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}