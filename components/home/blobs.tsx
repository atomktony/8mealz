// Soft corner glows from the reference: gold bottom-left, teal top-right.
// A closest-side radial gradient already fades to transparent; adding a CSS
// blur filter on top rendered as visible concentric rings, so there is none.
// The parent section needs `relative isolate overflow-hidden`.
export function Blobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -bottom-56 -left-56 h-[560px] w-[560px] bg-[radial-gradient(closest-side,var(--color-gold-100),transparent)] opacity-70 lg:h-[720px] lg:w-[720px]" />
      <div className="absolute -right-56 -top-56 h-[560px] w-[560px] bg-[radial-gradient(closest-side,var(--color-teal-100),transparent)] opacity-70 lg:h-[720px] lg:w-[720px]" />
    </div>
  )
}
