import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MoreThanMoney } from "@/components/home/MoreThanMoney";
import { Packages } from "@/components/home/Packages";
import { Pricing } from "@/components/home/Pricing";
import { PhotoStrip } from "@/components/home/PhotoStrip";
import { SignupSection } from "@/components/home/SignupSection";
import { CountryVote } from "@/components/home/CountryVote";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <MoreThanMoney />
      <Packages />
      <Pricing />
      <PhotoStrip />
      <SignupSection />
      <CountryVote />
      <FinalCta />
    </>
  );
}
