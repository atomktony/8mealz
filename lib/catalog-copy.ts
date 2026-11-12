import type { Dictionary } from "./dictionary"
import type { Extra, Pkg } from "./data"

// Translated display copy for catalog items. Prices and ids stay in lib/data.ts;
// falls back to the English data if a translation is missing.

export function packageCopy(t: Dictionary, pkg: Pkg): { feeds: string; items: string[] } {
  const copy = (t.catalog.packages as Record<string, { feeds: string; items: string[] } | undefined>)[pkg.id]
  return { feeds: copy?.feeds ?? pkg.feeds, items: copy?.items ?? pkg.items }
}

export function extraCopy(t: Dictionary, extra: Extra): { name: string; note: string } {
  const copy = (t.catalog.extras as Record<string, { name: string; note: string } | undefined>)[extra.id]
  return { name: copy?.name ?? extra.name, note: copy?.note ?? extra.note }
}

export function countryName(t: Dictionary, country: { id: string; name: string }): string {
  return (t.catalog.countries as Record<string, string | undefined>)[country.id] ?? country.name
}
