"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { buildAndPayTransfer, getConnectedAccount, isWalletConnected } from "@/lib/hashconnect";
import dynamic from "next/dynamic";

const WalletConnectButton = dynamic(() => import('@/app/components/WalletConnect'), { ssr: false });

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
    const updateAccount = () => {
      setConnectedAccount(getConnectedAccount());
    };
    updateAccount();
    const interval = setInterval(updateAccount, 1000);

    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/links/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Payment link not found");
        const link = data.link;
        
        console.log("📊 Loaded payment link data:");
        console.log("- ID:", id);
        console.log("- Title:", link.title);
        console.log("- To Account:", link.to_account);
        console.log("- Amount (raw):", link.amount);
        console.log("- Amount (parsed):", Number(link.amount));
        console.log("- Memo:", link.memo);
        console.log("- Full link data:", link);
        
        setTo(link.to_account);
        setAmount(Number(link.amount));
        setMemo(link.memo || undefined);
        setTitle(link.title);
        setComponentHtml(link.component_code || undefined);
        setTotals({ totalPaid: Number(link.total_paid || 0), paymentsCount: Number(link.payments_count || 0) });
      } catch (e: any) {
        setError(e?.message || "Failed to load link");
      }
    })();

    return () => clearInterval(interval);
  }, [id]);

  const onConnect = (accountId: string) => {
    setConnectedAccount(accountId);
  };

  const onPay = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("💳 Starting payment process:");
      console.log("To:", to);
      console.log("Amount:", amount);
      console.log("Memo:", memo);
      console.log("Connected Account:", getConnectedAccount());
      
      if (!isWalletConnected()) {
        setError("Please connect your wallet first.");
        setLoading(false);
        return;
      }

      // Build and have wallet submit
      console.log("🚀 Calling buildAndPayTransfer with:", { to, amount, memo });
      const result = await buildAndPayTransfer(to, amount, memo);
      console.log("✅ Payment result:", result);

      // Record payment to backend (status success); server trigger will roll up totals
      await fetch(`/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId: id,
          amount,
          payerAccount: getConnectedAccount(),
          memo: memo || null,
          status: "success",
        }),
      });

      // Refresh totals
      const res = await fetch(`/api/links/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        const link = data.link;
        setTotals({ totalPaid: Number(link.total_paid || 0), paymentsCount: Number(link.payments_count || 0) });
      }
    } catch (e: any) {
      setError(e?.message || "Payment failed");
      // Record failed attempt (optional)
      try {
        await fetch(`/api/payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkId: id, amount, payerAccount: getConnectedAccount(), memo: memo || null, status: "failed", error: e?.message || "" }),
        });
      } catch {}
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
    `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#0f0f23,#1a1a2e,#16213e);color:white;">
      <div style="background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);padding:32px 36px;border-radius:24px;max-width:600px;width:94%;border:1px solid rgba(255,255,255,0.1);box-shadow:0 25px 50px rgba(0,0,0,0.3);">
        <div style="font-size:28px;font-weight:700;margin-bottom:12px;text-align:center;">💰 ${title || "Payment"}</div>
        <div style="opacity:0.9;font-size:18px;text-align:center;margin-bottom:8px;">💳 ${amount} HBAR → ${to}</div>
        ${memo ? `<div style="opacity:0.8;margin-top:12px;font-size:14px;text-align:center;">📝 Memo: ${memo}</div>` : ""}
        <div style="margin-top:20px;text-align:center;opacity:0.7;font-size:12px;">🔒 Secure Payment with Hedera</div>
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

      

      {/* Floating controls */}
      <div className="fixed left-1/2 transform -translate-x-1/2 bottom-16 z-50">
        <div className="rounded-2xl shadow-2xl border border-white/30 bg-black/20 backdrop-blur-xl px-6 py-4 flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="text-sm text-white font-semibold drop-shadow-lg">{title || "Payment"}</div>
           
          
          </div>
          {!isWalletConnected() ? (
            <WalletConnectButton onConnect={onConnect} />
          ) : (
            <div className="text-xs text-white/90 hidden sm:block font-medium drop-shadow">Payer: {connectedAccount}</div>
          )}
          <button onClick={onPay} disabled={loading || !isWalletConnected()} className="px-5 py-2.5 rounded-lg bg-green-500/50 hover:bg-green-500/70 border border-green-300/50 text-white text-sm font-semibold backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:hover:bg-green-500/50 shadow-lg">
            {loading ? "Paying…" : "Pay"}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-sm text-white font-medium bg-red-500/30 border border-red-300/50 backdrop-blur-xl rounded-lg px-4 py-2 shadow-lg drop-shadow">{error}</div>
        )}
      </div>
    </main>
  );
}