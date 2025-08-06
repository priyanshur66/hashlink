import { NextRequest, NextResponse } from "next/server";

// Simple helper to build a consistent prompt for the LLM
const SYSTEM_PROMPT = `You are an assistant that creates Hedera payment link metadata with beautiful dark theme designs.
Return ONLY a strict JSON object with these keys:
{
  "title": string,                 // short human title suitable for a link card
  "amount": number,                // positive number (HBAR)
  "memo": string | null,           // optional memo text
  "description": string | null,    // short paragraph to describe the purpose
  "componentHtml": string          // FULL-PAGE, standalone HTML snippet (single <div> root) that covers the entire viewport
}
Rules for componentHtml:
- Must be FULL PAGE: visually fill the entire viewport using height:100vh; width:100%; display:flex; or equivalent CSS to cover the complete screen area.
- Use a SINGLE <div> root element only. No <html>, <head>, or <body> tags. No external assets or dependencies.
- Use INLINE CSS styles exclusively. Do NOT include <style> or <script> tags. No iframes or external links.
- **DARK THEME REQUIRED**: Use dark backgrounds (dark blues, purples, grays, blacks) with light text for modern aesthetic.
- **GLASSMORPHISM STYLE**: Incorporate glassmorphism effects with backdrop-filter:blur(), semi-transparent backgrounds, and subtle borders.
- **EMOJIS**: Include relevant emojis (💰, 🚀, 💎, 🔥, 🎯, etc.) to make the design more engaging and modern.
- The design must prominently display the title, description, and amount in HBAR with clear visual hierarchy.
- Use gradients, shadows, and modern CSS effects for visual appeal. Colors should be dark theme friendly.
- May include generic visual references to the recipient without specific identifying details.
- Focus on creating a clean, informative interface without any interactive elements.
- Ensure excellent contrast ratios with white/light text on dark backgrounds, fully responsive layout, and safe font fallbacks (Arial, sans-serif, etc.).
- Avoid fixed headers, footers, or any elements that could obstruct content or floating controls.
- Do not include markdown syntax or backticks in the output.
- If the amount is unclear, infer a reasonable HBAR amount and mention the inference in the description.
- Design should be modern, professional, dark-themed, and utilize the full screen real estate effectively.
`;

export async function POST(req: NextRequest) {
  try {
    const { recipient, prompt } = await req.json();
    if (!recipient || !prompt) {
      return NextResponse.json({ error: "recipient and prompt are required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY on server" }, { status: 500 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o"; // Use GPT-4o for best UI generation quality

    const completionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Recipient: ${recipient}\nInstruction: ${prompt}`,
          },
        ],
        temperature: 1,
      }),
    });

    if (!completionRes.ok) {
      const errText = await completionRes.text();
      return NextResponse.json({ error: `OpenAI error: ${completionRes.status} ${errText}` }, { status: 502 });
    }

    const data = await completionRes.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) return NextResponse.json({ error: "Empty LLM response" }, { status: 502 });

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "LLM did not return valid JSON" }, { status: 502 });
    }

    const title = String(parsed.title || "Payment").slice(0, 80);
    const amount = Number(parsed.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "LLM returned invalid amount" }, { status: 502 });
    }
    const memo = parsed.memo ? String(parsed.memo).slice(0, 100) : undefined;
    const description = parsed.description ? String(parsed.description).slice(0, 400) : undefined;
    const componentHtml = parsed.componentHtml ? String(parsed.componentHtml) : undefined;

    return NextResponse.json({ title, amount, memo, description, componentHtml });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}