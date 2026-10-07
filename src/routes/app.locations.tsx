import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, ArrowRightLeft, MapPin } from "lucide-react";
import { useLocationTree } from "@/hooks/useLocations";
import { useItems, useLocations as useLocationsData } from "@/hooks/useInventoryData";
import { LocationTree } from "@/components/locations/LocationTree";
import { LocationSummary } from "@/components/locations/LocationSummary";
import { LocationFormSheet } from "@/components/locations/LocationFormSheet";
import { TransferStockSheet } from "@/components/locations/TransferStockSheet";
import { PermissionGate } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import type { LocationTreeNode } from "@/hooks/useLocations";

export const Route = createFileRoute("/app/locations")({
  component: LocationsPage,
  head: () => ({ meta: [{"title": "Locais — Stackwise"}, {"name": "description", "content": "Organização dos locais de armazenamento e transferências no Stackwise."}, {"property": "og:title", "content": "Locais — Stackwise"}, {"property": "og:description", "content": "Organização dos locais de armazenamento e transferências no Stackwise."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
});

function findNode(nodes: LocationTreeNode[], id: string): LocationTreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNode(n.children, id);
    if (found) return found;
  }
  return null;
}

function LocationsPage() {
  const tree = useLocationTree();
  const { data: items } = useItems();
  const { data: allLocations } = useLocationsData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const selectedNode = useMemo(
    () => (selectedId ? findNode(tree, selectedId) : null),
    [tree, selectedId],
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Locais</h1>
          <p className="text-sm text-muted-foreground">
            {allLocations.length} local{allLocations.length !== 1 && "is"}
          </p>
        </div>
        <PermissionGate permission="create_item">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTransferOpen(true)}
            >
              <ArrowRightLeft className="mr-1.5 h-4 w-4" />
              Transferir Estoque
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Novo Local
            </Button>
          </div>
        </PermissionGate>
      </div>

      <ErrorBoundary>
      {tree.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Nenhum local configurado"
          description="Adicione armazéns, zonas e prateleiras para organizar seu estoque por local."
          actionLabel="Adicionar Local"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="rounded-lg border border-border bg-card p-4">
            <LocationTree
              tree={tree}
              items={items}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            {selectedNode ? (
              <LocationSummary
                node={selectedNode}
                allLocations={allLocations}
                items={items}
              />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Selecione um local para ver detalhes
              </p>
            )}
          </div>
        </div>
      )}
      </ErrorBoundary>

      <LocationFormSheet open={formOpen} onOpenChange={setFormOpen} />
      <TransferStockSheet open={transferOpen} onOpenChange={setTransferOpen} />
    </div>
  );
}
