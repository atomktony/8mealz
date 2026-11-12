import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PartnersContent } from "@/components/partners/partners-content"

export const metadata = {
  title: "Become a market partner",
  description: "Join 8Mealz as a market partner in Cabo Verde and reach families sending food from abroad.",
}

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main>
        <PartnersContent />
      </main>
      <Footer />
    </>
  )
}
