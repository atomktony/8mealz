"use client"

import Image from "next/image"
import { Container } from "../container"
import { useLang } from "@/lib/i18n"

const photos = [
  { src: "/images/market-1.png", alt: "Fresh produce and grain sacks at a Luanda market stall" },
  { src: "/images/market-2.png", alt: "A family receiving a box of fresh food at home" },
  { src: "/images/market-3.png", alt: "A smiling market vendor at her well-stocked stall" },
]

export function Photos() {
  const { t } = useLang()
  return (
    <section>
      <Container>
        <div className="py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl sm:text-4xl">{t.photos.title}</h2>
            <p className="mt-3 text-pretty text-muted-foreground">{t.photos.subtitle}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, i) => (
              <div
                key={photo.src}
                className={[
                  "relative aspect-4/3 overflow-hidden rounded-2xl border border-border",
                  i === 0 ? "sm:col-span-2 sm:aspect-video lg:col-span-1 lg:aspect-4/3" : "",
                ].join(" ")}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
