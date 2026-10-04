import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Menu, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl, finalPrice, img } from "@/lib/catalog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const LOGO = "https://cdn.dooca.store/153486/files/logotesla2.png?v=1741869446";

const NAV = [
  { label: "Lançamentos", search: { filtro: "novos" as const } },
  { label: "Promoções", search: { filtro: "promo" as const } },
  { label: "Hertz", search: { linha: "hertz" as const } },
  { label: "Coil", search: { linha: "coil" as const } },
  { label: "Flow", search: { linha: "flow" as const } },
];

function Marquee() {
  const items = ["6x sem juros", "Troca grátis em até 7 dias", "Compra 100% segura", "Feito pra andar de skate"];
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-b border-white/10 bg-ink py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80">
      <div className="flex w-max animate-[tesla-marquee_45s_linear_infinite] gap-10">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t} <span className="h-1 w-1 rounded-full bg-acid" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Header() {
  const cart = useCart();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSearch(false);
    navigate({ to: "/produtos", search: { q: q.trim() || undefined } });
  };

  return (
    <header className={cn("sticky top-0 z-40 bg-ink text-white transition-shadow", scrolled && "shadow-[0_1px_0_rgba(255,255,255,0.08)]")}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 md:h-[72px] md:px-8">
        <button className="-ml-1 p-1 md:hidden" aria-label="Abrir menu" onClick={() => setMenu(true)}>
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" aria-label="Tesla Skate — início" className="shrink-0">
          <img src={LOGO} alt="Tesla" className="h-6 w-auto md:h-7" />
        </Link>
        <nav className="ml-6 hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to="/produtos"
              search={n.search}
              className={cn(
                "text-[13px] font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:text-white",
                n.label === "Promoções" && "text-acid hover:text-acid",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5">
          <button aria-label="Buscar" onClick={() => setSearch((v) => !v)} className="p-1">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Abrir sacola" onClick={() => cart.setOpen(true)} className="relative p-1">
            <ShoppingBag className="h-5 w-5" />
            {cart.count > 0 && (
              <span className="absolute -right-1.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-acid px-1 text-[10px] font-bold text-ink">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {search && (
        <form onSubmit={submit} className="border-t border-white/10 px-4 py-3 md:px-8">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3">
            <Search className="h-4 w-4 text-white/50" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar modelo ou cor — ex.: Hertz, purple, reflect"
              className="h-10 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40 md:text-sm"
            />
          </div>
        </form>
      )}

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-[86%] max-w-sm border-0 bg-ink p-0 text-white [&>button]:text-white">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="p-6">
            <img src={LOGO} alt="Tesla" className="h-6 w-auto" />
          </div>
          <nav className="flex flex-col border-t border-white/10">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to="/produtos"
                search={n.search}
                onClick={() => setMenu(false)}
                className="flex items-center justify-between border-b border-white/10 px-6 py-5 font-display text-[28px]"
              >
                <span className={n.label === "Promoções" ? "text-acid" : ""}>{n.label}</span>
                <ArrowRight className="h-5 w-5 text-white/40" />
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function CartDrawer() {
  const cart = useCart();
  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[420px]">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <SheetTitle className="font-display text-[26px]">Sacola ({cart.count})</SheetTitle>
        </div>
        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
            <p className="font-display text-[32px] leading-none">Sua sacola tá vazia</p>
            <p className="text-sm text-ink/60">Escolhe um par e volta aqui.</p>
            <Link
              to="/produtos"
              onClick={() => cart.setOpen(false)}
              className="bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white"
            >
              Ver tênis
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {cart.lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-5">
                  <div className="h-24 w-24 shrink-0 bg-tile">
                    <img src={img(l.product.images[0]!, 240)} alt="" className="shot h-full w-full object-contain" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[14px] font-semibold leading-tight">Tênis Tesla {l.product.name}</p>
                    <p className="mt-1 text-[12px] text-ink/55">Tamanho {l.size}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line">
                        <button aria-label="Diminuir" className="p-2" onClick={() => cart.setQty(l.key, l.qty - 1)}>
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-[13px] font-semibold">{l.qty}</span>
                        <button aria-label="Aumentar" className="p-2" onClick={() => cart.setQty(l.key, l.qty + 1)}>
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[14px] font-bold">{brl(finalPrice(l.product) * l.qty)}</p>
                    </div>
                  </div>
                  <button aria-label="Remover" onClick={() => cart.remove(l.key)} className="self-start p-1 text-ink/40 hover:text-ink">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/60">Subtotal</span>
                <span className="text-[20px] font-bold">{brl(cart.subtotal)}</span>
              </div>
              <p className="mt-1 text-right text-[12px] text-ink/55">ou 6x de {brl(cart.subtotal / 6)} sem juros</p>
              <Link
                to="/checkout"
                onClick={() => cart.setOpen(false)}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-ink py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-white hover:bg-volt"
              >
                Finalizar compra <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 pt-16 md:px-8">
        <p className="font-display text-[clamp(56px,13vw,200px)] leading-[0.85] text-white">
          Tesla<span className="text-volt">.</span>
        </p>
        <div className="mt-12 grid gap-10 border-t border-white/10 py-12 text-[14px] text-white/70 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white">Comprar</p>
            <ul className="space-y-2">
              <li><Link to="/produtos" search={{ filtro: "novos" }} className="hover:text-white">Lançamentos</Link></li>
              <li><Link to="/produtos" search={{ filtro: "promo" }} className="hover:text-white">Promoções</Link></li>
              <li><Link to="/produtos" className="hover:text-white">Todos os tênis</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white">Linhas</p>
            <ul className="space-y-2">
              <li><Link to="/produtos" search={{ linha: "hertz" }} className="hover:text-white">Hertz</Link></li>
              <li><Link to="/produtos" search={{ linha: "coil" }} className="hover:text-white">Coil</Link></li>
              <li><Link to="/produtos" search={{ linha: "flow" }} className="hover:text-white">Flow</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white">Ajuda</p>
            <ul className="space-y-2">
              <li>Troca grátis em até 7 dias</li>
              <li>Parcelamento em até 6x sem juros</li>
              <li>Numeração menor que a tradicional</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white">Tesla Skate</p>
            <p>Tênis feitos pra andar de skate. Compra 100% segura, troca grátis em até 7 dias e parcelamento em até 6x sem juros.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Marquee />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
