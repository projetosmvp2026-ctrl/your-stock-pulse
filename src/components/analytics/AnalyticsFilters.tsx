import { Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category, Supplier, Location } from "@/types/inventory";

export interface AnalyticsFilterValues {
  categoryId: string | null;
  supplierId: string | null;
  locationId: string | null;
  days: number;
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFilterValues;
  onChange: (filters: AnalyticsFilterValues) => void;
  categories: Category[];
  suppliers: Supplier[];
  locations: Location[];
}

const DATE_PRESETS = [
  { label: "Últimos 30 dias", value: 30 },
  { label: "Últimos 90 dias", value: 90 },
  { label: "Este Ano", value: 365 },
];

export function AnalyticsFilters({ filters, onChange, categories, suppliers, locations }: AnalyticsFiltersProps) {
  const activeCount = [filters.categoryId, filters.supplierId, filters.locationId].filter(Boolean).length;

  const set = (key: keyof AnalyticsFilterValues, value: string | number | null) =>
    onChange({ ...filters, [key]: value });

  const clearAll = () => onChange({ ...filters, categoryId: null, supplierId: null, locationId: null });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={String(filters.days)} onValueChange={(v) => set("days", Number(v))}>
        <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>
          {DATE_PRESETS.map((p) => <SelectItem key={p.value} value={String(p.value)}>{p.label}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="h-4 w-px bg-border" />

      <Select value={filters.categoryId ?? "__all__"} onValueChange={(v) => set("categoryId", v === "__all__" ? null : v)}>
        <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Categoria" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todas as Categorias</SelectItem>
          {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.supplierId ?? "__all__"} onValueChange={(v) => set("supplierId", v === "__all__" ? null : v)}>
        <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Fornecedor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos os Fornecedores</SelectItem>
          {suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.locationId ?? "__all__"} onValueChange={(v) => set("locationId", v === "__all__" ? null : v)}>
        <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Local" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos os Locais</SelectItem>
          {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
        </SelectContent>
      </Select>

      {activeCount > 0 && (
        <>
          <Badge variant="secondary" className="text-xs">{activeCount} filtro{activeCount !== 1 && "s"}</Badge>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={clearAll}>
            <X className="mr-1 h-3 w-3" /> Limpar
          </Button>
        </>
      )}
    </div>
  );
}
