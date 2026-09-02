import type { Item } from "@/types/inventory";
import { ItemStatus } from "@/types/inventory";

const ts = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const item = (
  idx: number,
  name: string,
  catId: string,
  supId: string,
  locId: string,
  stock: number,
  reorder: number,
  cost: number,
  sell: number,
): Item => ({
  id: `itm-${String(idx).padStart(3, "0")}`,
  sku: `STK-${String(1000 + idx)}`,
  barcode: idx % 3 === 0 ? null : `49${String(10000000 + idx * 137).slice(0, 8)}${idx % 10}`,
  name,
  description: `${name} — item de estoque padrão`,
  categoryId: catId,
  status: ItemStatus.Active,
  unit: "un",
  currentStock: stock,
  reorderPoint: reorder,
  reorderQuantity: reorder * 2,
  costPrice: cost,
  sellingPrice: sell,
  locationId: locId,
  supplierId: supId,
  imageUrl: null,
  customFields: {},
  createdAt: ts(60),
  updatedAt: ts(Math.floor(Math.random() * 30)),
});

// ~20 saudáveis (estoque > reposição), ~10 baixos (estoque <= reposição e > 0), ~5 esgotados (estoque = 0)
const cf = (fields: Record<string, string | number | boolean>) => fields;

export const items: Item[] = [
  // Eletrônicos — 8 itens
  { ...item(1, "Cabo de Carregamento USB-C", "cat-01", "sup-02", "loc-01", 150, 30, 3.5, 8.99), customFields: cf({ "Número do Lote": "LOT-2024-A1", "Cor": "Preto", "Garantia (Meses)": 12 }) },
  { ...item(2, "Mouse sem Fio", "cat-01", "sup-02", "loc-01", 18, 20, 12, 24.99), customFields: cf({ "Número do Lote": "LOT-2024-B3", "Cor": "Prata", "Sem Fio": true }) }, // baixo
  { ...item(3, "Adaptador HDMI", "cat-01", "sup-01", "loc-01", 42, 15, 8, 15.99), customFields: cf({ "Número do Lote": "LOT-2024-C2" }) },
  item(4, "Protetor contra Surtos", "cat-01", "sup-01", "loc-01", 12, 10, 15, 29.99), // baixo
  item(5, "Luminária de Mesa LED", "cat-01", "sup-02", "loc-02", 0, 10, 22, 39.99), // esgotado
  item(6, "Suporte para Notebook", "cat-01", "sup-02", "loc-01", 65, 15, 18, 34.99),
  item(7, "Power Bank 10000mAh", "cat-01", "sup-01", "loc-02", 8, 12, 14, 27.99), // baixo
  item(8, "Webcam HD 1080p", "cat-01", "sup-02", "loc-01", 9, 10, 25, 49.99), // baixo

  // Material de Escritório — 8 itens
  { ...item(9, "Papel Sulfite A4 (Resma)", "cat-02", "sup-01", "loc-01", 200, 50, 4, 7.99), customFields: cf({ "Data de Validade": "2026-12-31", "Reciclável": true }) },
  item(10, "Canetas Esferográficas (12un)", "cat-02", "sup-01", "loc-01", 20, 25, 2, 5.99), // baixo
  item(11, "Bloco de Notas Adesivas (6un)", "cat-02", "sup-01", "loc-02", 55, 20, 3, 6.49),
  item(12, "Clipes Binder (Caixa)", "cat-02", "sup-03", "loc-01", 40, 15, 1.5, 3.99),
  item(13, "Marcadores para Quadro Branco (8un)", "cat-02", "sup-03", "loc-02", 5, 10, 4, 8.99), // baixo
  item(14, "Organizador de Mesa", "cat-02", "sup-01", "loc-03", 0, 8, 11, 19.99), // esgotado
  item(15, "Grampeador Reforçado", "cat-02", "sup-01", "loc-01", 28, 10, 9, 16.99),
  item(16, "Pastas de Arquivo (50un)", "cat-02", "sup-03", "loc-01", 75, 20, 8, 14.99),

  // Limpeza — 7 itens
  item(17, "Limpador Multiuso (3,8L)", "cat-03", "sup-03", "loc-01", 45, 15, 6, 11.99),
  item(18, "Panos de Microfibra (24un)", "cat-03", "sup-03", "loc-01", 60, 20, 8, 14.99),
  item(19, "Sistema de Mop", "cat-03", "sup-03", "loc-01", 3, 5, 25, 44.99), // baixo
  item(20, "Álcool em Gel (1L)", "cat-03", "sup-03", "loc-02", 0, 20, 5, 9.99), // esgotado
  item(21, "Sacos de Lixo (100un)", "cat-03", "sup-03", "loc-01", 80, 25, 12, 19.99),
  item(22, "Limpa Vidros (950ml)", "cat-03", "sup-03", "loc-02", 35, 10, 4, 7.49),
  item(23, "Lenços Desinfetantes (75un)", "cat-03", "sup-03", "loc-01", 7, 15, 6, 10.99), // baixo

  // Equipamento de Segurança — 6 itens
  item(24, "Óculos de Proteção (12un)", "cat-04", "sup-04", "loc-01", 48, 12, 18, 32.99),
  item(25, "Luvas de Nitrila (100un)", "cat-04", "sup-04", "loc-01", 28, 30, 9, 16.99), // baixo
  item(26, "Capacete de Segurança ANSI Tipo I", "cat-04", "sup-04", "loc-01", 22, 8, 14, 24.99),
  item(27, "Colete de Alta Visibilidade", "cat-04", "sup-04", "loc-01", 6, 10, 7, 12.99), // baixo
  item(28, "Kit de Primeiros Socorros", "cat-04", "sup-04", "loc-02", 0, 5, 30, 54.99), // esgotado
  item(29, "Protetores Auriculares (200pr)", "cat-04", "sup-04", "loc-01", 65, 20, 12, 22.99),

  // Ferramentas — 6 itens
  item(30, "Kit de Furadeira sem Fio", "cat-05", "sup-01", "loc-01", 18, 5, 55, 99.99),
  item(31, "Jogo de Soquetes", "cat-05", "sup-01", "loc-01", 25, 8, 28, 49.99),
  item(32, "Trena de 7,5m", "cat-05", "sup-01", "loc-02", 40, 12, 6, 11.99),
  item(33, "Estilete", "cat-05", "sup-01", "loc-01", 4, 10, 5, 9.99), // baixo
  item(34, "Jogo de Chaves Allen", "cat-05", "sup-01", "loc-01", 0, 8, 10, 17.99), // esgotado
  item(35, "Abraçadeiras de Nylon (500un)", "cat-05", "sup-02", "loc-01", 90, 25, 7, 12.99),
];
