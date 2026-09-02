import type { Notification } from "@/types/inventory";
import { subHours, subDays, subMinutes } from "date-fns";

export function generateNotifications(): Notification[] {
  const now = new Date();
  return [
    {
      id: "notif-001",
      type: "zero_stock",
      title: "Sem Estoque: Toner de Impressora Preto",
      message: "Toner de Impressora Preto (STK-1005) chegou a zero de estoque. Reponha imediatamente para evitar interrupções.",
      isRead: false,
      link: "/app/catalog?item=itm-005",
      referenceId: "itm-005",
      createdAt: subMinutes(now, 25).toISOString(),
    },
    {
      id: "notif-002",
      type: "low_stock",
      title: "Estoque Baixo: Marcadores para Quadro Branco",
      message: "Marcadores para Quadro Branco (STK-1012) está com 18 unidades, abaixo do ponto de reposição de 20.",
      isRead: false,
      link: "/app/catalog?item=itm-012",
      referenceId: "itm-012",
      createdAt: subHours(now, 2).toISOString(),
    },
    {
      id: "notif-003",
      type: "po_overdue",
      title: "Pedido Atrasado: PO-2024-001",
      message: "O pedido de compra PO-2024-001 era esperado há 3 dias e ainda não foi totalmente recebido.",
      isRead: false,
      link: "/app/purchase-orders?po=po-001",
      referenceId: "po-001",
      createdAt: subHours(now, 6).toISOString(),
    },
    {
      id: "notif-004",
      type: "po_reminder",
      title: "Pedido Chegando em Breve: PO-2024-002",
      message: "O pedido de compra PO-2024-002 deve chegar dentro de 2 dias.",
      isRead: true,
      link: "/app/purchase-orders?po=po-002",
      referenceId: "po-002",
      createdAt: subDays(now, 1).toISOString(),
    },
    {
      id: "notif-005",
      type: "request_update",
      title: "Solicitação Aprovada: REQ-2024-001",
      message: "Sua solicitação de estoque REQ-2024-001 foi aprovada e está sendo processada.",
      isRead: true,
      link: "/app/requests?request=req-001",
      referenceId: "req-001",
      createdAt: subDays(now, 2).toISOString(),
    },
    {
      id: "notif-006",
      type: "low_stock",
      title: "Estoque Baixo: Organizador de Mesa",
      message: "Organizador de Mesa (STK-1020) está com 7 unidades, abaixo do ponto de reposição de 10.",
      isRead: false,
      link: "/app/catalog?item=itm-020",
      referenceId: "itm-020",
      createdAt: subHours(now, 4).toISOString(),
    },
    {
      id: "notif-007",
      type: "system",
      title: "Bem-vindo ao Stackwise",
      message: "Seu sistema de gestão de estoque está pronto. Explore o painel para começar.",
      isRead: true,
      link: "/app/dashboard",
      referenceId: null,
      createdAt: subDays(now, 5).toISOString(),
    },
  ];
}
