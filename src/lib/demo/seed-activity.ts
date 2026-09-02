import type {
  StockMovement,
  PurchaseOrder,
  PurchaseOrderItem,
  InventoryRequest,
  RequestItem,
} from "@/types/inventory";
import {
  MovementType,
  OrderStatus,
  RequestStatus,
} from "@/types/inventory";
import { items } from "./seed-items";

const ts = (daysAgo: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const types = [MovementType.Received, MovementType.Shipped, MovementType.Adjusted];

export function generateMovements(): StockMovement[] {
  const movements: StockMovement[] = [];
  for (let i = 0; i < 70; i++) {
    const daysAgo = Math.floor((i / 70) * 30);
    const hour = 8 + (i % 10);
    const itemIdx = i % items.length;
    const type = types[i % 3];
    const qty = type === MovementType.Shipped ? -(5 + (i % 10)) : 5 + (i % 15);
    movements.push({
      id: `mov-${String(i + 1).padStart(3, "0")}`,
      itemId: items[itemIdx].id,
      type,
      quantity: qty,
      fromLocationId: type === MovementType.Shipped ? "loc-01" : null,
      toLocationId: type === MovementType.Received ? "loc-01" : null,
      reference: `REF-${String(2000 + i)}`,
      notes: "",
      performedBy: "demo-user",
      createdAt: ts(daysAgo, hour),
    });
  }
  return movements;
}

export function generatePurchaseOrders(): PurchaseOrder[] {
  const po1Items: PurchaseOrderItem[] = [
    { id: "poi-01", purchaseOrderId: "po-01", itemId: "itm-005", quantityOrdered: 20, quantityReceived: 0, unitCost: 22 },
    { id: "poi-02", purchaseOrderId: "po-01", itemId: "itm-014", quantityOrdered: 15, quantityReceived: 0, unitCost: 11 },
    { id: "poi-03", purchaseOrderId: "po-01", itemId: "itm-020", quantityOrdered: 40, quantityReceived: 0, unitCost: 5 },
    { id: "poi-04", purchaseOrderId: "po-01", itemId: "itm-028", quantityOrdered: 10, quantityReceived: 0, unitCost: 30 },
  ];
  const po2Items: PurchaseOrderItem[] = [
    { id: "poi-05", purchaseOrderId: "po-02", itemId: "itm-001", quantityOrdered: 50, quantityReceived: 50, unitCost: 15 },
    { id: "poi-06", purchaseOrderId: "po-02", itemId: "itm-003", quantityOrdered: 30, quantityReceived: 30, unitCost: 8 },
  ];
  const po3Items: PurchaseOrderItem[] = [
    { id: "poi-07", purchaseOrderId: "po-03", itemId: "itm-008", quantityOrdered: 25, quantityReceived: 10, unitCost: 18 },
    { id: "poi-08", purchaseOrderId: "po-03", itemId: "itm-012", quantityOrdered: 60, quantityReceived: 20, unitCost: 4 },
    { id: "poi-09", purchaseOrderId: "po-03", itemId: "itm-019", quantityOrdered: 15, quantityReceived: 0, unitCost: 25 },
  ];
  const po4Items: PurchaseOrderItem[] = [
    { id: "poi-10", purchaseOrderId: "po-04", itemId: "itm-010", quantityOrdered: 100, quantityReceived: 0, unitCost: 3 },
  ];
  const po5Items: PurchaseOrderItem[] = [
    { id: "poi-11", purchaseOrderId: "po-05", itemId: "itm-002", quantityOrdered: 40, quantityReceived: 0, unitCost: 12 },
    { id: "poi-12", purchaseOrderId: "po-05", itemId: "itm-006", quantityOrdered: 20, quantityReceived: 0, unitCost: 35 },
  ];
  const po6Items: PurchaseOrderItem[] = [
    { id: "poi-13", purchaseOrderId: "po-06", itemId: "itm-015", quantityOrdered: 80, quantityReceived: 80, unitCost: 6 },
    { id: "poi-14", purchaseOrderId: "po-06", itemId: "itm-022", quantityOrdered: 45, quantityReceived: 45, unitCost: 9 },
  ];
  const calc = (li: PurchaseOrderItem[]) => li.reduce((s, i) => s + i.quantityOrdered * i.unitCost, 0);
  return [
    {
      id: "po-01", orderNumber: "PO-2024-001", supplierId: "sup-01", status: OrderStatus.Submitted,
      items: po1Items, totalCost: calc(po1Items), expectedDelivery: ts(-2),
      notes: "Reposição de itens sem estoque", createdBy: "demo-user", createdAt: ts(3), updatedAt: ts(1),
    },
    {
      id: "po-02", orderNumber: "PO-2024-002", supplierId: "sup-02", status: OrderStatus.Received,
      items: po2Items, totalCost: calc(po2Items), expectedDelivery: ts(20),
      notes: "Reposição mensal de eletrônicos", createdBy: "demo-user", createdAt: ts(25), updatedAt: ts(18),
    },
    {
      id: "po-03", orderNumber: "PO-2024-003", supplierId: "sup-03", status: OrderStatus.Partial,
      items: po3Items, totalCost: calc(po3Items), expectedDelivery: ts(-3),
      notes: "Produtos de limpeza — envio parcial recebido", createdBy: "demo-user", createdAt: ts(12), updatedAt: ts(5),
    },
    {
      id: "po-04", orderNumber: "PO-2024-004", supplierId: "sup-01", status: OrderStatus.Submitted,
      items: po4Items, totalCost: calc(po4Items), expectedDelivery: ts(-5),
      notes: "Reposição urgente de material de escritório", createdBy: "demo-user", createdAt: ts(8), updatedAt: ts(7),
    },
    {
      id: "po-05", orderNumber: "PO-2024-005", supplierId: "sup-04", status: OrderStatus.Cancelled,
      items: po5Items, totalCost: calc(po5Items), expectedDelivery: ts(-2),
      notes: "Cancelado — fornecedor sem estoque", createdBy: "demo-user", createdAt: ts(15), updatedAt: ts(10),
    },
    {
      id: "po-06", orderNumber: "PO-2024-006", supplierId: "sup-02", status: OrderStatus.Received,
      items: po6Items, totalCost: calc(po6Items), expectedDelivery: ts(30),
      notes: "Pedido de equipamentos de segurança do 4º trimestre", createdBy: "demo-user", createdAt: ts(35), updatedAt: ts(28),
    },
  ];
}

export function generateRequests(): InventoryRequest[] {
  const mkItems = (rid: string, ids: string[]): RequestItem[] =>
    ids.map((itemId, i) => ({
      id: `ri-${rid}-${i + 1}`,
      requestId: rid,
      itemId,
      quantity: 5 + i * 3,
      notes: "",
    }));

  return [
    {
      id: "req-01",
      requestNumber: "REQ-2024-001",
      title: "Reposição de eletrônicos para o laboratório",
      status: RequestStatus.Pending,
      priority: "urgent" as const,
      items: mkItems("req-01", ["itm-004", "itm-007"]),
      requestedBy: "demo-user",
      approvedBy: null,
      reason: "Estoque de eletrônicos baixo para as estações de trabalho do laboratório",
      createdAt: ts(2),
      updatedAt: ts(2),
    },
    {
      id: "req-02",
      requestNumber: "REQ-2024-002",
      title: "Reposição de produtos de limpeza",
      status: RequestStatus.Approved,
      priority: "normal" as const,
      items: mkItems("req-02", ["itm-019", "itm-023"]),
      requestedBy: "demo-user",
      approvedBy: "demo-admin",
      reason: "Produtos de limpeza estão em baixa no prédio B",
      createdAt: ts(5),
      updatedAt: ts(3),
    },
    {
      id: "req-03",
      requestNumber: "REQ-2024-003",
      title: "Marcadores de escritório para sala de treinamento",
      status: RequestStatus.Fulfilled,
      priority: "normal" as const,
      items: mkItems("req-03", ["itm-013"]),
      requestedBy: "demo-user",
      approvedBy: "demo-admin",
      reason: "Marcadores de escritório necessários para as próximas sessões de treinamento",
      createdAt: ts(10),
      updatedAt: ts(7),
    },
    {
      id: "req-04",
      requestNumber: "REQ-2024-004",
      title: "Equipamentos de segurança para novos contratados",
      status: RequestStatus.Pending,
      priority: "normal" as const,
      items: mkItems("req-04", ["itm-002", "itm-010"]),
      requestedBy: "demo-user",
      approvedBy: null,
      reason: "Três novos membros da equipe começam na próxima semana e precisam de equipamentos de segurança",
      createdAt: ts(1),
      updatedAt: ts(1),
    },
    {
      id: "req-05",
      requestNumber: "REQ-2024-005",
      title: "Emergência de papel para impressora",
      status: RequestStatus.Declined,
      priority: "urgent" as const,
      items: mkItems("req-05", ["itm-014"]),
      requestedBy: "demo-user",
      approvedBy: "demo-admin",
      reason: "Todas as impressoras estão sem papel",
      declineReason: "Papel já foi solicitado no pedido PO-2024-004",
      createdAt: ts(4),
      updatedAt: ts(3),
    },
  ];
}
