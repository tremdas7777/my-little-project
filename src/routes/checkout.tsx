import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { ArrowLeft, Check, CreditCard, Lock, QrCode } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl, finalPrice, img } from "@/lib/catalog";
import { LOGO } from "@/components/store/Layout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · demonstração" }] }),
  component: Checkout,
});

const digits = (v: string) => v.replace(/\D/g, "");
const maskCep = (v: string) => digits(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
const maskPhone = (v: string) => digits(v).slice(0, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");

/**
 * Checkout de DEMONSTRAÇÃO: nada do formulário é enviado a servidor algum e nenhum pagamento é gerado.
 * Na versão final, este passo liga ao meio de pagamento da Tesla.
 */
function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", cep: "", rua: "", numero: "", bairro: "", cidade: "", uf: "" });
  const [pay, setPay] = useState<"pix" | "card">("pix");

  useEffect(() => {
    const c = digits(f.cep);
    if (c.length !== 8) return;
    let alive = true;
    fetch(`https://viacep.com.br/ws/${c}/json/`)
      .then((r) => r.json())
      .then((j) => {
        if (alive && !j.erro) setF((v) => ({ ...v, rua: v.rua || j.logradouro, bairro: v.bairro || j.bairro, cidade: j.localidade, uf: j.uf }));
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [f.cep]);

  const pixTotal = cart.subtotal * 0.95;
  const total = pay === "pix" ? pixTotal : cart.subtotal;
  const valid = f.name.trim().length > 3 && /\S+@\S+\.\S+/.test(f.email) && digits(f.cep).length === 8 && f.rua && f.numero;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const summary = { items: cart.lines.map((l) => ({ name: l.product.name, size: l.size, qty: l.qty })), total, pay };
    try {
      sessionStorage.setItem("tesla-demo-order", JSON.stringify(summary));
    } catch {
      // armazenamento indisponível
    }
    cart.clear();
    navigate({ to: "/pedido-demo" });
  };

  if (cart.lines.length === 0) {
    return (
      <Shell>
        <div className="py-28 text-center">
          <p className="font-display text-[44px]">Sacola vazia</p>
          <Link to="/produtos" className="mt-6 inline-block bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white">
            Ver tênis
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <form onSubmit={submit} className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <Block n={1} title="Seus dados">
            <Field label="Nome completo" autoComplete="name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail" type="email" autoComplete="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
              <Field label="Celular" inputMode="tel" value={f.phone} onChange={(v) => setF({ ...f, phone: maskPhone(v) })} />
            </div>
          </Block>
          <Block n={2} title="Entrega">
            <div className="grid grid-cols-[160px_1fr] items-end gap-4">
              <Field label="CEP" inputMode="numeric" value={f.cep} onChange={(v) => setF({ ...f, cep: maskCep(v) })} />
              <p className="pb-3.5 text-[13px] text-ink/55">{f.cidade && `${f.cidade}/${f.uf}`}</p>
            </div>
            <Field label="Endereço" value={f.rua} onChange={(v) => setF({ ...f, rua: v })} />
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <Field label="Número" value={f.numero} onChange={(v) => setF({ ...f, numero: v })} />
              <Field label="Bairro" value={f.bairro} onChange={(v) => setF({ ...f, bairro: v })} />
            </div>
          </Block>
          <Block n={3} title="Pagamento">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "pix" as const, Icon: QrCode, t: "Pix", s: "5% de desconto (exemplo)" },
                { id: "card" as const, Icon: CreditCard, t: "Cartão de crédito", s: "Até 6x sem juros" },
              ].map(({ id, Icon, t, s }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setPay(id)}
                  className={cn("flex items-center gap-3 border p-4 text-left transition", pay === id ? "border-ink bg-white" : "border-line bg-white/60 hover:border-ink/50")}
                >
                  <Icon className="h-6 w-6 text-volt" />
                  <span className="flex-1">
                    <span className="block text-[14px] font-bold">{t}</span>
                    <span className="text-[12px] text-ink/55">{s}</span>
                  </span>
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border", pay === id ? "border-ink bg-ink text-white" : "border-line")}>
                    {pay === id && <Check className="h-3 w-3" />}
                  </span>
                </button>
              ))}
            </div>
            <p className="bg-volt/10 px-4 py-3 text-[13px] text-ink/75">
              <b>Demonstração:</b> nenhum pagamento é gerado e os dados digitados não são enviados.
            </p>
          </Block>
        </div>

        <aside className="h-fit bg-white p-6 lg:sticky lg:top-24">
          <p className="font-display text-[30px]">Resumo</p>
          <ul className="mt-5 space-y-4">
            {cart.lines.map((l) => (
              <li key={l.key} className="flex gap-3">
                <div className="h-16 w-16 shrink-0 bg-paper">
                  <img src={img(l.product.images[0]!, 200)} alt="" className="shot h-full w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-tight">{l.product.name}</p>
                  <p className="text-[12px] text-ink/55">Tam. {l.size} · {l.qty}x</p>
                </div>
                <p className="text-[13px] font-bold">{brl(finalPrice(l.product) * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t border-line pt-4 text-[14px]">
            <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{brl(cart.subtotal)}</span></div>
            {pay === "pix" && (
              <div className="flex justify-between text-volt"><span>Desconto Pix</span><span>-{brl(cart.subtotal - pixTotal)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-ink/60">Frete</span><span>Calculado na versão final</span></div>
            <div className="flex justify-between pt-2 text-[18px] font-extrabold"><span>Total</span><span>{brl(total)}</span></div>
            {pay === "card" && <p className="text-right text-[12px] text-ink/55">6x de {brl(total / 6)} sem juros</p>}
          </div>
          <button
            type="submit"
            disabled={!valid}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-ink py-5 text-[13px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-volt disabled:opacity-40"
          >
            <Lock className="h-4 w-4" /> Finalizar pedido (demo)
          </button>
        </aside>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-volt px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
        Ambiente de demonstração · nenhum pagamento é processado
      </div>
      <header className="bg-ink">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-8">
          <Link to="/produtos" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Continuar comprando</span>
          </Link>
          <img src={LOGO} alt="Tesla" className="h-6" />
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white/70">
            <Lock className="h-4 w-4" /> <span className="hidden sm:inline">Seguro</span>
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center bg-ink text-[13px] font-bold text-white">{n}</span>
        <h2 className="font-display text-[30px]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, onChange, ...rest }: { label: string; onChange: (v: string) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.12em] text-ink/70">{label}</span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full border border-line bg-white px-4 text-base outline-none transition focus:border-ink md:text-[15px]"
      />
    </label>
  );
}
