import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Problem } from "@/components/home/problem"
import { HowItWorks } from "@/components/home/how-it-works"
import { ValueProps } from "@/components/home/value-props"
import { Packages } from "@/components/home/packages"
import { Extras } from "@/components/home/extras"
import { Pricing } from "@/components/home/pricing"
import { Photos } from "@/components/home/photos"
import { FounderNote } from "@/components/home/founder-note"
import { Faq } from "@/components/home/faq"
import { PilotSignup } from "@/components/home/pilot-signup"
import { CountryVote } from "@/components/home/country-vote"
import { FinalCta } from "@/components/home/final-cta"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Problem />
        <HowItWorks />
        <ValueProps />
        <Packages />
        <Extras />
        <Pricing />
        <Photos />
        <FounderNote />
        <Faq />
        <PilotSignup />
        <CountryVote />
        <FinalCta />
      </main>
      <Footer flush />
    </>
  )
}
