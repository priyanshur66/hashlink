"use client";

import { AccountId, Hbar, LedgerId, Transaction, TransferTransaction } from "@hashgraph/sdk";

// HashConnect singleton state
let hashconnect: any | null = null;
// Restore paired account from localStorage
let pairedAccountId: string | null = (typeof window !== 'undefined')
  ? localStorage.getItem('pairedAccountId')
  : null;
let initialized = false;

function getLedgerId(): LedgerId {
  const n = (process.env.NEXT_PUBLIC_HEDERA_NETWORK || process.env.HEDERA_NETWORK || "testnet").toLowerCase();
  if (n === "mainnet") return LedgerId.MAINNET;
  if (n === "previewnet") return LedgerId.PREVIEWNET;
  return LedgerId.TESTNET;
}

function getProjectId(): string {
  const pid = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!pid) throw new Error("Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in env");
  return pid;
}

function buildMetadata() {
  const url = typeof window !== "undefined" ? window.location.origin : "";
  const iconUrl = url ? url + "/next.svg" : "";
  return {
    name: "Hedera Next Demo",
    description: "Demo transfers",
    icons: iconUrl ? [iconUrl] : [],
    url: url || "",
  } as { name: string; description: string; icons: string[]; url: string };
}

export async function connectWallet(): Promise<{ accountId: string } | null> {
  if (typeof window === "undefined") return null;
  if (!hashconnect) {
    // Load HashConnect dynamically on client only
    const { HashConnect } = await import('hashconnect');
    const ledger = getLedgerId();
    const projectId = getProjectId();
    const metadata = buildMetadata();
    hashconnect = new HashConnect(ledger as any, projectId, metadata, true);
  }
  if (pairedAccountId) return { accountId: pairedAccountId };

  // Pairing event returns the session including accounts
  (hashconnect as any).pairingEvent.on((session: any) => {
    try {
      const acc = session?.accountIds?.[0] || session?.accounts?.[0] || null;
      if (acc) {
        pairedAccountId = acc;
        // Persist to localStorage
        localStorage.setItem('pairedAccountId', acc);
      }
    } catch {}
  });

  (hashconnect as any).disconnectionEvent.on(() => {
    pairedAccountId = null;
  });

  // Initialize (no localStorage restore)
  if (!initialized) {
    try {
      await (hashconnect as any).init();
      initialized = true;
    } catch (e) {
      // ignore
    }
  }

  // If already paired
  if (pairedAccountId) return { accountId: pairedAccountId };

  (hashconnect as any).openPairingModal();

  // Wait for pairing or timeout
  const start = Date.now();
  return await new Promise((resolve) => {
    const iv = setInterval(() => {
      if (pairedAccountId) {
        clearInterval(iv);
        resolve({ accountId: pairedAccountId! });
      } else if (Date.now() - start > 60_000) {
        clearInterval(iv);
        resolve(null);
      }
    }, 300);
  });
}

export function getConnectedAccount(): string | null {
  return pairedAccountId;
}

export function isWalletConnected(): boolean {
  return !!pairedAccountId;
}

export function getSignerUnsafe(): any {
  if (!hashconnect || !pairedAccountId) throw new Error("Wallet not connected");
  // Cast to any to avoid dual-SDK type conflicts
  return (hashconnect as any).getSigner(AccountId.fromString(pairedAccountId));
}

export async function sendTransactionBase64(base64: string): Promise<any> {
  if (!hashconnect || !pairedAccountId) throw new Error("Wallet not connected");
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const tx = Transaction.fromBytes(bytes) as TransferTransaction;
  // Cast args to any to bypass type mismatch between SDK copies
  return (hashconnect as any).sendTransaction(pairedAccountId, tx as any);
}

export async function disconnectWallet(): Promise<void> {
  if (hashconnect) {
    try {
      // Disconnect all sessions
      await (hashconnect as any).disconnect();
    } catch (error) {
      console.log("Error during disconnect:", error);
    }
  }
  // Reset local state
  pairedAccountId = null;
  hashconnect = null;
  initialized = false;
  // Clear persisted account
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pairedAccountId');
  }
}

export async function buildAndPayTransfer(toAccountId: string, amountHbar: number, memo?: string) {
  console.log("🔧 buildAndPayTransfer called with:");
  console.log("- toAccountId:", toAccountId);
  console.log("- amountHbar:", amountHbar);
  console.log("- memo:", memo);
  console.log("- pairedAccountId:", pairedAccountId);
  
  if (!hashconnect || !pairedAccountId) throw new Error("Wallet not connected");
  const signer = getSignerUnsafe();
  const from = AccountId.fromString(pairedAccountId);
  const to = AccountId.fromString(toAccountId);
  const amt = new Hbar(amountHbar);
  
  console.log("💰 Transaction details:");
  console.log("- From:", from.toString());
  console.log("- To:", to.toString());
  console.log("- Amount:", amt.toString());

  let tx = new TransferTransaction()
    .addHbarTransfer(from, amt.negated())
    .addHbarTransfer(to, amt);

  if (memo) {
    console.log("📝 Adding memo:", memo);
    tx = tx.setTransactionMemo(String(memo).slice(0, 100));
  }

  const frozen = await (tx as any).freezeWithSigner(signer);
  const res = await (frozen as any).executeWithSigner(signer);

  // Try to get the receipt or at least transactionId
  try {
    const receipt = await (res as any).getReceiptWithSigner?.(signer);
    return { status: "SUCCESS", transactionId: (res as any)?.transactionId?.toString?.() ?? null, receipt };
  } catch {
    return { status: "SUBMITTED", transactionId: (res as any)?.transactionId?.toString?.() ?? null };
  }
}