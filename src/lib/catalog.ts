/**
 * Catálogo da loja Tesla Skate (outubro/2026).
 */

export type Line = "hertz" | "coil" | "flow";

export const LINES: { id: Line; name: string; tagline: string; hero: string }[] = [
  { id: "hertz", name: "Hertz", tagline: "O clássico de skate, perfil baixo e sola vulcanizada.", hero: "design-sem-nome-39-lprxg.png?v=1777918429" },
  { id: "coil", name: "Coil", tagline: "Cano acolchoado e estrutura reforçada pra sessão longa.", hero: "design-sem-nome-74-arzrb.png?v=1777926259" },
  { id: "flow", name: "Flow", tagline: "Silhueta chunky, conforto de sobra no rolê e na rua.", hero: "design-sem-nome-15-so29w.png?v=1785849820" },
];

export type Product = {
  slug: string;
  name: string;
  line: Line;
  price: number;
  /** Preço promocional, quando ativo. */
  promo?: number;
  images: string[];
  sizes: number[];
  bestSeller?: boolean;
  isNew?: boolean;
};

const ALL = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
const NO34 = ALL.slice(1);

type Row = [slug: string, name: string, price: number, images: string[], flags?: { promo?: number; best?: boolean; isNew?: boolean; sizes?: number[] }];

