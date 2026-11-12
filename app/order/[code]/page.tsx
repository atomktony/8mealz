import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { OrderDetails } from "@/components/order/order-details"
import { getOrderByCode } from "@/lib/store"
import { recallOrder } from "@/lib/order-session"

export default async function OrderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const order = getOrderByCode(code) ?? (await recallOrder(code))
  if (!order) notFound()

  return (
    <>
      <Navbar />
      <main className="py-12 lg:py-16">
        <Container>
          <OrderDetails order={order} />
        </Container>
      </main>
      <Footer />
    </>
  )
}
