"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";

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
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <div className="w-full max-w-3xl flex items-center justify-between">
        <h1 className="text-xl font-semibold">Choose a Payment</h1>
        {!isWalletConnected() ? (
          <button onClick={onConnect} className="px-3 py-2 rounded bg-blue-600 text-white">Connect Wallet</button>
        ) : (
          <div className="text-xs">Payer: {connectedAccount}</div>
        )}
      </div>

      <div className="w-full max-w-3xl">
        {links.length === 0 ? (
          <div className="border rounded-xl p-6 text-sm text-gray-600">
            No payment links found. Create one on the Save page.
            <div className="mt-3">
              <Link href="/save" className="text-blue-600 underline">Go to Save page</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map((l) => (
              <div key={l.id} className="border rounded-xl p-5 flex flex-col gap-2">
                <div className="font-medium">{l.title}</div>
                <div className="text-sm text-gray-600">{l.amount} HBAR → {l.to_account}</div>
                {l.memo ? <div className="text-xs text-gray-500">Memo: {l.memo}</div> : null}
                {l.description ? <div className="text-xs text-gray-500 line-clamp-2">{l.description}</div> : null}
                <div className="flex items-center justify-between mt-2">
                  <Link href={`/pay/${l.id}`} className="px-3 py-2 rounded bg-green-600 text-white text-sm">Open</Link>
                  <div className="text-xs text-gray-500">/pay/{l.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/save" className="text-blue-600 underline">Create new payment link</Link>
    </main>
  );
}