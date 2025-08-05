"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";

const STORAGE_KEY = "payment_details_v1";

export default function SavePage() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  useEffect(() => {
    setConnectedAccount(getConnectedAccount());
    // Preload from existing saved details, if any
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { to, amount, memo } = JSON.parse(raw);
        setTo(to || "");
        setAmount(String(amount ?? ""));
        setMemo(memo || "");
      }
    } catch {}
  }, []);

  const onConnect = async () => {
    const info = await connectWallet();
    setConnectedAccount(info?.accountId ?? getConnectedAccount());
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    const amt = parseFloat(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      alert("Enter a valid positive amount in HBAR");
      return;
    }

    if (!to) {
      alert("Recipient account ID is required (e.g. 0.0.x)");
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ to, amount: amt, memo }));
      setSaved(true);
    } catch (e) {
      alert("Failed to save to localStorage");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <div className="w-full max-w-lg flex items-center justify-between">
        <h1 className="text-xl font-semibold">Save Payment Details</h1>
        {!isWalletConnected() ? (
          <button onClick={onConnect} className="px-3 py-2 rounded bg-blue-600 text-white">Connect Wallet</button>
        ) : (
          <div className="text-xs">Connected: {connectedAccount}</div>
        )}
      </div>

      <form onSubmit={onSave} className="w-full max-w-lg border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">Recipient Account ID</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0.0.xxxxx"
            className="w-full border rounded px-3 py-2 bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Amount (HBAR)</label>
          <input
            type="number"
            min="0"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10"
            className="w-full border rounded px-3 py-2 bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Memo (optional)</label>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Thanks!"
            className="w-full border rounded px-3 py-2 bg-transparent"
          />
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
        {saved && <span className="ml-2 text-green-700 text-sm">Saved!</span>}
      </form>

      <Link href="/pay" className="text-blue-600 underline">Go to Pay page</Link>
    </main>
  );
}