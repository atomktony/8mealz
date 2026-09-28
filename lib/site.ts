export const site = {
  name: "8Mealz",
  tagline: "Securing remittance with food",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://8mealz.vercel.app",
  whatsapp: "+2389000000",
  email: "hello@8mealz.com",
  social: {
    instagram: "https://instagram.com/8mealz",
    whatsapp: "https://wa.me/2389000000",
    linkedin: "https://linkedin.com/company/8mealz",
  },
  credit: {
    label: "8Mealz",
    year: new Date().getFullYear(),
  },
} as const

export type Site = typeof site
