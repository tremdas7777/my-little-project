import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CreditCard, RefreshCw, Ruler, ShieldCheck } from "lucide-react";
import { brl, discountPct, finalPrice, getProduct, img, LINES, PRODUCTS } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

const HERO = ["tenis-tesla-hertz-art-purple", "tenis-tesla-flow-all-black-reflect", "tenis-tesla-coil-black-reflect"]
  .map((s) => getProduct(s))
  .filter((p) => !!p);
const promos = PRODUCTS.filter((p) => p.promo).sort((a, b) => discountPct(b) - discountPct(a));
const maxOff = Math.max(...promos.map(discountPct));
const best = PRODUCTS.filter((p) => p.bestSeller && !p.promo).slice(0, 8);
const fresh = PRODUCTS.filter((p) => p.isNew);

function Home() {
  return (
    <StoreLayout>
      <Hero />
      <Promotions />
      <Lines />
      <Section eyebrow="Os mais pedidos" title="Best sellers" link={{ label: "Ver todos", search: {} }}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {best.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>
      <Story />
      <Section eyebrow="Acabou de chegar" title="Lançamentos" link={{ label: "Ver lançamentos", search: { filtro: "novos" } }}>
        <Rail>
          {fresh.map((p) => (
            <ProductCard key={p.slug} product={p} className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-[23%]" />
          ))}
        </Rail>
      </Section>
      <Perks />
    </StoreLayout>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO.length), 5000);
    return () => clearInterval(t);
  }, []);
  const p = HERO[i]!;

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col justify-center px-4 pb-10 pt-12 md:px-8 lg:py-24">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-acid">Coleção 2026 · Skate & lifestyle</p>
          <h1 className="font-display mt-5 text-[clamp(64px,11vw,148px)]">
            Feito
            <br />
            pra <span className="text-volt">andar.</span>
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/70 md:text-[17px]">
            Tênis de skate com sola vulcanizada, costura reforçada e conforto pra sessão inteira. Hertz, Coil e Flow — escolhe o
            teu.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/produtos"
              search={{ filtro: "novos" }}
              className="inline-flex items-center gap-2 bg-acid px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink transition hover:bg-tile"
            >
              Ver lançamentos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/produtos"
              search={{ filtro: "promo" }}
              className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:border-white"
            >
              Promoções
            </Link>
          </div>
        </div>

        <Link to="/produto/$slug" params={{ slug: p.slug }} className="group relative block overflow-hidden bg-tile text-ink">
          <div className="relative aspect-square lg:aspect-auto lg:h-full">
            {HERO.map((h, idx) => (
              <img
                key={h!.slug}
                src={img(h!.images[0]!, 1000)}
                alt={`Tênis Tesla ${h!.name}`}
                className={cn(
                  "shot absolute inset-0 h-full w-full object-contain p-8 transition-all duration-700 md:p-14",
                  idx === i ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                )}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-volt">{p.line}</p>
              <p className="font-display mt-1 text-[28px] md:text-[34px]">{p.name}</p>
              <p className="mt-1 text-[14px] font-semibold">{brl(finalPrice(p))}</p>
            </div>
            <div className="flex gap-1.5 pb-2">
              {HERO.map((h, idx) => (
                <button
                  key={h!.slug}
                  aria-label={`Mostrar ${h!.name}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setI(idx);
                  }}
                  className={cn("h-1 transition-all", idx === i ? "w-8 bg-ink" : "w-4 bg-ink/20")}
                />
              ))}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function Promotions() {
  return (
    <section className="bg-acid">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.22em] text-ink/70">Promoções</p>
            <h2 className="font-display mt-3 text-[clamp(56px,9vw,120px)] text-ink">
              Até {maxOff}% off
            </h2>
            <p className="mt-3 max-w-md text-[15px] text-ink/75">
              Modelos selecionados com preço de outlet. Enquanto durarem os tamanhos.
            </p>
          </div>
          <Link
            to="/produtos"
            search={{ filtro: "promo" }}
            className="inline-flex w-fit items-center gap-2 bg-ink px-7 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-volt"
          >
            Ver todas as promoções <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Rail className="mt-10" dark>
          {promos.map((p) => (
            <ProductCard key={p.slug} product={p} className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-[23%]" />
          ))}
        </Rail>
      </div>
    </section>
  );
}

function Lines() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-8 md:pt-28">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-[clamp(44px,6vw,80px)]">Escolha a linha</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {LINES.map((l, idx) => {
          const from = Math.min(...PRODUCTS.filter((p) => p.line === l.id).map(finalPrice));
          return (
            <Link key={l.id} to="/produtos" search={{ linha: l.id }} className="group relative flex flex-col overflow-hidden bg-tile">
              <div className="flex items-start justify-between p-6">
                <span className="text-[13px] font-bold text-ink/40">0{idx + 1}</span>
                <span className="text-[12px] font-semibold text-ink/60">a partir de {brl(from)}</span>
              </div>
              <img
                src={img(l.hero, 800)}
                alt={`Linha ${l.name}`}
                loading="lazy"
                className="shot mx-auto aspect-[16/9] w-full object-contain px-6 md:aspect-[4/3] transition duration-500 group-hover:-translate-y-2 group-hover:-rotate-2"
              />
              <div className="mt-auto flex items-end justify-between gap-4 border-t border-line p-6">
                <div>
                  <p className="font-display text-[48px] leading-none">{l.name}</p>
                  <p className="mt-2 max-w-[28ch] text-[14px] text-ink/65">{l.tagline}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-white transition group-hover:bg-volt">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Story() {
  const pair = getProduct("tenis-tesla-hertz-black");
  return (
    <section className="mx-auto mt-24 grid max-w-[1400px] md:mt-32 md:grid-cols-2">
      <div className="bg-tile">
        {pair && (
          <img src={img(pair.images[1]!, 1000)} alt="Par de tênis Tesla Hertz Black" loading="lazy" className="shot aspect-square w-full object-contain p-8" />
        )}
      </div>
      <div className="flex flex-col justify-center bg-ink px-6 py-14 text-white md:px-14">
        <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-acid">A Tesla Footwear</p>
        <h2 className="font-display mt-4 text-[clamp(44px,5.5vw,76px)]">Do skatista pro skatista.</h2>
        <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/70">
          Uma das marcas mais comentadas por quem anda de skate. Cada par é pensado pras reais necessidades de quem anda:
          resistência na lixa, aderência na sola e conforto do primeiro ao último drop.
        </p>
        <Link
          to="/produtos"
          className="mt-9 inline-flex w-fit items-center gap-2 border-b-2 border-acid pb-1 text-[13px] font-bold uppercase tracking-[0.14em]"
        >
          Conhecer os tênis <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Perks() {
  const items = [
    { Icon: CreditCard, t: "6x sem juros", s: "No cartão, em todo o site" },
    { Icon: RefreshCw, t: "Troca grátis", s: "Até 7 dias após o recebimento" },
    { Icon: ShieldCheck, t: "Compra segura", s: "Site criptografado" },
    { Icon: Ruler, t: "Guia de tamanhos", s: "Nossa numeração é menor" },
  ];
  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-4 md:px-8">
      <div className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {items.map(({ Icon, t, s }, idx) => (
          <div key={t} className={cn("flex items-start gap-3 py-7 pr-4", idx % 2 === 1 && "pl-4 md:pl-6", idx >= 2 && "border-t border-line md:border-t-0", idx > 0 && "md:border-l md:border-line md:pl-6")}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-volt" />
            <div>
              <p className="text-[14px] font-bold">{t}</p>
              <p className="text-[12px] text-ink/55">{s}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Section({
  eyebrow,
  title,
  link,
  children,
}: {
  eyebrow: string;
  title: string;
  link: { label: string; search: { filtro?: "novos" | "promo" } };
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-8 md:pt-28">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-volt">{eyebrow}</p>
          <h2 className="font-display mt-2 text-[clamp(44px,6vw,80px)]">{title}</h2>
        </div>
        <Link
          to="/produtos"
          search={link.search}
          className="hidden shrink-0 items-center gap-2 border-b-2 border-ink pb-1 text-[12px] font-bold uppercase tracking-[0.14em] sm:inline-flex"
        >
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function Rail({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: 1 | -1) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.75, behavior: "smooth" });
  return (
    <div className={className}>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:gap-6 md:px-0">
        {children}
      </div>
      <div className="mt-6 hidden justify-end gap-2 md:flex">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            aria-label={d < 0 ? "Anterior" : "Próximo"}
            onClick={() => go(d)}
            className={cn(
              "flex h-11 w-11 items-center justify-center border transition",
              dark ? "border-ink/30 hover:bg-ink hover:text-white" : "border-line hover:bg-ink hover:text-white",
            )}
          >
            {d < 0 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}
