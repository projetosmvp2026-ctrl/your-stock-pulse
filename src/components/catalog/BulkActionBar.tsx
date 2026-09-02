import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Supplier, Location } from "@/types/inventory";
import { ItemStatus } from "@/types/inventory";

interface BulkActionBarProps {
  selectedCount: number;
  categories: Category[];
  suppliers: Supplier[];
  locations: Location[];
  onUpdateCategory: (categoryId: string) => void;
  onUpdateSupplier: (supplierId: string) => void;
  onUpdateLocation: (locationId: string) => void;
  onUpdateStatus: (status: ItemStatus) => void;
  onDeselectAll: () => void;
  onPrintLabels?: () => void;
}

const STATUS_OPTIONS = [
  { value: ItemStatus.Active, label: "Ativo" },
  { value: ItemStatus.Discontinued, label: "Descontinuado" },
  { value: ItemStatus.Archived, label: "Arquivado" },
];

export function BulkActionBar({
  selectedCount,
  categories,
  suppliers,
  locations,
  onUpdateCategory,
  onUpdateSupplier,
  onUpdateLocation,
  onUpdateStatus,
  onDeselectAll,
  onPrintLabels,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 shadow-lg animate-in slide-in-from-bottom duration-300 sm:px-6"
      role="toolbar"
      aria-label="Ações em massa"
    >
      <span className="shrink-0 text-sm font-medium text-foreground">
        {selectedCount} {selectedCount !== 1 ? "itens selecionados" : "item selecionado"}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {/* Category */}
        <Select onValueChange={onUpdateCategory}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Supplier */}
        <Select onValueChange={onUpdateSupplier}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Fornecedor" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select onValueChange={onUpdateLocation}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Local" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select onValueChange={(v) => onUpdateStatus(v as ItemStatus)}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onPrintLabels && (
          <Button variant="outline" size="sm" onClick={onPrintLabels} className="h-8 gap-1 text-xs">
            <Printer className="h-3 w-3" />
            Imprimir Etiquetas
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={onDeselectAll} className="h-8 gap-1 text-xs">
          <X className="h-3 w-3" />
          Desmarcar Todos
        </Button>
      </div>
    </div>
  );
}
