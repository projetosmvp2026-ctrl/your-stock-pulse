import { useMemo } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusStepper } from "@/components/requests/StatusStepper";
import { RequestStatus } from "@/types/inventory";
import type { InventoryRequest, Item } from "@/types/inventory";

const STATUS_LABEL: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "Pendente",
  [RequestStatus.Approved]: "Aprovado",
  [RequestStatus.PartiallyFulfilled]: "Parcial",
  [RequestStatus.Fulfilled]: "Atendido",
  [RequestStatus.Declined]: "Recusado",
  [RequestStatus.Cancelled]: "Cancelado",
};

const STATUS_CLASS: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "bg-primary/15 text-primary border-primary/20",
  [RequestStatus.Approved]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [RequestStatus.PartiallyFulfilled]: "bg-amber-accent/15 text-amber-accent border-amber-accent/20",
  [RequestStatus.Fulfilled]: "bg-stock-healthy/15 text-stock-healthy border-stock-healthy/20",
  [RequestStatus.Declined]: "bg-destructive/15 text-destructive border-destructive/20",
  [RequestStatus.Cancelled]: "bg-muted text-muted-foreground",
};

interface RequestDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: InventoryRequest | null;
  items: Item[];
  canApprove: boolean;
  onApprove?: (req: InventoryRequest) => void;
  onDecline?: (req: InventoryRequest) => void;
  onPartial?: (req: InventoryRequest) => void;
  onCancel?: (req: InventoryRequest) => void;
}

export function RequestDetailSheet({
  open,
  onOpenChange,
  request,
  items,
  canApprove,
  onApprove,
  onDecline,
  onPartial,
  onCancel,
}: RequestDetailSheetProps) {
  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  if (!request) return null;

  const isPending = request.status === RequestStatus.Pending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[560px]">
        <SheetHeader>
          <SheetTitle>{request.requestNumber}</SheetTitle>
          <SheetDescription>Detalhes da solicitação</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Status stepper */}
          <StatusStepper status={request.status} />

          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={STATUS_CLASS[request.status]}>
              {STATUS_LABEL[request.status]}
            </Badge>
            {request.priority === "urgent" && (
              <Badge variant="outline" className="bg-amber-accent/15 text-amber-accent border-amber-accent/20">
                Urgente
              </Badge>
            )}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Enviado por</p>
              <p className="text-sm text-foreground">{request.requestedBy}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Data</p>
              <p className="text-sm text-foreground">
                {format(new Date(request.createdAt), "dd/MM/yyyy")}
              </p>
            </div>
          </div>

          {/* Title & Reason */}
          <div>
            <p className="text-xs font-medium text-muted-foreground">Título</p>
            <p className="text-sm font-medium text-foreground">{request.title}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Motivo / Justificativa</p>
            <p className="text-sm text-foreground">{request.reason}</p>
          </div>

          {/* Decline reason — prominent */}
          {request.declineReason && (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs font-medium text-destructive">Motivo da Recusa</p>
              <p className="text-sm text-foreground">{request.declineReason}</p>
            </div>
          )}

          <Separator />

          {/* Line items */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">
              Itens ({request.items.length})
            </p>
            <div className="overflow-x-auto rounded-md border border-border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-[60px] text-right">Solicitado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {request.items.map((li) => {
                    const item = itemMap.get(li.itemId);
                    return (
                      <TableRow key={li.id}>
                        <TableCell>
                          <p className="text-sm font-medium">{item?.name ?? li.itemId}</p>
                          <p className="font-mono text-xs text-muted-foreground">{item?.sku ?? "—"}</p>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {li.quantity}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Linha do Tempo</p>
            <div className="space-y-2">
              <TimelineEntry label="Enviado" date={request.createdAt} by={request.requestedBy} />
              {request.status !== RequestStatus.Pending &&
                request.status !== RequestStatus.Cancelled && (
                  <TimelineEntry
                    label={STATUS_LABEL[request.status]}
                    date={request.updatedAt}
                    by={request.approvedBy ?? undefined}
                  />
                )}
              {request.status === RequestStatus.Cancelled && (
                <TimelineEntry label="Cancelado" date={request.updatedAt} by={request.requestedBy} />
              )}
            </div>
          </div>

          {/* Approval actions (admin/manager) */}
          {isPending && canApprove && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {onApprove && (
                  <Button size="sm" onClick={() => onApprove(request)}>Aprovar</Button>
                )}
                {onPartial && (
                  <Button size="sm" variant="outline" onClick={() => onPartial(request)}>Atender Parcialmente</Button>
                )}
                {onDecline && (
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => onDecline(request)}>Recusar</Button>
                )}
              </div>
            </>
          )}

          {/* Cancel button (requestor's own pending request) */}
          {isPending && !canApprove && onCancel && (
            <>
              <Separator />
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => onCancel(request)}
              >
                Cancelar Solicitação
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TimelineEntry({ label, date, by }: { label: string; date: string; by?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{format(new Date(date), "MMM d, yyyy")}</span>
      {by && <span className="text-muted-foreground">por {by}</span>}
    </div>
  );
}
