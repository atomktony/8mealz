import Link from "next/link"
import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="8Mealz home"
      className={["inline-flex items-center", className].filter(Boolean).join(" ")}
    >
      <Image
        src="/images/logo.png"
        alt="8Mealz"
        width={120}
        height={40}
        sizes="120px"
        quality={75}
        className="h-10 w-auto object-contain object-left"
      />
    </Link>
  )
}
