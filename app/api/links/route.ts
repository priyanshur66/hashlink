import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/links -> list links
export async function GET() {
  const { data, error } = await supabaseServer
    .from("payment_links")
    .select("id,title,to_account,amount,memo,description,component_code,total_paid,payments_count,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ links: data ?? [] });
}

// POST /api/links -> create or update (upsert) a link
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id: inputId,
      title,
      to,
      amount,
      memo,
      description,
      componentCode,
    } = body ?? {};

    if (!title || !to || amount === undefined) {
      return NextResponse.json({ error: "title, to, and amount are required" }, { status: 400 });
    }

    // Validate Hedera account format (e.g., 0.0.1234)
    const toAccount = String(to).trim();
    if (!/^\d+\.\d+\.\d+$/.test(toAccount)) {
      return NextResponse.json({ error: "to must match Hedera account format N.N.N (e.g., 0.0.1234)" }, { status: 400 });
    }

    const amtNum = Number(amount);
    if (!Number.isFinite(amtNum) || amtNum <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    const id = inputId ? String(inputId) : await generateUniqueSlug(title);

    const { data, error } = await supabaseServer
      .from("payment_links")
      .upsert(
        [{
          id,
          title: String(title).slice(0, 80),
          to_account: toAccount,
          amount: amtNum,
          memo: memo ? String(memo) : null,
          description: description ? String(description) : null,
          component_code: componentCode ? String(componentCode) : null,
        }],
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ link: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}

async function generateUniqueSlug(base: string): Promise<string> {
  const slug = (base || "link")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || `link-${Date.now()}`;

  let candidate = slug;
  let i = 1;
  // check for existing
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabaseServer
      .from("payment_links")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return candidate;
    candidate = `${slug}-${i++}`;
  }
}