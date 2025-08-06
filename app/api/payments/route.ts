import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// POST /api/payments -> record a payment attempt or success
// Body: { linkId: string, amount: number, payerAccount?: string, memo?: string, txId?: string, status?: 'submitted'|'success'|'failed', error?: string, ledger?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { linkId, amount, payerAccount, memo, txId, status, error: err, ledger } = body ?? {};

    if (!linkId || amount === undefined) {
      return NextResponse.json({ error: "linkId and amount are required" }, { status: 400 });
    }

    const payload = {
      link_id: String(linkId),
      amount: Number(amount),
      payer_account: payerAccount ? String(payerAccount) : null,
      memo: memo ? String(memo) : null,
      tx_id: txId ? String(txId) : null,
      status: status ?? 'submitted',
      error: err ? String(err) : null,
      ledger: ledger ? String(ledger) : null,
    } as const;

    const { data, error } = await supabaseServer
      .from("payments")
      .insert([payload])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ payment: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}