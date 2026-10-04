import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, CreditCard, RefreshCw, Ruler, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl, discountPct, finalPrice, getProduct, img, installment, LINES, PRODUCTS } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `Tênis Tesla ${loaderData.product.name} · proposta` }] : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const cart = useCart();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [warn, setWarn] = useState(false);
  const line = LINES.find((l) => l.id === p.line);
  const off = discountPct(p);
  const price = finalPrice(p);
  const related = PRODUCTS.filter((x) => x.line === p.line && x.slug !== p.slug).slice(0, 4);

  const add = () => {
    if (size == null) {
      setWarn(true);
      document.getElementById("tamanhos")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    cart.add(p.slug, size);
  };

  return (
    <StoreLayout>
      <div className="mx-auto max-w-[1400px] md:px-8 md:pt-8">
        <nav className="hidden text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/50 md:block">
          <Link to="/" className="hover:text-ink">Início</Link> /{" "}
          <Link to="/produtos" search={{ linha: p.line }} className="hover:text-ink">{line?.name}</Link> /{" "}
          <span className="text-ink">{p.name}</span>
        </nav>

        <div className="grid gap-8 md:mt-6 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          {/* Galeria: deslizar no celular, miniaturas no computador */}
          <div className="md:flex md:gap-4">
            <div className="hidden w-20 shrink-0 flex-col gap-3 md:flex">
              {p.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={cn("aspect-square bg-tile p-1 ring-1 transition", i === active ? "ring-ink" : "ring-line hover:ring-ink/40")}
                >
                  <img src={img(src, 160)} alt="" className="shot h-full w-full object-contain" />
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <div
                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto bg-tile md:block md:overflow-visible"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  setActive(Math.round(el.scrollLeft / el.clientWidth));
                }}
              >
                {p.images.map((src, i) => (
                  <img
                    key={src}
                    src={img(src, 1000)}
                    alt={`Tênis Tesla ${p.name} — foto ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className={cn("shot aspect-square w-full shrink-0 snap-center object-contain p-6 md:p-10", i !== active && "md:hidden")}
                  />
                ))}
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                {p.images.map((src, i) => (
                  <span key={src} className={cn("h-1 transition-all", i === active ? "w-6 bg-ink" : "w-2 bg-ink/25")} />
                ))}
              </div>
              {off > 0 && <span className="absolute left-4 top-4 bg-acid px-2.5 py-1 text-[12px] font-extrabold text-ink">-{off}%</span>}
            </div>
          </div>

          {/* Informações e compra */}
          <div className="px-4 pb-28 md:px-0 lg:sticky lg:top-28 lg:self-start lg:pb-0">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-volt">Linha {line?.name}{p.isNew ? " · Lançamento" : ""}</p>
            <h1 className="font-display mt-3 text-[clamp(44px,5vw,68px)]">{p.name}</h1>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-[28px] font-extrabold">{brl(price)}</span>
              {p.promo && <span className="text-[16px] text-ink/45 line-through">{brl(p.price)}</span>}
            </div>
            <p className="text-[14px] text-ink/60">ou 6x de {brl(installment(price))} sem juros</p>

            <div id="tamanhos" className="mt-8">
              <div className="flex items-center justify-between">
                <p className={cn("text-[13px] font-bold uppercase tracking-[0.12em]", warn && size == null && "text-red-600")}>
                  {warn && size == null ? "Escolha o tamanho" : size ? `Tamanho: ${size}` : "Tamanho"}
                </p>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink/60">
                  <Ruler className="h-4 w-4" /> Numeração menor que a tradicional
                </span>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {[34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44].map((s) => {
                  const ok = p.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      disabled={!ok}
                      onClick={() => {
                        setSize(s);
                        setWarn(false);
                      }}
                      className={cn(
                        "h-12 border text-[14px] font-semibold transition",
                        size === s ? "border-ink bg-ink text-white" : "border-line bg-tile hover:border-ink",
                        !ok && "cursor-not-allowed text-ink/25 line-through hover:border-line",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] text-ink/55">Dica: se estiver entre dois tamanhos, escolha o maior.</p>
            </div>

            <button
              onClick={add}
              className="mt-8 hidden w-full bg-ink py-5 text-[14px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-volt md:block"
            >
              Adicionar à sacola
            </button>

            <div className="mt-8 divide-y divide-line border-y border-line">
              {[
                { Icon: CreditCard, t: "6x sem juros no cartão" },
                { Icon: RefreshCw, t: "Troca grátis em até 7 dias após o recebimento" },
                { Icon: ShieldCheck, t: "Compra segura, site criptografado" },
              ].map(({ Icon, t }) => (
                <p key={t} className="flex items-center gap-3 py-3.5 text-[14px]">
                  <Icon className="h-5 w-5 text-volt" /> {t}
                </p>
              ))}
            </div>

            <details className="group mt-2 border-b border-line py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-bold uppercase tracking-[0.12em]">
                Sobre o modelo <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
                {line?.tagline} Construção pensada pra aguentar a lixa e o dia a dia, com palmilha confortável e acabamento
                Tesla.
              </p>
            </details>
          </div>
        </div>

        {related.length > 0 && (
          <section className="px-4 pt-20 md:px-0">
            <h2 className="font-display mb-8 text-[clamp(40px,5vw,64px)]">Da mesma linha</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra de compra fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">{p.name}</p>
          <p className="text-[15px] font-extrabold">{brl(price)}</p>
        </div>
        <button onClick={add} className="bg-ink px-6 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-white">
          {size ? `Adicionar · ${size}` : "Escolher tamanho"}
        </button>
      </div>
    </StoreLayout>
  );
}
