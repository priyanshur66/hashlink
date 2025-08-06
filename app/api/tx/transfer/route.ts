import { NextRequest, NextResponse } from "next/server";
import { AccountId, Hbar, TransferTransaction } from "@hashgraph/sdk";

// POST /api/tx/transfer -> returns a credit-only unsigned transaction (unfrozen)
// Body: { toAccountId: string, amountHbar: string | number, memo?: string }
// Wallet will set payer (from), add negative leg, set txId, freeze, sign, and submit.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toAccountId, amountHbar, memo } = body ?? {};

    if (!toAccountId || amountHbar === undefined) {
      return NextResponse.json({ error: "Missing toAccountId or amountHbar" }, { status: 400 });
    }

    let toId: AccountId;
    try {
      toId = AccountId.fromString(toAccountId);
    } catch {
      return NextResponse.json({ error: "Invalid toAccountId" }, { status: 400 });
    }

    const amtNum = Number(amountHbar);
    if (!Number.isFinite(amtNum) || amtNum <= 0) {
      return NextResponse.json({ error: "amountHbar must be a positive number" }, { status: 400 });
    }
    const amt = new Hbar(amtNum);

    let tx: TransferTransaction = new TransferTransaction()
      .addHbarTransfer(toId, amt);

    if (memo) {
      tx = tx.setTransactionMemo(String(memo).slice(0, 100));
    }

    // Do NOT freeze, do NOT set transactionId; wallet will complete it
    const bytes = Buffer.from(tx.toBytes()).toString("base64");

    return NextResponse.json({
      type: "TRANSFER_HBAR_TEMPLATE",
      toAccountId: toId.toString(),
      amountTinybar: amt.toTinybars().toString(),
      memo: memo ?? null,
      unsignedTransactionBase64: bytes,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}