import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { OrderFlow } from "@/components/order/order-flow"

export default function SendPage() {
  return (
    <>
      <Navbar />
      <main className="py-12 lg:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h1 className="text-balance text-3xl sm:text-4xl">Send food home</h1>
            <p className="mt-2 text-muted-foreground">
              Choose a package, add extras, and we deliver fresh food to your family in Cabo Verde.
            </p>
            <div className="mt-10">
              <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
                <OrderFlow />
              </Suspense>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
