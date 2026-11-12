import { formatEurApprox, formatUsd } from "@/lib/pricing"

/** Renders "$58 / ~€53". The euro part is muted and scales with the parent font size. */
export function Price({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={["whitespace-nowrap", className].filter(Boolean).join(" ")}>
      {formatUsd(amount)}
      <span className="ml-1 font-sans text-[0.6em] font-500 text-muted-foreground">/ {formatEurApprox(amount)}</span>
    </span>
  )
}
