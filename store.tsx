"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findExtra } from "./data";

export interface CartLine {
  id: string;
  qty: number;
}

interface StoreCtx {
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addExtra: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  pilotOpen: boolean;
  setPilotOpen: (v: boolean) => void;
}

const Ctx = createContext<StoreCtx | null>(null);
const KEY = "8mealz-cart-v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [pilotOpen, setPilotOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        setCart(parsed.filter((l) => findExtra(l.id) && l.qty > 0));
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, loaded]);

  const addExtra = useCallback((id: string) => {
    setCart((c) => {
      const ex = c.find((l) => l.id === id);
      return ex ? c.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + 1, 20) } : l)) : [...c, { id, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 20) } : l))));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(() => {
    const cartCount = cart.reduce((s, l) => s + l.qty, 0);
    const cartSubtotal = cart.reduce((s, l) => s + (findExtra(l.id)?.price ?? 0) * l.qty, 0);
    return { cart, cartCount, cartSubtotal, addExtra, setQty, clearCart, cartOpen, setCartOpen, pilotOpen, setPilotOpen };
  }, [cart, addExtra, setQty, clearCart, cartOpen, pilotOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}
