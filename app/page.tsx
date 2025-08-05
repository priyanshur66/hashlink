"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";

export default function Home() {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  useEffect(() => {
    setConnectedAccount(getConnectedAccount());
  }, []);

  const onConnect = async () => {
    const info = await connectWallet();
    setConnectedAccount(info?.accountId ?? getConnectedAccount());
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8">
      <div className="flex items-center gap-3 mt-6">
        <Image src="/next.svg" alt="logo" width={90} height={20} />
        <h1 className="text-2xl font-semibold">Hedera Pay Demo</h1>
      </div>

      <div className="flex gap-4">
        {!isWalletConnected() ? (
          <button onClick={onConnect} className="px-4 py-2 rounded bg-blue-600 text-white">Connect Wallet</button>
        ) : (
          <div className="text-sm">Connected: {connectedAccount}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link href="/save" className="border rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-zinc-900">
          <div className="font-medium text-lg mb-2">Save Payment Details</div>
          <p className="text-sm text-gray-600">Enter recipient account, amount, and memo. We store it in your browser localStorage.</p>
        </Link>
        <Link href="/pay" className="border rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-zinc-900">
          <div className="font-medium text-lg mb-2">Load & Pay</div>
          <p className="text-sm text-gray-600">Load saved details and pay using the connected wallet (sender auto-filled).</p>
        </Link>
      </div>

      <div className="text-xs text-gray-500 mt-10">
        The payer is always the currently connected wallet. No sender address field is needed.
      </div>
    </main>
  );
}