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
        width={660}
        height={360}
        priority
        className="h-9 w-auto"
      />
    </Link>
  )
}
