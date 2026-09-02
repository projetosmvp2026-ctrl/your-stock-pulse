import type { Category, Supplier, Location } from "@/types/inventory";

const ts = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const categories: Category[] = [
  { id: "cat-01", name: "Eletrônicos", description: "Componentes e dispositivos eletrônicos", parentId: null, createdAt: ts(90), updatedAt: ts(90) },
  { id: "cat-02", name: "Material de Escritório", description: "Papel, canetas e itens essenciais de escritório", parentId: null, createdAt: ts(90), updatedAt: ts(90) },
  { id: "cat-03", name: "Limpeza", description: "Produtos de limpeza e suprimentos de zeladoria", parentId: null, createdAt: ts(90), updatedAt: ts(90) },
  { id: "cat-04", name: "Equipamento de Segurança", description: "EPIs e equipamentos de segurança", parentId: null, createdAt: ts(90), updatedAt: ts(90) },
  { id: "cat-05", name: "Ferramentas", description: "Ferramentas manuais e elétricas", parentId: null, createdAt: ts(90), updatedAt: ts(90) },
];

export const suppliers: Supplier[] = [
  { id: "sup-01", name: "Acme Supply Co", contactName: "John Carter", email: "john@acmesupply.com", phone: "555-0101", address: "123 Industrial Ave, Chicago IL", leadTimeDays: 5, rating: 4.5, isActive: true, notes: "Fornecedor principal de eletrônicos", createdAt: ts(120), updatedAt: ts(10) },
  { id: "sup-02", name: "TechParts Direct", contactName: "Sarah Lin", email: "sarah@techparts.com", phone: "555-0202", address: "456 Tech Blvd, San Jose CA", leadTimeDays: 3, rating: 4.8, isActive: true, notes: "Envio rápido, preço premium", createdAt: ts(100), updatedAt: ts(5) },
  { id: "sup-03", name: "CleanPro Distributors", contactName: "Mike Davis", email: "mike@cleanpro.com", phone: "555-0303", address: "789 Clean St, Houston TX", leadTimeDays: 7, rating: 4.0, isActive: true, notes: "Descontos por volume disponíveis", createdAt: ts(80), updatedAt: ts(15) },
  { id: "sup-04", name: "SafetyFirst Inc", contactName: "Lisa Park", email: "lisa@safetyfirst.com", phone: "555-0404", address: "321 Safety Rd, Atlanta GA", leadTimeDays: 4, rating: 4.3, isActive: true, notes: "Produtos em conformidade com a OSHA", createdAt: ts(70), updatedAt: ts(8) },
];

export const locations: Location[] = [
  // Hierarquia do Depósito Principal
  { id: "loc-01", name: "Depósito Principal", type: "warehouse", parentId: null, description: "Instalação de armazenamento principal", address: "100 Warehouse Dr, Chicago IL", isActive: true, createdAt: ts(120), updatedAt: ts(5) },
  { id: "loc-01-z1", name: "Zona A — Eletrônicos", type: "zone", parentId: "loc-01", description: "Zona de armazenamento de eletrônicos", address: "", isActive: true, createdAt: ts(110), updatedAt: ts(5) },
  { id: "loc-01-z2", name: "Zona B — Suprimentos", type: "zone", parentId: "loc-01", description: "Material de escritório e limpeza", address: "", isActive: true, createdAt: ts(110), updatedAt: ts(5) },
  { id: "loc-01-z1-a1", name: "Corredor 1", type: "aisle", parentId: "loc-01-z1", description: "Cabos e acessórios", address: "", isActive: true, createdAt: ts(100), updatedAt: ts(5) },
  { id: "loc-01-z1-a2", name: "Corredor 2", type: "aisle", parentId: "loc-01-z1", description: "Periféricos", address: "", isActive: true, createdAt: ts(100), updatedAt: ts(5) },
  { id: "loc-01-z2-a1", name: "Corredor 3", type: "aisle", parentId: "loc-01-z2", description: "Papel e material de escrita", address: "", isActive: true, createdAt: ts(100), updatedAt: ts(5) },
  // Loja Centro
  { id: "loc-02", name: "Loja Centro", type: "warehouse", parentId: null, description: "Loja física com estoque", address: "200 Main St, Chicago IL", isActive: true, createdAt: ts(100), updatedAt: ts(10) },
  // Escritório Regional
  { id: "loc-03", name: "Escritório Regional", type: "warehouse", parentId: null, description: "Material de escritório corporativo", address: "300 Corporate Pkwy, Chicago IL", isActive: true, createdAt: ts(80), updatedAt: ts(20) },
];
