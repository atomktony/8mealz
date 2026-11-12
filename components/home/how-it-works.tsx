"use client"

import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { Blobs } from "./blobs"
import { useLang } from "@/lib/i18n"
import { kriol } from "@/lib/dictionary"

function CurlyArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 26C18 26 24 9 37 11C50 13 45 32 34 28C23 24 40 13 60 18C78 22 93 22 108 20" />
      <path d="M100 13L109 20L100 27" />
    </svg>
  )
}

export function HowItWorks() {
  const { t } = useLang()
  const words = t.how.title.split(" ")
  const lastStep = t.how.steps.length - 1

  return (
    <section id="how" aria-labelledby="how-title" className="relative isolate scroll-mt-20 overflow-hidden">
      <Blobs />
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="how-title" align="center">
            <span className="block">{words.slice(0, -1).join(" ")}</span>
            <span className="block">{words[words.length - 1]}</span>
          </SectionHeading>
          <p lang="kea" className="mx-auto mt-5 max-w-[640px] text-pretty text-center text-[17px] italic leading-relaxed text-teal-700">
            {kriol.how}
          </p>

          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-16">
            {t.how.steps.map((step, i) => (
              <li key={step.title}>
                <div className="flex h-10 items-center gap-6">
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-950 font-heading text-sm font-800 text-surface",
                      i === lastStep ? "ring-4 ring-crimson-200" : "",
                    ].join(" ")}
                  >
                    {i + 1}
                  </span>
                  {i < lastStep && <CurlyArrow className="hidden h-10 w-[120px] text-foreground md:block" />}
                </div>
                <h3 className="mt-5 font-heading text-lg font-800 text-foreground lg:text-xl">{step.title}</h3>
                <p className="mt-2 max-w-[320px] text-pretty text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
