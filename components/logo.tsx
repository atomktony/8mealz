import Link from "next/link"
import Image from "next/image"

// Header 36px tall, footer 32px. Width follows the SVG's 377x215 ratio.
const heights = { header: "h-9", footer: "h-8" } as const

export function Logo({ size = "header", className }: { size?: keyof typeof heights; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="8Mealz home"
      className={["inline-flex items-center", className].filter(Boolean).join(" ")}
    >
      <Image
        src="/images/logo.svg"
        alt="8Mealz"
        width={377}
        height={215}
        unoptimized
        className={[heights[size], "w-auto"].join(" ")}
      />
    </Link>
  )
}
