"use client"

import Image from "next/image"
import { Container } from "../container"
import { SectionHeading } from "../section-heading"
import { useLang } from "@/lib/i18n"

const photos = ["/images/market-1.png", "/images/market-2.png", "/images/market-3.png"]

export function Photos() {
  const { t } = useLang()
  return (
    <section aria-labelledby="photos-title">
      <Container>
        <div className="py-16 lg:py-24">
          <SectionHeading id="photos-title">{t.photos.title}</SectionHeading>
          <p className="mt-4 max-w-[540px] text-pretty text-[17px] leading-relaxed text-muted-foreground">
            {t.photos.subtitle}
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:items-center lg:gap-6">
            {photos.map((src, i) => (
              <figure
                key={src}
                className={[
                  "relative overflow-hidden rounded-2xl",
                  i === 1 ? "aspect-4/3 sm:aspect-[3/4]" : "aspect-4/3 sm:aspect-4/5",
                ].join(" ")}
              >
                <Image
                  src={src}
                  alt={t.media.photoAlts[i]}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  quality={75}
                  className="object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-surface px-3 py-1 text-xs font-600 text-foreground shadow-sm">
                  {t.home.photoCaptions[i]}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
