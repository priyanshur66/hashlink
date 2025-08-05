"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { buildAndPayTransfer, connectWallet, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";
import { getLink, recordPayment } from "@/lib/storage";

export default function PayDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [componentHtml, setComponentHtml] = useState<string | undefined>(undefined);
  const [totals, setTotals] = useState<{ totalPaid: number; paymentsCount: number }>({ totalPaid: 0, paymentsCount: 0 });

  useEffect(() => {
    setConnectedAccount(getConnectedAccount());
    if (!id) return;
    try {
      const link = getLink(id);
      if (!link) {
        setError("Payment link not found");
        return;
      }
      setTo(link.to);
      setAmount(link.amount);
      setMemo(link.memo);
      setTitle(link.title);
      setComponentHtml(link.componentCode);
      setTotals({ totalPaid: Number(link.totalPaid || 0), paymentsCount: Number(link.paymentsCount || 0) });
    } catch {
      setError("Failed to load link");
    }
  }, [id]);

  const onConnect = async () => {
    const info = await connectWallet();
    setConnectedAccount(info?.accountId ?? getConnectedAccount());
  };

  const onPay = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isWalletConnected()) {
        const info = await connectWallet();
        setConnectedAccount(info?.accountId ?? getConnectedAccount());
        if (!getConnectedAccount()) throw new Error("Connect wallet first");
      }
      await buildAndPayTransfer(to, amount, memo);
      const updated = recordPayment(id, amount);
      if (updated) setTotals({ totalPaid: Number(updated.totalPaid || 0), paymentsCount: Number(updated.paymentsCount || 0) });
    } catch (e: any) {
      setError(e?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const sanitizeHtml = (html: string) =>
    html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/ on[a-z]+="[^"]*"/gi, "")
      .replace(/ on[a-z]+='[^']*'/gi, "");

  // Fallback simple design when no component is stored
  const fallback = (
    `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#0ea5e9,#22c55e);color:white;">
      <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(6px);padding:24px 28px;border-radius:16px;max-width:560px;width:92%;">
        <div style="font-size:24px;font-weight:700;margin-bottom:6px;">${title || "Payment"}</div>
        <div style="opacity:0.9">${amount} HBAR → ${to}</div>
        ${memo ? `<div style="opacity:0.8;margin-top:6px;">Memo: ${memo}</div>` : ""}
      </div>
    </div>`
  );

  return (
    <main className="relative min-h-screen">
      {/* Full-screen design from AI */}
      <div className="absolute inset-0 overflow-auto">
        <div
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(componentHtml || fallback) }}
        />
      </div>

      {/* Floating totals (top-left) */}
      <div className="fixed left-4 top-4 z-50">
        <div className="rounded-xl shadow-lg border bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-4 py-2">
          <div className="text-xs text-gray-500">Total paid</div>
          <div className="text-sm font-semibold">{totals.totalPaid} HBAR</div>
          <div className="text-[10px] text-gray-500">{totals.paymentsCount} payments</div>
        </div>
      </div>

      {/* Floating controls */}
      <div className="fixed right-4 bottom-4 z-50">
        <div className="rounded-xl shadow-lg border bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-4 py-3 flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="text-xs text-gray-500">{title || "Payment"}</div>
            <div className="text-sm font-medium">{amount} HBAR</div>
            <div className="text-[10px] text-gray-500">Total: {totals.totalPaid} HBAR • {totals.paymentsCount} payments</div>
          </div>
          {!isWalletConnected() ? (
            <button onClick={onConnect} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Connect</button>
          ) : (
            <div className="text-[10px] text-gray-500 hidden sm:block">Payer: {connectedAccount}</div>
          )}
          <button onClick={onPay} disabled={loading} className="px-3 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-60">
            {loading ? "Paying…" : "Pay"}
          </button>
        </div>
        {error && (
          <div className="mt-2 text-xs text-white bg-red-600/90 rounded px-3 py-2 shadow">{error}</div>
        )}
      </div>
    </main>
  );
}