const ROWS: Row[] = [
  ["tenis-tesla-hertz-black-white-purple", "Hertz Black White Purple", 419.9, ["design-sem-nome-14-gibkf.png?v=1777576683", "604-tesla-1.jpg?v=1739279378", "605-tesla-1.jpg?v=1739279379", "617-tesla-1.jpg?v=1739279380", "623-tesla-1.jpg?v=1739279381"], { best: true }],
  ["tenis-tesla-coil-black-reflect", "Coil Black Reflect", 429.9, ["design-sem-nome-64-xitul.png?v=1777925615", "062-tesla.jpg?v=1717669529", "063-tesla.jpg?v=1717669531", "064-tesla.jpg?v=1717669531", "065-tesla.jpg?v=1717669532"], { best: true }],
  ["tenis-tesla-coil-all-black-reflect", "Coil All Black Reflect", 429.9, ["design-sem-nome-63-8zptl.png?v=1777925650", "108-tesla.jpg?v=1717669705", "107-tesla.jpg?v=1717669703", "109-tesla.jpg?v=1717669706", "110-tesla.jpg?v=1717669707"], { best: true, promo: 299.9 }],
  ["tenis-tesla-coil-black-purple", "Coil Black Purple", 429.9, ["design-sem-nome-74-arzrb.png?v=1777926259", "082-tesla.jpg?v=1717670167", "083-tesla.jpg?v=1717670168", "084-tesla.jpg?v=1717670169", "085-tesla.jpg?v=1717670170"], { best: true }],
  ["tenis-tesla-hertz-black", "Hertz Black", 379.9, ["design-sem-nome-54-xeyqw.png?v=1777920571", "093-tesla240320.jpg?v=1716048040", "094-tesla240320.jpg?v=1716048041", "095-tesla240320.jpg?v=1716048042", "096-tesla240320.jpg?v=1716048042"], { best: true }],
  ["tenis-tesla-hertz-art-purple", "Hertz Purple Art", 439.9, ["2-kvnvv.png?v=1777556611", "tsl-hertz-art-purple-210154-angulo-frente-par.jpg?v=1763554651", "tsl-hertz-art-purple-210154-cima-par.jpg?v=1763554652", "tsl-hertz-art-purple-210154-atras-par.jpg?v=1763554652", "tsl-hertz-art-purple-210154-angulo-par.jpg?v=1763554653"], { best: true }],
  ["tenis-tesla-coil-black-reflect-mesclado", "Coil Black Reflect Mesclado", 429.9, ["design-sem-nome-73-d1pgy.png?v=1777926096", "117-tesla.jpg?v=1717670272", "118-tesla.jpg?v=1717670273", "119-tesla.jpg?v=1717670273", "120-tesla.jpg?v=1717670274"], { promo: 279.9 }],
  ["tenis-tesla-coil-all-white", "Coil All White", 429.9, ["design-sem-nome-75-lp1tr.png?v=1777926278", "052-tesla.jpg?v=1717670506", "053-tesla.jpg?v=1717670507", "054-tesla.jpg?v=1717670507", "055-tesla.jpg?v=1717670508"], { best: true }],
  ["tenis-tesla-hertz-grey-blue-art", "Hertz Grey Blue Art", 439.9, ["design-sem-nome-14-uzlk3.png?v=1785846728", "5b-otimizada-2mb-ukkym.jpg?v=1782413549", "2c-otimizada-2mb-03fop.jpg?v=1782412368", "5d-2-53vgh.jpg?v=1782413549", "3e-otimizada-2mb-byves.jpg?v=1782412369"], { best: true, isNew: true }],
  ["tenis-tesla-hertz-denim-art", "Hertz Denim Art", 439.9, ["design-sem-nome-18-dwe3e.png?v=1786102666", "10b-1-hsknt.png?v=1781269544", "6c-1-u3vxt.png?v=1781269545", "8e-1-zfaoa.png?v=1781269544", "10d-1-jxiur.png?v=1781269543"], { best: true, isNew: true }],
  ["tenis-tesla-flow-xl-black-purple", "Flow XL Black Purple", 349.9, ["flow-xl-2502-14-black-purple-a-nn279.jpg?v=1773944469", "flow-xl-2502-14-black-purple-b-wrvrf.jpg?v=1773944470", "flow-xl-2502-14-black-purple-c-odoz3.jpg?v=1773944470", "flow-xl-2502-14-black-purple-d-rwkpl.jpg?v=1773944471", "flow-xl-2502-14-black-purple-e-psrdr.jpg?v=1773944472"], { best: true, isNew: true }],
  ["tenis-tesla-flow-xl-grey-tiffany", "Flow XL Grey Tiffany", 349.9, ["chatgpt-image-1-de-jul-de-2026-17-01-01-oibi9.png?v=1782936081", "3b-dwhoc.jpg?v=1782935576", "9c-nuj0t.jpg?v=1782935576", "7d-b62xx.jpg?v=1782935577", "9e-iicmx.jpg?v=1782935578"], { best: true, promo: 244.9 }],
  ["flow-xl-black-reflect", "Flow XL Black Reflect", 349.9, ["design-sem-nome-20-dxmuz.png?v=1786449855", "flow-xl-2502-10-black-reflect-b-suclc.jpg?v=1773944251", "flow-xl-2502-10-black-reflect-c-shhiq.jpg?v=1773944251", "flow-xl-2502-10-black-reflect-d-fqpkm.jpg?v=1773944252", "flow-xl-2502-10-black-reflect-e-dlbul.jpg?v=1773944253"], { best: true, isNew: true }],
  ["tenis-tesla-coil-delux-black-gum-1", "Coil Delux White", 499.9, ["design-sem-nome-31-xk4eq.png?v=1777918070"], { best: true, promo: 249.9, sizes: NO34 }],
  ["flow-xl-black", "Flow XL Black", 349.9, ["design-sem-nome-19-isdbg.png?v=1786449550", "flow-xl-2502-17-black-b-hsgnx.jpg?v=1785765382", "flow-xl-2502-17-black-c-mhkro.jpg?v=1785765382", "flow-xl-2502-17-black-d-cukd7.jpg?v=1785765383", "flow-xl-2502-17-black-e-g2itv.jpg?v=1785765383"], { best: true }],
  ["flow-xl-black-white", "Flow XL Black White", 349.9, ["design-sem-nome-9-photoroom-nx6wf.png?v=1785786200", "flow-xl-2502-16-black-white-b-ybwk0.jpg?v=1785765810", "flow-xl-2502-16-black-white-c-yj09l.jpg?v=1785765810", "flow-xl-2502-16-black-white-d-5xb1x.jpg?v=1785765811", "flow-xl-2502-16-black-white-e-kpe9k.jpg?v=1785765812"], { best: true }],
  ["tenis-tesla-coil-off-white-furta-cor", "Coil Off White Furta Cor", 429.9, ["design-sem-nome-77-ninku.png?v=1778497597", "067-tesla.jpg?v=1717669973", "068-tesla.jpg?v=1717669974", "069-tesla.jpg?v=1717669974", "070-tesla.jpg?v=1717669975"], { best: true, promo: 259.9 }],
  ["tenis-tesla-coil-delux-black-gum", "Coil Delux Black Gum", 499.9, ["design-sem-nome-34-9bhkf.png?v=1777918039", "017-tesla-1.jpg?v=1722940438", "018-tesla-1.jpg?v=1722940439", "019-tesla-1.jpg?v=1722940440", "020-tesla-1.jpg?v=1722940441"], { best: true, sizes: NO34 }],
  ["tenis-tesla-hertz-black-art", "Hertz Black Art", 439.9, ["design-sem-nome-38-fljqn.png?v=1777918390", "226-tesla-1.jpg?v=1727965004", "227-tesla-1.jpg?v=1727965004", "228-tesla-1.jpg?v=1727965005", "229-tesla-1.jpg?v=1727965012"], { best: true }],
  ["tenis-tesla-hertz-white-art", "Hertz White Art", 439.9, ["design-sem-nome-37-utzc3.png?v=1777918405", "598-tesla-1.jpg?v=1739279170", "602-tesla-1.jpg?v=1739279170", "615-tesla-1.jpg?v=1739279171", "622-tesla-1.jpg?v=1739279172"], { best: true, promo: 307.9 }],
  ["tenis-tesla-flow-all-black-reflect", "Flow All Black Reflect", 349.9, ["design-sem-nome-15-so29w.png?v=1785849820", "8b-xtuxq.png?v=1781870198", "5c-2u1rs.png?v=1781870198", "2d-znao8.png?v=1781870198", "6e-ydgx5.png?v=1781870199"], { best: true, isNew: true }],
  ["tenis-tesla-hertz-black-purple", "Hertz Black Purple", 419.9, ["design-sem-nome-39-lprxg.png?v=1777918429", "611-tesla-1.jpg?v=1739279274", "612-tesla-1.jpg?v=1739279275", "620-tesla-1.jpg?v=1739279276", "626-tesla-1.jpg?v=1739279277"], { best: true }],
  ["tenis-tesla-hertz-black-white-art", "Hertz Black White Art", 439.9, ["design-sem-nome-13-pxljm.png?v=1785846625", "6b1-lp0se.jpg?v=1782936149", "3c-nt4ek.jpg?v=1782936150", "4e-hyov4.jpg?v=1782936151", "4d-6vxep.jpg?v=1782936301"], { best: true, isNew: true }],
  ["tenis-tesla-hertz-black-reflect", "Hertz Black Reflect", 379.9, ["design-sem-nome-52-yhgdu.png?v=1777920530", "042-tesla.jpg?v=1717672647", "043-tesla.jpg?v=1717672648", "044-tesla.jpg?v=1717672649", "045-tesla.jpg?v=1717672650"], { best: true, promo: 189.9 }],
  ["tenis-tesla-hertz-off-white-bomb", "Hertz Off White Bomb", 419.9, ["design-sem-nome-18-acuqe.png?v=1786449779", "608-tesla-1.jpg?v=1739279327", "609-tesla-1.jpg?v=1739279328", "618-tesla-1.jpg?v=1739279330", "624-tesla-1.jpg?v=1739279331"], { best: true }],
  ["tenis-tesla-coil-off-white", "Coil Off White", 429.9, ["design-sem-nome-85-kzb7p.png?v=1783022894", "7b-ncc21.jpg?v=1782415256", "1c-o8bfl.jpg?v=1782415257", "1d-vpouk.jpg?v=1782415257", "7e-uimkn.jpg?v=1782415258"], { isNew: true }],
  ["tenis-tesla-coil-off-denim", "Coil Denim", 429.9, ["design-sem-nome-2-6rlda.png?v=1783706016", "9b-0j7mr.jpg?v=1782416455", "4c-mbxrh.jpg?v=1782416455", "3d-erine.jpg?v=1782416456", "5e-yycrg.jpg?v=1782416456"], { isNew: true }],
  ["tenis-tesla-flow-all-black-reflect-1", "Coil Black White", 429.9, ["design-sem-nome-86-jqnux.png?v=1783023497", "2b-nwuy7.jpg?v=1783019591", "8c-uryeg.jpg?v=1783019592", "8d-dyz1g.jpg?v=1783019592", "1e-owcko.jpg?v=1783019593"], { isNew: true }],
  ["tenis-tesla-flow-xl-white-aqua", "Flow XL White Aqua", 349.9, ["design-sem-nome-42-t1nnc.png?v=1777918639", "flow-xl-2502-12-white-aqua-b-7nlbs.jpg?v=1773944367", "flow-xl-2502-12-white-aqua-c-739sa.jpg?v=1773944368", "flow-xl-2502-12-white-aqua-d-nggm7.jpg?v=1773944369", "flow-xl-2502-12-white-aqua-e-vs9cf.jpg?v=1773944370"], { isNew: true, promo: 209.9 }],
];

