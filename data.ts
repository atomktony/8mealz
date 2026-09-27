// Catalog for the pilot. Prices already include the 8% platform markup.
// Edit prices here. Checkout totals are always recomputed on the server from this file.

export type Lang = "en" | "pt";
type L = Record<Lang, string>;

export interface Package {
  id: string;
  name: L;
  description: L;
  frequency: L;
  price: number;
  items: string[];
  popular?: boolean;
}

export interface Extra {
  id: string;
  name: L;
  unit: L;
  price: number;
  icon: "tomato" | "leaf" | "carrot" | "citrus" | "egg" | "wheat";
}

export const PACKAGES: Package[] = [
  {
    id: "elder-care",
    name: { en: "Elder care and nutrition basket", pt: "Cabaz de cuidado sénior e nutrição" },
    description: {
      en: "Built for older relatives and special diets. Fresh greens, whole grains and low-sugar staples.",
      pt: "Pensado para familiares mais velhos e dietas especiais. Verduras frescas, cereais integrais e produtos com pouco açúcar.",
    },
    frequency: { en: "Every 2 weeks", pt: "A cada 2 semanas" },
    price: 38,
    items: [
      "Couve & espinafre",
      "Batata-doce 2kg",
      "Azeite virgem extra",
      "Alho & gengibre",
      "Flocos de aveia",
      "Ovos da terra (12)",
    ],
    popular: true,
  },
  {
    id: "family-staples",
    name: { en: "Weekly family staples", pt: "Cabaz semanal da família" },
    description: {
      en: "The pantry base for a household in Praia. Rice, beans, fresh vegetables, oil and milk.",
      pt: "A base da despensa de uma casa na Praia. Arroz, feijão, legumes frescos, óleo e leite.",
    },
    frequency: { en: "Weekly or every 2 weeks", pt: "Semanal ou a cada 2 semanas" },
    price: 52,
    items: [
      "Arroz agulha 5kg",
      "Feijão pedra 2kg",
      "Tomate & cebola 3kg",
      "Banana da terra",
      "Óleo & leite",
      "Temperos & sal",
    ],
  },
  {
    id: "custom-box",
    name: { en: "Custom care box", pt: "Caixa personalizada" },
    description: {
      en: "Start from a base box and add the extras your family needs. The market confirms stock before pickup.",
      pt: "Comece com uma caixa base e junte os extras que a sua família precisa. O mercado confirma o stock antes do levantamento.",
    },
    frequency: { en: "One-off or scheduled", pt: "Pontual ou programada" },
    price: 25,
    items: ["Base box of staples", "Add extras below", "Notes for include or avoid"],
  },
];

export const EXTRAS: Extra[] = [
  { id: "tomatoes", name: { en: "Vine tomatoes", pt: "Tomate de rama" }, unit: { en: "1 kg", pt: "1 kg" }, price: 4.8, icon: "tomato" },
  { id: "greens", name: { en: "Greens bundle", pt: "Molho de verduras" }, unit: { en: "1 bunch", pt: "1 molho" }, price: 3.5, icon: "leaf" },
  { id: "roots", name: { en: "Sweet potato, manioc and carrots", pt: "Batata-doce, mandioca e cenoura" }, unit: { en: "2 kg", pt: "2 kg" }, price: 5.2, icon: "carrot" },
  { id: "fruit", name: { en: "Local fruit basket", pt: "Cesto de fruta local" }, unit: { en: "1.5 kg", pt: "1,5 kg" }, price: 6.9, icon: "citrus" },
  { id: "eggs", name: { en: "Farm eggs", pt: "Ovos da terra" }, unit: { en: "12 eggs", pt: "12 ovos" }, price: 3.2, icon: "egg" },
  { id: "rice", name: { en: "Rice", pt: "Arroz agulha" }, unit: { en: "5 kg", pt: "5 kg" }, price: 7.5, icon: "wheat" },
];

export const NEIGHBORHOODS = [
  "Achada Santo António",
  "Plateau",
  "Palmarejo",
  "Várzea",
  "Fazenda",
  "Terra Branca",
  "Achada São Filipe",
  "Tira Chapéu",
  "Other / Outro",
];

export const SENDER_COUNTRIES = [
  "Portugal",
  "France",
  "Netherlands",
  "Luxembourg",
  "United States",
  "Spain",
  "Italy",
  "Brazil",
  "Other",
];

export const EXPANSION_COUNTRIES = [
  "Guinea-Bissau",
  "São Tomé and Príncipe",
  "Angola",
  "Mozambique",
  "Senegal",
  "Other islands of Cabo Verde",
];

export const ORDER_STATUSES = ["reserved", "confirmed", "preparing", "ready", "picked_up", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const findPackage = (id: string) => PACKAGES.find((p) => p.id === id);
export const findExtra = (id: string) => EXTRAS.find((e) => e.id === id);
