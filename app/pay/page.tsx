"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildAndPayTransfer, connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";

const STORAGE_KEY = "payment_details_v1";

type PayDetails = { to: string; amount: number; memo?: string };

export default function PayPage() {
  const [details, setDetails] = useState<PayDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  useEffect(() => {
    setConnectedAccount(getConnectedAccount());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.to && parsed.amount) setDetails(parsed);
      }
    } catch {}
  }, []);

  const onConnect = async () => {
    const info = await connectWallet();
    setConnectedAccount(info?.accountId ?? getConnectedAccount());
  };

  const onPay = async () => {
    if (!details) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (!isWalletConnected()) {
        const info = await connectWallet();
        setConnectedAccount(info?.accountId ?? getConnectedAccount());
        if (!getConnectedAccount()) throw new Error("Connect wallet first");
      }
      const res = await buildAndPayTransfer(details.to, details.amount, details.memo);
      setResult(res);
    } catch (e: any) {
      setError(e?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <div className="w-full max-w-lg flex items-center justify-between">
        <h1 className="text-xl font-semibold">Load & Pay</h1>
        {!isWalletConnected() ? (
          <button onClick={onConnect} className="px-3 py-2 rounded bg-blue-600 text-white">Connect Wallet</button>
        ) : (
          <div className="text-xs">Payer: {connectedAccount}</div>
        )}
      </div>

      <div className="w-full max-w-lg border rounded-xl p-6 space-y-2">
        {details ? (
          <>
            <div className="text-sm"><span className="font-medium">Recipient:</span> {details.to}</div>
            <div className="text-sm"><span className="font-medium">Amount:</span> {details.amount} HBAR</div>
            {details.memo ? (
              <div className="text-sm"><span className="font-medium">Memo:</span> {details.memo}</div>
            ) : null}
            <button onClick={onPay} disabled={loading} className="mt-4 px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60">
              {loading ? "Paying..." : "Pay with Connected Wallet"}
            </button>
          </>
        ) : (
          <div className="text-sm text-gray-600">No saved details found. Go to the Save page first.</div>
        )}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {result && (
        <pre className="w-full max-w-lg text-xs whitespace-pre-wrap bg-black/5 dark:bg-white/5 p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}

      <Link href="/save" className="text-blue-600 underline">Back to Save page</Link>
    </main>
  );
}