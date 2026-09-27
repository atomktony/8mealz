import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/home/hero"
import { Problem } from "@/components/home/problem"
import { HowItWorks } from "@/components/home/how-it-works"
import { ValueProps } from "@/components/home/value-props"
import { Packages } from "@/components/home/packages"
import { Extras } from "@/components/home/extras"
import { Pricing } from "@/components/home/pricing"
import { Photos } from "@/components/home/photos"
import { PilotSignup } from "@/components/home/pilot-signup"
import { CountryVote } from "@/components/home/country-vote"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <ValueProps />
        <Packages />
        <Extras />
        <Pricing />
        <Photos />
        <div className="py-16 lg:py-20">
          <PilotSignup />
        </div>
        <CountryVote />
      </main>
      <Footer />
    </>
  )
}
