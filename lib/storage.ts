"use client";

export type PaymentLink = {
  id: string; // URL-safe slug (unique)
  title: string;
  to: string; // Hedera account ID (e.g., 0.0.x)
  amount: number; // HBAR
  memo?: string;
  createdAt: number;
  // New optional metadata for customizable pages
  description?: string;
  componentCode?: string; // HTML/JSX snippet string stored in localStorage
  // Payment progress tracking
  totalPaid?: number; // total HBAR paid via this link
  paymentsCount?: number; // number of payments recorded
};

const LINKS_KEY = "payment_links_v1";
const LEGACY_KEY = "payment_details_v1"; // { to, amount, memo }

export function getAllLinks(): PaymentLink[] {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as PaymentLink[];
    return [];
  } catch {
    return [];
  }
}

export function writeAllLinks(links: PaymentLink[]) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function upsertLink(link: PaymentLink) {
  const links = getAllLinks();
  const idx = links.findIndex((l) => l.id === link.id);
  if (idx >= 0) links[idx] = link; else links.push(link);
  writeAllLinks(links);
}

export function getLink(id: string): PaymentLink | null {
  return getAllLinks().find((l) => l.id === id) ?? null;
}

export function linkExists(id: string): boolean {
  return getAllLinks().some((l) => l.id === id);
}

export function migrateLegacy(): PaymentLink[] {
  // If legacy single-entry exists, convert it to a link once
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return getAllLinks();
    const legacy = JSON.parse(raw) as { to?: string; amount?: number; memo?: string };
    if (!legacy?.to || !legacy?.amount) return getAllLinks();

    let idBase = "default";
    let id = idBase;
    let i = 1;
    while (linkExists(id)) {
      id = `${idBase}-${i++}`;
    }

    const link: PaymentLink = {
      id,
      title: "Default Payment",
      to: legacy.to,
      amount: Number(legacy.amount),
      memo: legacy.memo,
      createdAt: Date.now(),
      totalPaid: 0,
      paymentsCount: 0,
      // description/componentCode omitted for legacy
    };
    const links = [...getAllLinks(), link];
    writeAllLinks(links);
    // Remove the legacy key after migration
    try { localStorage.removeItem(LEGACY_KEY); } catch {}
    return links;
  } catch {
    return getAllLinks();
  }
}

// Utility to build a unique, URL-safe id based on a base string
export function ensureUniqueId(base: string): string {
  const slug = (base || "link").toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || `link-${Date.now()}`;
  let id = slug;
  let i = 1;
  while (linkExists(id)) {
    id = `${slug}-${i++}`;
  }
  return id;
}

// Record a successful (or submitted) payment for a link
export function recordPayment(id: string, amount: number): PaymentLink | null {
  const links = getAllLinks();
  const idx = links.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  const link = { ...links[idx] } as PaymentLink;
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) return link;
  link.totalPaid = Number(link.totalPaid || 0) + amt;
  link.paymentsCount = Number(link.paymentsCount || 0) + 1;
  links[idx] = link;
  writeAllLinks(links);
  return link;
}
