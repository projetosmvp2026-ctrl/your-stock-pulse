import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequestFormSheet } from "@/components/requests/RequestFormSheet";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestsFilters } from "@/components/requests/RequestsFilters";
import { RequestDetailSheet } from "@/components/requests/RequestDetailSheet";
import { useApprovalActions } from "@/components/requests/ApprovalActions";
import { useItems, useRequests } from "@/hooks/useInventoryData";
import { useRole } from "@/hooks/useRole";
import { usePermissions } from "@/hooks/usePermissions";
import { useDemo } from "@/hooks/useDemo";
import { RequestStatus } from "@/types/inventory";
import type { InventoryRequest } from "@/types/inventory";
import type { RequestFilters } from "@/components/requests/request-filter-types";
import { EMPTY_REQUEST_FILTERS } from "@/components/requests/request-filter-types";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export const Route = createFileRoute("/app/requests")({
  component: RequestsPage,
  head: () => ({ meta: [{"title": "Solicitações — Drilling do Brasil"}, {"name": "description", "content": "Consulta e acompanhamento de solicitações de estoque no Drilling do Brasil."}, {"property": "og:title", "content": "Solicitações — Drilling do Brasil"}, {"property": "og:description", "content": "Consulta e acompanhamento de solicitações de estoque no Drilling do Brasil."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  validateSearch: (search: Record<string, unknown>) => ({
    request: (search.request as string) || undefined,
  }),
});

function applyFilters(requests: InventoryRequest[], filters: RequestFilters): InventoryRequest[] {
  return requests.filter((r) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false;
    if (filters.requestor && !r.requestedBy.toLowerCase().includes(filters.requestor.toLowerCase())) return false;
    if (filters.dateFrom && r.createdAt < new Date(filters.dateFrom).toISOString()) return false;
    if (filters.dateTo) {
      const toEnd = new Date(filters.dateTo);
      toEnd.setDate(toEnd.getDate() + 1);
      if (r.createdAt >= toEnd.toISOString()) return false;
    }
    return true;
  });
}

function RequestsPage() {
  const { data: catalogItems } = useItems();
  const { data: requests } = useRequests();
  const { role } = useRole();
  const { can } = usePermissions();
  const { demoStore, bumpVersion } = useDemo();
  const navigate = useNavigate();
  const { request: requestParam } = Route.useSearch();
  const isManagerOrAdmin = role === "admin" || role === "manager";
  const canApproveReq = can("approve_request");
  const [formOpen, setFormOpen] = useState(false);
  const [filters, setFilters] = useState<RequestFilters>(EMPTY_REQUEST_FILTERS);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState<InventoryRequest | null>(null);
  const [cancelTarget, setCancelTarget] = useState<InventoryRequest | null>(null);

  // Open detail from URL param on load
  useEffect(() => {
    if (requestParam && requests.length > 0 && !detailRequest) {
      const found = requests.find((r) => r.id === requestParam);
      if (found) {
        setDetailRequest(found);
        setDetailOpen(true);
      }
    }
  }, [requestParam, requests, detailRequest]);

  const approval = useApprovalActions({ items: catalogItems });

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === RequestStatus.Pending).length,
    [requests],
  );

  const pendingRequests = useMemo(
    () =>
      applyFilters(
        requests.filter((r) => r.status === RequestStatus.Pending),
        filters,
      ).sort((a, b) => {
        if (a.priority === "urgent" && b.priority !== "urgent") return -1;
        if (b.priority === "urgent" && a.priority !== "urgent") return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
    [requests, filters],
  );

  const allFiltered = useMemo(() => applyFilters(requests, filters), [requests, filters]);

  const currentDetail = useMemo(
    () => (detailRequest ? requests.find((r) => r.id === detailRequest.id) ?? detailRequest : null),
    [requests, detailRequest],
  );

  function handleRowClick(req: InventoryRequest) {
    setDetailRequest(req);
    setDetailOpen(true);
    navigate({ to: "/app/requests", search: { request: req.id }, replace: true });
  }

  function handleDetailClose(open: boolean) {
    setDetailOpen(open);
    if (!open) {
      navigate({ to: "/app/requests", search: { request: undefined }, replace: true });
    }
  }

  function handleCancel(req: InventoryRequest) {
    setCancelTarget(req);
  }

  function confirmCancel() {
    if (!cancelTarget || !demoStore) return;
    demoStore.updateRequest(cancelTarget.id, {
      status: RequestStatus.Cancelled,
      updatedAt: new Date().toISOString(),
    });
    bumpVersion();
    toast.success(`${cancelTarget.requestNumber} cancelada`);
    setCancelTarget(null);
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Solicitações de Estoque</h1>
          <p className="text-sm text-muted-foreground">{requests.length} solicitações</p>
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <ErrorBoundary>
      {requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma solicitação enviada"
          description="As solicitações de estoque permitem que membros da equipe peçam itens para seus departamentos."
          actionLabel="Nova Solicitação"
          onAction={() => setFormOpen(true)}
        />
      ) : isManagerOrAdmin ? (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todas as Solicitações</TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5">
              Aprovação Pendente
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <RequestsFilters filters={filters} onChange={setFilters} />
          </div>

          <TabsContent value="all" className="mt-4">
            <RequestsTable requests={allFiltered} onRowClick={handleRowClick} showRequestor />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <RequestsTable requests={pendingRequests} onRowClick={handleRowClick} showRequestor preSorted />
          </TabsContent>
        </Tabs>
      ) : (
        <RequestsTable requests={requests} onRowClick={handleRowClick} />
      )}
      </ErrorBoundary>

      <RequestDetailSheet
        open={detailOpen}
        onOpenChange={handleDetailClose}
        request={currentDetail}
        items={catalogItems}
        canApprove={canApproveReq}
        onApprove={approval.openApprove}
        onDecline={approval.openDecline}
        onPartial={approval.openPartial}
        onCancel={handleCancel}
      />

      {approval.renderDialogs()}

      {/* Cancel confirmation */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar {cancelTarget?.requestNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A solicitação será marcada como cancelada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter Solicitação</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmCancel}
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RequestFormSheet open={formOpen} onOpenChange={setFormOpen} items={catalogItems} />
    </div>
  );
}
