import type { ComponentProps, ReactNode } from "react"

const inputBase =
  "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"

export function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-600 text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={[inputBase, className].filter(Boolean).join(" ")} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={[inputBase, "min-h-24 resize-y", className].filter(Boolean).join(" ")} {...props} />
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={[inputBase, "appearance-none", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </select>
  )
}

// Honeypot: visually hidden, off from tab order. Bots fill it; humans never see it.
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}
