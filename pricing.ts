// Single source of truth for every price and fee on the site.
// The one-pager lists the model in USD. The pilot runs Portugal -> Praia, so the site shows EUR.
// Change CURRENCY here and every price on the site follows.

export const CURRENCY = {
  code: "EUR",
  symbol: "€",
  locale: "pt-PT",
} as const;

export const FEES = {
  membershipAnnual: 8, // annual user membership (sender)
  growerMonthly: 18, // monthly local grower fee
  supermarketMonthly: 80, // monthly supermarket fee
  serviceFeeRate: 0.08, // 8% service fee on grocery subtotal (sender)
  platformMarkupRate: 0.08, // 8% platform markup on merchant base prices
} as const;

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatWhole(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Merchant base price + 8% platform markup = catalog price shown to senders. */
export function withPlatformMarkup(basePrice: number): number {
  return round2(basePrice * (1 + FEES.platformMarkupRate));
}

export interface Quote {
  groceries: number;
  serviceFee: number;
  membershipFee: number;
  total: number;
}

export function quote(groceries: number, needsMembership: boolean): Quote {
  const g = round2(groceries);
  const serviceFee = round2(g * FEES.serviceFeeRate);
  const membershipFee = needsMembership ? FEES.membershipAnnual : 0;
  return {
    groceries: g,
    serviceFee,
    membershipFee,
    total: round2(g + serviceFee + membershipFee),
  };
}
