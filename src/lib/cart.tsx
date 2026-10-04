import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { finalPrice, getProduct, type Product } from "@/lib/catalog";

const KEY = "tesla-demo-cart";

export type CartLine = { key: string; product: Product; size: number; qty: number };

type Cart = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, size: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);

/** Carrinho no navegador: `{ "slug|tamanho": quantidade }`. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // armazenamento indisponível
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // armazenamento indisponível
    }
  }, [items, loaded]);

  const value = useMemo<Cart>(() => {
    const lines: CartLine[] = [];
    for (const [key, qty] of Object.entries(items)) {
      const [slug, size] = key.split("|");
      const product = getProduct(slug ?? "");
      if (product && qty > 0) lines.push({ key, product, size: Number(size), qty });
    }
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * finalPrice(l.product), 0),
      open,
      setOpen,
      add: (slug, size) => {
        const key = `${slug}|${size}`;
        setItems((it) => ({ ...it, [key]: (it[key] ?? 0) + 1 }));
        setOpen(true);
      },
      setQty: (key, qty) => setItems((it) => ({ ...it, [key]: Math.max(1, Math.min(10, qty)) })),
      remove: (key) =>
        setItems((it) => {
          const next = { ...it };
          delete next[key];
          return next;
        }),
      clear: () => setItems({}),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart fora do CartProvider");
  return c;
}
