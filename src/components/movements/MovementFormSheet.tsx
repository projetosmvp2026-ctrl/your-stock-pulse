import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MovementType } from "@/types/inventory";
import type { Item, Location, StockMovement } from "@/types/inventory";
import { useCreateMovement } from "@/hooks/useInventoryMutations";

interface MovementFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Item[];
  locations: Location[];
  /** Pre-selected item (locks the field) */
  preSelectedItemId?: string | null;
}

const TYPE_OPTIONS = [
  { value: MovementType.Received, label: "Recebido" },
  { value: MovementType.Shipped, label: "Enviado" },
  { value: MovementType.Adjusted, label: "Ajustado" },
  { value: MovementType.Transferred, label: "Transferido" },
];

function directionForType(type: MovementType): "in" | "out" | "configurable" {
  if (type === MovementType.Received) return "in";
  if (type === MovementType.Shipped) return "out";
  if (type === MovementType.Transferred) return "out";
  return "configurable";
}

export function MovementFormSheet({
  open,
  onOpenChange,
  items,
  locations,
  preSelectedItemId,
}: MovementFormSheetProps) {
  const { mutate, isLoading } = useCreateMovement();

  const [itemId, setItemId] = useState("");
  const [type, setType] = useState<MovementType>(MovementType.Received);
  const [quantity, setQuantity] = useState("");
  const [direction, setDirection] = useState<"in" | "out">("in");
  const [reference, setReference] = useState("");
  const [fromLocationId, setFromLocationId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when opening
  useEffect(() => {
    if (open) {
      setItemId(preSelectedItemId ?? "");
      setType(MovementType.Received);
      setQuantity("");
      setDirection("in");
      setReference("");
      setFromLocationId("");
      setToLocationId("");
      setErrors({});
    }
  }, [open, preSelectedItemId]);

  // Auto-set direction when type changes
  useEffect(() => {
    const dir = directionForType(type);
    if (dir !== "configurable") setDirection(dir);
  }, [type]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!itemId) errs.itemId = "Item é obrigatório";

    const num = Number(quantity);
    const qty = parseInt(quantity, 10);
    if (!quantity || isNaN(qty) || qty <= 0 || !Number.isInteger(num)) {
      errs.quantity = "Quantidade deve ser um número inteiro positivo";
    }

    const selectedItem = items.find((i) => i.id === itemId);

    // Shipped: cannot exceed current stock
    if (!errs.quantity && selectedItem && (type === MovementType.Shipped || (type === MovementType.Transferred))) {
      if (qty > selectedItem.currentStock) {
        errs.quantity = `Estoque insuficiente. Quantidade atual: ${selectedItem.currentStock}`;
      }
    }

    // Adjusted out: also cannot exceed current stock
    if (!errs.quantity && selectedItem && type === MovementType.Adjusted && direction === "out") {
      if (qty > selectedItem.currentStock) {
        errs.quantity = `Estoque insuficiente. Quantidade atual: ${selectedItem.currentStock}`;
      }
    }

    // Adjusted: note required
    if (type === MovementType.Adjusted && !reference.trim()) {
      errs.reference = "Motivo do ajuste é obrigatório";
    }

    // Transferred: both locations required and different
    if (type === MovementType.Transferred) {
      if (!fromLocationId) errs.fromLocationId = "Local de origem é obrigatório";
      if (!toLocationId) errs.toLocationId = "Local de destino é obrigatório";
      if (fromLocationId && toLocationId && fromLocationId === toLocationId) {
        errs.toLocationId = "Origem e destino devem ser diferentes";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const qty = parseInt(quantity, 10);
    const selectedItem = items.find((i) => i.id === itemId);
    const signedQty = direction === "in" ? qty : -qty;

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      itemId,
      type,
      quantity: signedQty,
      fromLocationId: type === MovementType.Transferred ? fromLocationId || null : null,
      toLocationId: type === MovementType.Transferred ? toLocationId || null : null,
      reference,
      notes: reference,
      performedBy: "Demo User",
      createdAt: new Date().toISOString(),
    };

    mutate(movement, {
      onSuccess: () => {
        const label = selectedItem?.name ?? itemId;
        const sign = direction === "in" ? "+" : "−";
        toast.success(`Movimentação registrada: ${sign}${qty} ${label} (${type})`, {
          duration: 5000,
        });
        onOpenChange(false);
      },
      onError: (e) => toast.error(e.message || "Falha ao registrar movimentação. Tente novamente."),
    });
  };

  const isTransfer = type === MovementType.Transferred;
  const isAdjusted = type === MovementType.Adjusted;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:max-w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Registrar Movimentação</SheetTitle>
          <SheetDescription>Registre uma movimentação de estoque para um item do inventário.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Item */}
          <div>
            <Label className="mb-1.5 block text-sm">Item *</Label>
            <Select
              value={itemId || "__none__"}
              onValueChange={(v) => setItemId(v === "__none__" ? "" : v)}
              disabled={!!preSelectedItemId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" disabled>Selecionar item</SelectItem>
                {items.map((i) => (
                  <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.itemId && <p className="mt-1 text-xs text-destructive">{errors.itemId}</p>}
          </div>

          {/* Type */}
          <div>
            <Label className="mb-1.5 block text-sm">Tipo de Movimentação</Label>
            <Select value={type} onValueChange={(v) => setType(v as MovementType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <Label className="mb-1.5 block text-sm">Quantidade *</Label>
            <Input
              type="number"
              min={1}
              step={1}
              placeholder="Digite a quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {errors.quantity && <p className="mt-1 text-xs text-destructive">{errors.quantity}</p>}
          </div>

          {/* Direction (only for adjusted) */}
          {isAdjusted && (
            <div>
              <Label className="mb-1.5 block text-sm">Direção</Label>
              <Select value={direction} onValueChange={(v) => setDirection(v as "in" | "out")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Entrada (adicionar estoque)</SelectItem>
                  <SelectItem value="out">Saída (remover estoque)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Transfer locations */}
          {isTransfer && (
            <>
              <div>
                <Label className="mb-1.5 block text-sm">Local de Origem</Label>
                <Select value={fromLocationId || "__none__"} onValueChange={(v) => setFromLocationId(v === "__none__" ? "" : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__" disabled>Selecionar local</SelectItem>
                    {locations.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fromLocationId && <p className="mt-1 text-xs text-destructive">{errors.fromLocationId}</p>}
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Local de Destino</Label>
                <Select value={toLocationId || "__none__"} onValueChange={(v) => setToLocationId(v === "__none__" ? "" : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__" disabled>Selecionar local</SelectItem>
                    {locations.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.toLocationId && <p className="mt-1 text-xs text-destructive">{errors.toLocationId}</p>}
              </div>
            </>
          )}

          {/* Reference note */}
          <div>
            <Label className="mb-1.5 block text-sm">Observação de Referência{isAdjusted ? " *" : ""}</Label>
            <Textarea
              placeholder={isAdjusted ? "Motivo do ajuste (obrigatório)" : "Observação ou referência opcional"}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              rows={3}
            />
            {errors.reference && <p className="mt-1 text-xs text-destructive">{errors.reference}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? "Salvando…" : "Salvar Movimentação"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
