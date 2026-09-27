"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { findExtra } from "@/lib/data";
import { formatMoney } from "@/lib/pricing";
import { ExtraIcon } from "./ExtraIcon";

export function CartDrawer() {
  const { t, lang } = useLang();
  const { cart, cartOpen, setCartOpen, setQty, cartSubtotal } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.cart.title}>
      <div className="absolute inset-0 bg-brand-ink/50" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="h-display text-lg text-brand-deep">{t.cart.title}</h2>
          <button onClick={() => setCartOpen(false)} className="rounded-full p-2 hover:bg-brand-cream" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">{t.cart.empty}</p>
          ) : (
            <ul className="space-y-3">
              {cart.map((l) => {
                const e = findExtra(l.id)!;
                return (
                  <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-brand-teal-dark">
                      <ExtraIcon icon={e.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-brand-deep">{e.name[lang]}</p>
                      <p className="text-xs text-slate-500">
                        {e.unit[lang]} · {formatMoney(e.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setQty(l.id, l.qty - 1)} className="rounded-full p-1.5 hover:bg-brand-cream" aria-label="-1">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} className="rounded-full p-1.5 hover:bg-brand-cream" aria-label="+1">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setQty(l.id, 0)} className="ml-1 rounded-full p-1.5 text-brand-red hover:bg-red-50" aria-label={t.cart.remove}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-5">
          <div className="mb-3 flex justify-between text-sm">
            <span>{t.cart.subtotal}</span>
            <span className="font-bold text-brand-deep">{formatMoney(cartSubtotal)}</span>
          </div>
          <Link href="/send" onClick={() => setCartOpen(false)} className="btn-red w-full">
            {t.cart.continue}
          </Link>
          <p className="mt-3 text-center text-xs text-slate-500">{t.cart.note}</p>
        </div>
      </aside>
    </div>
  );
}
