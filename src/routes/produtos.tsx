import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { discountPct, finalPrice, LINES, PRODUCTS } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  linha: z.enum(["hertz", "coil", "flow"]).optional(),
  filtro: z.enum(["novos", "promo"]).optional(),
  q: z.string().max(60).optional(),
});

export const Route = createFileRoute("/produtos")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Tênis · Tesla Skate (proposta)" }] }),
  component: Collection,
});

const SORTS = { destaque: "Destaques", menor: "Menor preço", maior: "Maior preço", desconto: "Maior desconto" } as const;
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Collection() {
  const { linha, filtro, q } = Route.useSearch();
  const [sort, setSort] = useState<keyof typeof SORTS>("destaque");

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => (!linha || p.line === linha) && (filtro !== "novos" || p.isNew) && (filtro !== "promo" || p.promo));
    if (q) {
      const terms = norm(q).split(/\s+/).filter(Boolean);
      l = l.filter((p) => terms.every((t) => norm(`${p.name} ${p.line}`).includes(t)));
    }
    if (sort === "menor") l = [...l].sort((a, b) => finalPrice(a) - finalPrice(b));
    if (sort === "maior") l = [...l].sort((a, b) => finalPrice(b) - finalPrice(a));
    if (sort === "desconto") l = [...l].sort((a, b) => discountPct(b) - discountPct(a));
    return l;
  }, [linha, filtro, q, sort]);

  const title = q
    ? `“${q}”`
    : filtro === "promo"
      ? "Promoções"
      : filtro === "novos"
        ? "Lançamentos"
        : linha
          ? `Linha ${LINES.find((l) => l.id === linha)?.name}`
          : "Todos os tênis";

  const chips: { label: string; search: z.infer<typeof searchSchema>; active: boolean }[] = [
    { label: "Todos", search: {}, active: !linha && !filtro },
    { label: "Promoções", search: { filtro: "promo" }, active: filtro === "promo" },
    { label: "Lançamentos", search: { filtro: "novos" }, active: filtro === "novos" },
    ...LINES.map((l) => ({ label: l.name, search: { linha: l.id }, active: linha === l.id && !filtro })),
  ];

  return (
    <StoreLayout>
      <div className={cn("border-b border-line", filtro === "promo" && "bg-acid")}>
        <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-12 md:px-8 md:pt-16">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-ink/55">{list.length} modelos</p>
          <h1 className="font-display mt-2 text-[clamp(52px,9vw,120px)]">{title}</h1>
        </div>
      </div>

      <div className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur md:top-[72px]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 md:px-8">
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            {chips.map((c) => (
              <Link
                key={c.label}
                to="/produtos"
                search={c.search}
                className={cn(
                  "shrink-0 border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition",
                  c.active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}
            aria-label="Ordenar"
            className="hidden border border-line bg-white px-3 py-2 text-[13px] font-semibold sm:block"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pt-8 md:px-8">
        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-[40px]">Nada por aqui</p>
            <Link to="/produtos" className="mt-4 inline-block border-b-2 border-ink pb-1 text-[13px] font-bold uppercase tracking-[0.14em]">
              Ver todos os tênis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
