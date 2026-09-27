export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="h-display text-3xl text-brand-deep">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {updated} · Draft for legal review</p>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-deep [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}
