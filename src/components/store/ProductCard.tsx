import { Link } from "@tanstack/react-router";
import { brl, discountPct, finalPrice, img, installment, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ProductCard({ product: p, className }: { product: Product; className?: string }) {
  const off = discountPct(p);
  const second = p.images[1];
  return (
    <Link to="/produto/$slug" params={{ slug: p.slug }} className={cn("group block", className)}>
      <div className="relative aspect-square overflow-hidden bg-tile">
        <img
          src={img(p.images[0]!, 640)}
          alt={`Tênis Tesla ${p.name}`}
          loading="lazy"
          className={cn("shot absolute inset-0 h-full w-full object-contain p-4 transition duration-500", second && "group-hover:opacity-0")}
        />
        {second && (
          <img
            src={img(second, 640)}
            alt=""
            loading="lazy"
            className="shot absolute inset-0 h-full w-full scale-105 object-contain p-4 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <span className="bg-acid px-2 py-1 text-[11px] font-extrabold uppercase text-ink">-{off}%</span>}
          {p.isNew && <span className="bg-ink px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Novo</span>}
        </div>
      </div>
      <div className="pt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-volt">{p.line}</p>
        <h3 className="mt-0.5 text-[15px] font-semibold leading-snug">{p.name}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[15px] font-bold">{brl(finalPrice(p))}</span>
          {p.promo && <span className="text-[13px] text-ink/45 line-through">{brl(p.price)}</span>}
        </div>
        <p className="text-[12px] text-ink/55">6x de {brl(installment(finalPrice(p)))} sem juros</p>
      </div>
    </Link>
  );
}
