import { cn } from "@/lib/utils";

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
type ItemStatus = "active" | "discontinued" | "archived";
type BadgeStatus = StockStatus | ItemStatus;

const config: Record<BadgeStatus, { label: string; dotClass: string; textClass: string }> = {
  "in-stock": {
    label: "Em Estoque",
    dotClass: "bg-stock-healthy",
    textClass: "text-stock-healthy",
  },
  "low-stock": {
    label: "Estoque Baixo",
    dotClass: "bg-stock-low animate-pulse",
    textClass: "text-stock-low",
  },
  "out-of-stock": {
    label: "Sem Estoque",
    dotClass: "bg-stock-out",
    textClass: "text-stock-out",
  },
  active: {
    label: "Ativo",
    dotClass: "bg-primary",
    textClass: "text-primary",
  },
  discontinued: {
    label: "Descontinuado",
    dotClass: "bg-muted-foreground",
    textClass: "text-muted-foreground",
  },
  archived: {
    label: "Arquivado",
    dotClass: "bg-muted-foreground/50",
    textClass: "text-muted-foreground/50",
  },
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, dotClass, textClass } = config[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className={cn("h-2 w-2 shrink-0 rounded-full", dotClass)} />
      <span className={textClass}>{label}</span>
    </span>
  );
}
