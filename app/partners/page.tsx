import { Store, TrendingUp, HandCoins } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { PartnerForm } from "@/components/partners/partner-form"
import { PARTNER_FEE_SMALL, PARTNER_FEE_LARGE, formatMoney } from "@/lib/pricing"

export const metadata = {
  title: "Become a market partner — 8Mealz",
  description: "Join 8Mealz as a market partner in Cabo Verde and reach families sending food from abroad.",
}

const benefits = [
  {
    icon: TrendingUp,
    title: "Steady new demand",
    body: "Orders come from the diaspora sending food home — a reliable stream beyond your walk-in customers.",
  },
  {
    icon: HandCoins,
    title: "Fast, fair payouts",
    body: "You are paid for every fulfilled basket. No haggling, no waiting on informal remittances.",
  },
  {
    icon: Store,
    title: "Simple monthly plans",
    body: `Small stalls from ${formatMoney(PARTNER_FEE_SMALL)}/mo, larger markets from ${formatMoney(PARTNER_FEE_LARGE)}/mo.`,
  },
]

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary text-primary-foreground">
          <Container>
            <div className="py-16 lg:py-20">
              <div className="max-w-2xl">
                <span className="text-sm font-600 text-accent">For market vendors</span>
                <h1 className="mt-3 text-balance text-4xl sm:text-5xl">Grow your market with 8Mealz</h1>
                <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
                  Families abroad want to feed their loved ones in Cabo Verde. Partner with us to source and pack fresh
                  baskets — we bring the orders, you bring the market you already know.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="py-16 lg:py-20">
              <div className="grid gap-6 sm:grid-cols-3">
                {benefits.map((b) => (
                  <div key={b.title} className="rounded-xl border border-border bg-card p-6">
                    <b.icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 font-heading text-lg font-600">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-16 max-w-2xl">
                <h2 className="text-balance text-3xl">Apply to partner</h2>
                <p className="mt-2 text-muted-foreground">
                  Tell us about your market. We review every application and reach out within a few days.
                </p>
                <div className="mt-8">
                  <PartnerForm />
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
