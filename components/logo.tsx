import Link from "next/link"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={["group inline-flex items-center gap-2", className].filter(Boolean).join(" ")}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-heading text-lg font-700 text-primary-foreground">
        8
      </span>
      <span className="font-heading text-xl font-700 tracking-tight text-foreground">
        Mealz
      </span>
    </Link>
  )
}
