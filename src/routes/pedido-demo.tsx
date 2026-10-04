import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { brl } from "@/lib/catalog";
import { StoreLayout } from "@/components/store/Layout";

export const Route = createFileRoute("/pedido-demo")({
  head: () => ({ meta: [{ title: "Pedido de demonstração" }] }),
  component: DemoOrder,
});

type Summary = { items: { name: string; size: number; qty: number }[]; total: number; pay: "pix" | "card" };

function DemoOrder() {
  const [s, setS] = useState<Summary | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tesla-demo-order");
      if (raw) setS(JSON.parse(raw));
    } catch {
      // armazenamento indisponível
    }
  }, []);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center bg-acid">
          <Check className="h-8 w-8" strokeWidth={3} />
        </span>
        <h1 className="font-display mt-6 text-[clamp(48px,8vw,80px)]">Pedido recebido</h1>
        <p className="mt-3 text-[15px] text-ink/65">
          Assim fica a tela de confirmação. Como esta é uma <b>demonstração</b>, nenhum pagamento foi gerado e nenhum dado foi
          enviado.
        </p>
        {s && (
          <div className="mt-10 bg-white p-6 text-left">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/55">Resumo</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {s.items.map((i) => (
                <li key={`${i.name}-${i.size}`} className="flex justify-between gap-3">
                  <span>
                    {i.qty}× {i.name} · tam. {i.size}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-line pt-4 text-[16px] font-extrabold">
              <span>Total ({s.pay === "pix" ? "Pix" : "cartão"})</span>
              <span>{brl(s.total)}</span>
            </p>
          </div>
        )}
        <Link to="/" className="mt-10 inline-block bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white">
          Voltar para a loja
        </Link>
      </div>
    </StoreLayout>
  );
}
