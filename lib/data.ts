// Product catalog. Prices here are the customer price and already include the
// 8% sourcing markup. Edit here to change what senders can order.

export type Pkg = {
  id: string
  name: string
  price: number
  feeds: string
  serves: number
  items: string[]
  popular?: boolean
}

export type Extra = {
  id: string
  name: string
  price: number
  note: string
}

export type Neighborhood = {
  id: string
  name: string
  city: string
}

export const packages: Pkg[] = [
  {
    id: "essentials-8",
    name: "Essentials 8",
    price: 32,
    feeds: "1 week",
    serves: 4,
    items: ["8 kg rice", "4 kg beans", "2 L cooking oil", "Salt, sugar, tomato paste", "8 eggs"],
  },
  {
    id: "family-feast",
    name: "Family Feast",
    price: 58,
    feeds: "2 weeks",
    serves: 5,
    items: [
      "12 kg rice",
      "6 kg beans",
      "3 L cooking oil",
      "Chicken (2 kg)",
      "Dried fish (1 kg)",
      "Vegetables & seasoning",
    ],
    popular: true,
  },
  {
    id: "protein-plus",
    name: "Protein Plus",
    price: 74,
    feeds: "2 weeks",
    serves: 6,
    items: [
      "Beef (3 kg)",
      "Chicken (3 kg)",
      "Dried fish (2 kg)",
      "8 kg rice",
      "Beans, oil & staples",
      "Fresh vegetables",
    ],
  },
]

export const extras: Extra[] = [
  { id: "gas", name: "Cooking gas refill", price: 22, note: "13 kg bottle refill" },
  { id: "produce", name: "Fresh produce box", price: 14, note: "Seasonal fruit & vegetables" },
  { id: "topup", name: "Phone top-up", price: 8, note: "Mobile credit for the family" },
  { id: "hygiene", name: "Household & hygiene", price: 16, note: "Soap, detergent, essentials" },
]

export const neighborhoods: Neighborhood[] = [
  { id: "maianga", name: "Maianga", city: "Luanda" },
  { id: "rangel", name: "Rangel", city: "Luanda" },
  { id: "cazenga", name: "Cazenga", city: "Luanda" },
  { id: "viana", name: "Viana", city: "Luanda" },
  { id: "kilamba", name: "Kilamba", city: "Luanda" },
  { id: "talatona", name: "Talatona", city: "Luanda" },
]

export function getPackage(id: string): Pkg | undefined {
  return packages.find((p) => p.id === id)
}

export function getExtra(id: string): Extra | undefined {
  return extras.find((e) => e.id === id)
}

export function getNeighborhood(id: string): Neighborhood | undefined {
  return neighborhoods.find((n) => n.id === id)
}

// Countries the pilot could expand to next. Used by the country vote widget.
export const voteCountries = [
  { id: "angola", name: "Angola" },
  { id: "mozambique", name: "Mozambique" },
  { id: "cape-verde", name: "Cape Verde" },
  { id: "guinea-bissau", name: "Guinea-Bissau" },
  { id: "brazil", name: "Brazil" },
  { id: "portugal", name: "Portugal" },
]
