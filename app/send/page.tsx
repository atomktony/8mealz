import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { SendFlow } from "@/components/order/send-flow"
import { SendHeader } from "@/components/order/send-header"
import { getPackage, packages } from "@/lib/data"

export const metadata: Metadata = {
  title: "Send food home",
  description: "Choose a food package and extras for your family in Cabo Verde. No payment is taken online.",
}

const DEFAULT_PACKAGE_ID = "family-feast"

export default async function SendPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { pkg } = await searchParams
  const requested = typeof pkg === "string" ? pkg : undefined
  const initialPackageId = (requested && getPackage(requested)?.id) ?? getPackage(DEFAULT_PACKAGE_ID)?.id ?? packages[0].id

  return (
    <>
      <Navbar />
      <main className="pb-28 pt-12 lg:pb-20 lg:pt-16">
        <Container>
          <SendHeader />
          <div className="mt-10">
            <SendFlow initialPackageId={initialPackageId} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