const lineOf = (name: string): Line => (name.startsWith("Hertz") ? "hertz" : name.startsWith("Coil") ? "coil" : "flow");

export const PRODUCTS: Product[] = ROWS.map(([slug, name, price, images, f = {}]) => ({
  slug,
  name,
  line: lineOf(name),
  price,
  images,
  sizes: f.sizes ?? ALL,
  ...(f.promo ? { promo: f.promo } : {}),
  ...(f.best ? { bestSeller: true } : {}),
  ...(f.isNew ? { isNew: true } : {}),
}));

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const finalPrice = (p: Product) => p.promo ?? p.price;
export const discountPct = (p: Product) => (p.promo ? Math.round((1 - p.promo / p.price) * 100) : 0);

const CDN = "https://cdn.dooca.store/153486/products/";

/** Imagem redimensionada pelo próprio CDN da loja (as originais chegam a 5.000 px). */
export function img(file: string, size = 640) {
  const [name, query = ""] = file.split("?");
  const dot = name!.lastIndexOf(".");
  return `${CDN}${name!.slice(0, dot)}_${size}x${size}+fill_ffffff${name!.slice(dot)}${query ? `?${query}` : ""}`;
}

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const INSTALLMENTS = 6;
export const installment = (v: number) => v / INSTALLMENTS;
