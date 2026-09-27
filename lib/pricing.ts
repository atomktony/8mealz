// Single source of truth for money. All order totals are recomputed on the
// server from this file plus lib/data.ts. Never trust a total from the client.

export const CURRENCY = "USD"
export const CURRENCY_SYMBOL = "$"

// The 8s that give the brand its name.
export const MEMBERSHIP_FEE = 8 // charged once per sender email per year
export const SERVICE_FEE_RATE = 0.08 // 8% service fee at checkout
export const MARKUP_RATE = 0.08 // 8% markup baked into partner sourcing

// Monthly fees for market partners.
export const PARTNER_FEE_SMALL = 18
export const PARTNER_FEE_LARGE = 80

export function formatMoney(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`
}

export type PriceLine = {
  label: string
  amount: number
}

export type OrderTotals = {
  lines: PriceLine[]
  subtotal: number
  serviceFee: number
  membership: number
  total: number
}

/**
 * Recompute an order total from trusted server-side prices.
 * @param items resolved [{ label, price }] for the chosen package + extras
 * @param includeMembership whether the once-a-year membership applies
 */
export function computeTotals(
  items: { label: string; price: number }[],
  includeMembership: boolean,
): OrderTotals {
  const lines: PriceLine[] = items.map((i) => ({ label: i.label, amount: i.price }))
  const subtotal = round(items.reduce((sum, i) => sum + i.price, 0))
  const serviceFee = round(subtotal * SERVICE_FEE_RATE)
  const membership = includeMembership ? MEMBERSHIP_FEE : 0
  const total = round(subtotal + serviceFee + membership)
  return { lines, subtotal, serviceFee, membership, total }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
