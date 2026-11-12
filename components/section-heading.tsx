"use client"

import { useEffect, useRef, type ReactNode } from "react"

/**
 * Section heading: 44px desktop / 30px mobile, weight 800, with a fade-up
 * when it scrolls into view. Server HTML is visible; only headings still
 * below the fold are hidden on mount, so nothing stays invisible without JS.
 */
export function SectionHeading({
  children,
  id,
  align = "left",
  tone = "text-foreground",
  className,
  as: Tag = "h2",
}: {
  children: ReactNode
  id?: string
  align?: "left" | "center"
  /** Text color class. Defaults to text-primary (#1c2a28); pass a light class on dark bands. */
  tone?: string
  className?: string
  as?: "h1" | "h2"
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.classList.add("reveal-pending")
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("reveal-in")
          el.classList.remove("reveal-pending")
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      id={id}
      className={[
        "text-balance text-[30px] font-800 leading-[1.1] tracking-[-0.02em] lg:text-[44px]",
        tone,
        align === "center" ? "text-center" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  )
}
