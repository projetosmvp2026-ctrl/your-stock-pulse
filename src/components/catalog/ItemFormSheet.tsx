import { useEffect } from "react";
import { HelpTooltip } from "@/components/shared/HelpTooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Item, Category, Supplier, Location } from "@/types/inventory";
import { ItemStatus } from "@/types/inventory";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  description: z.string(),
  categoryId: z.string(),
  supplierId: z.string(),
  locationId: z.string(),
  unit: z.string(),
  currentStock: z.coerce.number().min(0),
  reorderPoint: z.coerce.number().min(0),
  reorderQuantity: z.coerce.number().min(0),
  costPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  status: z.nativeEnum(ItemStatus),
});

type FormValues = z.infer<typeof schema>;

interface ItemFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
  categories: Category[];
  suppliers: Supplier[];
  locations: Location[];
  existingSkus: string[];
  onSave: (data: Partial<Item>) => void;
  loading?: boolean;
}

export function ItemFormSheet({
  open,
  onOpenChange,
  item,
  categories,
  suppliers,
  locations,
  existingSkus,
  onSave,
  loading,
}: ItemFormSheetProps) {
  const isEdit = !!item;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors }, setError } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      categoryId: "",
      supplierId: "",
      locationId: "",
      unit: "each",
      currentStock: 0,
      reorderPoint: 0,
      reorderQuantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      status: ItemStatus.Active,
    },
  });

  useEffect(() => {
    if (open && item) {
      reset({
        name: item.name,
        sku: item.sku,
        description: item.description,
        categoryId: item.categoryId ?? undefined,
        supplierId: item.supplierId ?? undefined,
        locationId: item.locationId ?? undefined,
        unit: item.unit,
        currentStock: item.currentStock,
        reorderPoint: item.reorderPoint,
        reorderQuantity: item.reorderQuantity,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        status: item.status,
      });
    } else if (open) {
      reset();
    }
  }, [open, item, reset]);

  const onSubmit = (data: FormValues) => {
    const skuConflict = existingSkus.filter((s) => s === data.sku);
    const allowed = isEdit && item?.sku === data.sku ? 1 : 0;
    if (skuConflict.length > allowed) {
      setError("sku", { message: "SKU já existe" });
      return;
    }
    onSave({
      ...data,
      categoryId: data.categoryId || null,
      supplierId: data.supplierId || null,
      locationId: data.locationId || null,
    });
  };

  const inputCls = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary";
  const labelCls = "text-sm font-medium";
  const errCls = "text-xs text-destructive";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetTitle>{isEdit ? "Editar Item" : "Novo Item"}</SheetTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Basic Info */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Informações Básicas</legend>
            <div>
              <label className={labelCls}>Nome *</label>
              <input {...register("name")} className={inputCls} />
              {errors.name && <p className={errCls}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={`${labelCls} flex items-center gap-1`}>SKU * <HelpTooltip text="Identificador único para este item. Deve ser diferente de todos os outros itens." /></label>
              <input {...register("sku")} className={inputCls} placeholder="STK-XXXX" />
              {errors.sku && <p className={errCls}>{errors.sku.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Descrição</label>
              <textarea {...register("description")} rows={2} className={`${inputCls} h-auto py-2`} />
            </div>
          </fieldset>

          {/* Classification */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Classificação</legend>
            <div>
              <label className={labelCls}>Categoria</label>
              <Select value={watch("categoryId") ?? ""} onValueChange={(v) => setValue("categoryId", v || "")}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={labelCls}>Unidade de Medida</label>
              <input {...register("unit")} className={inputCls} placeholder="unidade, kg, caixa…" />
            </div>
          </fieldset>

          {/* Stock Settings */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Configurações de Estoque</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Estoque Atual</label>
                <input type="number" {...register("currentStock")} className={inputCls} />
              </div>
              <div>
                <label className={`${labelCls} flex items-center gap-1`}>Ponto de Reposição <HelpTooltip text="Quantidade mínima antes de disparar um alerta de estoque baixo. Defina com base na sua taxa de uso típica." /></label>
                <input type="number" {...register("reorderPoint")} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Quantidade de Reposição</label>
              <input type="number" {...register("reorderQuantity")} className={inputCls} />
            </div>
          </fieldset>

          {/* Pricing */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preços</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Custo Unitário</label>
                <input type="number" step="0.01" {...register("costPrice")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Preço de Venda</label>
                <input type="number" step="0.01" {...register("sellingPrice")} className={inputCls} />
              </div>
            </div>
          </fieldset>

          {/* Assignment */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Atribuição</legend>
            <div>
              <label className={labelCls}>Fornecedor</label>
              <Select value={watch("supplierId") ?? ""} onValueChange={(v) => setValue("supplierId", v || "")}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar fornecedor" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={labelCls}>Local</label>
              <Select value={watch("locationId") ?? ""} onValueChange={(v) => setValue("locationId", v || "")}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar local" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </fieldset>

          {/* Status */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</legend>
            <Select value={watch("status")} onValueChange={(v) => setValue("status", v as ItemStatus)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ItemStatus.Active}>Ativo</SelectItem>
                <SelectItem value={ItemStatus.Discontinued}>Descontinuado</SelectItem>
                <SelectItem value={ItemStatus.Archived}>Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </fieldset>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Salvando…" : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
