import { useState, useEffect, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Truck } from "lucide-react";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { SupplierFormSheet } from "@/components/suppliers/SupplierFormSheet";
import { SupplierDetailSheet } from "@/components/suppliers/SupplierDetailSheet";
import { CSVExportButton, type CSVColumn } from "@/components/data/CSVExportButton";
import { useSuppliers, useItems, usePurchaseOrders } from "@/hooks/useInventoryData";
import { usePermissions } from "@/hooks/usePermissions";
import { useDeleteSupplier, useUpdateItem } from "@/hooks/useInventoryMutations";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import type { Supplier } from "@/types/inventory";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

interface SuppliersSearch {
  supplier?: string;
}

export const Route = createFileRoute("/app/suppliers")({
  component: SuppliersPage,
  head: () => ({ meta: [{"title": "Fornecedores — Drilling do Brasil"}, {"name": "description", "content": "Consulta de fornecedores, contatos e histórico de compras no Drilling do Brasil."}, {"property": "og:title", "content": "Fornecedores — Drilling do Brasil"}, {"property": "og:description", "content": "Consulta de fornecedores, contatos e histórico de compras no Drilling do Brasil."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  validateSearch: (search: Record<string, unknown>): SuppliersSearch => ({
    supplier: typeof search.supplier === "string" ? search.supplier : undefined,
  }),
});

function SuppliersPage() {
  const { supplier: supplierParam } = Route.useSearch();
  const navigate = useNavigate();
  const { data: suppliers } = useSuppliers();
  const { data: items } = useItems();
  const { data: purchaseOrders } = usePurchaseOrders();
  const { can } = usePermissions();
  const { role } = useRole();
  const canManageSuppliers = can("manage_suppliers");
  const isAdmin = role === "admin";
  const deleteSupplier = useDeleteSupplier();
  const updateItem = useUpdateItem();

  const [formOpen, setFormOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);

  const supplierCsvColumns = useMemo<CSVColumn<Supplier>[]>(() => [
    { header: "Nome", accessor: (s) => s.name },
    { header: "Pessoa de Contato", accessor: (s) => s.contactName },
    { header: "E-mail", accessor: (s) => s.email },
    { header: "Telefone", accessor: (s) => s.phone },
    { header: "Endereço", accessor: (s) => s.address },
    { header: "Prazo de Entrega (dias)", accessor: (s) => s.leadTimeDays },
    { header: "Avaliação", accessor: (s) => s.rating },
    { header: "Observações", accessor: (s) => s.notes },
  ], []);

  useEffect(() => {
    if (supplierParam && suppliers.length > 0) {
      const found = suppliers.find((s) => s.id === supplierParam);
      if (found) {
        setDetailSupplier(found);
        setDetailOpen(true);
      }
    }
  }, [supplierParam, suppliers]);

  function openCreate() {
    setEditSupplier(null);
    setFormOpen(true);
  }

  function openDetail(s: Supplier) {
    setDetailSupplier(s);
    setDetailOpen(true);
    navigate({ to: "/app/suppliers", search: { supplier: s.id }, replace: true });
  }

  function handleDetailClose(open: boolean) {
    setDetailOpen(open);
    if (!open) {
      navigate({ to: "/app/suppliers", search: {}, replace: true });
    }
  }

  function openEdit(s: Supplier) {
    setEditSupplier(s);
    setFormOpen(true);
  }

  function handleDelete(id: string) {
    for (const item of items) {
      if (item.supplierId === id) {
        updateItem.mutate({ id: item.id, updates: { supplierId: null } });
      }
    }
    deleteSupplier.mutate(id);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Diretório de Fornecedores</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} fornecedores</p>
        </div>
        <div className="flex items-center gap-2">
          <CSVExportButton
            data={suppliers}
            columns={supplierCsvColumns}
            filename="drilling-do-brasil-suppliers"
          />
          {canManageSuppliers && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Novo Fornecedor
            </Button>
          )}
        </div>
      </div>

      <ErrorBoundary>
      {suppliers.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Ainda não há fornecedores adicionados"
          description="Adicione seus fornecedores para acompanhar prazos de entrega, informações de contato e histórico de pedidos."
          actionLabel={canManageSuppliers ? "Adicionar Fornecedor" : undefined}
          onAction={canManageSuppliers ? openCreate : undefined}
        />
      ) : (
        <SuppliersTable suppliers={suppliers} items={items} onRowClick={openDetail} />
      )}
      </ErrorBoundary>

      <SupplierDetailSheet
        open={detailOpen}
        onOpenChange={handleDetailClose}
        supplier={detailSupplier}
        items={items}
        purchaseOrders={purchaseOrders}
        canEdit={canManageSuppliers}
        canDelete={isAdmin}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <SupplierFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        supplier={editSupplier}
      />
    </div>
  );
}
