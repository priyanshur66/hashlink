import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/links/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { data, error } = await supabaseServer
    .from("payment_links")
    .select("id,title,to_account,amount,memo,description,component_code,total_paid,payments_count,created_at,updated_at")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ link: data });
}

// PATCH /api/links/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();

  const update: any = {};
  if (body.title !== undefined) update.title = String(body.title);
  if (body.to !== undefined) {
    const toAccount = String(body.to).trim();
    if (!/^\d+\.\d+\.\d+$/.test(toAccount)) {
      return NextResponse.json({ error: "to must match Hedera account format N.N.N (e.g., 0.0.1234)" }, { status: 400 });
    }
    update.to_account = toAccount;
  }
  if (body.amount !== undefined) {
    const amtNum = Number(body.amount);
    if (!Number.isFinite(amtNum) || amtNum <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }
    update.amount = amtNum;
  }
  if (body.memo !== undefined) update.memo = body.memo ? String(body.memo) : null;
  if (body.description !== undefined) update.description = body.description ? String(body.description) : null;
  if (body.componentCode !== undefined) update.component_code = body.componentCode ? String(body.componentCode) : null;

  const { data, error } = await supabaseServer
    .from("payment_links")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ link: data });
}

// DELETE /api/links/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { error } = await supabaseServer
    .from("payment_links")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}