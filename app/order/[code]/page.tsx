import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { ButtonLink } from "@/components/ui/button"
import { getOrderByCode } from "@/lib/store"
import { getNeighborhood, getPackage, getExtra } from "@/lib/data"
import { formatMoney } from "@/lib/pricing"

export default async function OrderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const order = getOrderByCode(code)
  if (!order) notFound()

  const pkg = getPackage(order.packageId)
  const neighborhood = getNeighborhood(order.neighborhoodId)

  return (
    <>
      <Navbar />
      <main className="py-12 lg:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-14 w-14 text-primary" />
              <h1 className="mt-4 text-balance text-3xl sm:text-4xl">Order reserved</h1>
              <p className="mt-2 text-muted-foreground">
                We&apos;ve reserved fresh food for {order.recipientName}. Share this pickup code with them.
              </p>
              <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-8 py-5">
                <p className="text-xs font-600 uppercase tracking-wide text-muted-foreground">Pickup code</p>
                <p className="font-heading text-4xl font-700 tracking-wider text-primary">{order.code}</p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-700">{pkg?.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Delivery to {neighborhood?.name}, {neighborhood?.city}
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {order.totals.lines.map((line) => (
                  <li key={line.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{line.label}</span>
                    <span className="font-600">{formatMoney(line.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-600">{formatMoney(order.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee (8%)</span>
                  <span className="font-600">{formatMoney(order.totals.serviceFee)}</span>
                </div>
                {order.totals.membership > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membership</span>
                    <span className="font-600">{formatMoney(order.totals.membership)}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-heading font-700">Total</span>
                <span className="font-heading text-xl font-700 text-primary">{formatMoney(order.totals.total)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/send">Send another</ButtonLink>
              <ButtonLink href="/" variant="outline">
                Back home
              </ButtonLink>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              This is a demo. Order data resets when the server restarts.{" "}
              <Link href="/admin" className="underline">
                View operations dashboard
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
