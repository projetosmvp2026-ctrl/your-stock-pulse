import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCreatePurchaseOrder, useUpdatePurchaseOrder } from "@/hooks/useInventoryMutations";
import { OrderStatus } from "@/types/inventory";
import type { PurchaseOrder, Supplier, PurchaseOrderItem, Item } from "@/types/inventory";
import { LineItemsEditor, type LineItemRow } from "./LineItemsEditor";
import { LowStockSuggestions } from "./LowStockSuggestions";

const STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.Draft]: "Rascunho",
  [OrderStatus.Submitted]: "Enviado",
  [OrderStatus.Partial]: "Parcialmente Recebido",
  [OrderStatus.Received]: "Totalmente Recebido",
  [OrderStatus.Cancelled]: "Cancelado",
};

const schema = z.object({
  supplierId: z.string().min(1, "Fornecedor é obrigatório"),
  expectedDelivery: z.string().min(1, "Data de entrega prevista é obrigatória"),
  notes: z.string(),
});

type FormValues = z.infer<typeof schema>;

function generatePONumber(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `PO-${year}-${seq}`;
}

interface PurchaseOrderFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder?: PurchaseOrder | null;
  suppliers: Supplier[];
  items: Item[];
}

export function PurchaseOrderFormSheet({
  open,
  onOpenChange,
  purchaseOrder,
  suppliers,
  items,
}: PurchaseOrderFormSheetProps) {
  const isEdit = !!purchaseOrder;
  const createPO = useCreatePurchaseOrder();
  const updatePO = useUpdatePurchaseOrder();
  const [lineItems, setLineItems] = useState<LineItemRow[]>([]);
  const [lineError, setLineError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { supplierId: "", expectedDelivery: "", notes: "" },
  });

  useEffect(() => {
    if (open) {
      if (purchaseOrder) {
        form.reset({
          supplierId: purchaseOrder.supplierId,
          expectedDelivery: purchaseOrder.expectedDelivery?.slice(0, 10) ?? "",
          notes: purchaseOrder.notes ?? "",
        });
        setLineItems(
          purchaseOrder.items.map((li) => ({
            id: li.id,
            itemId: li.itemId,
            quantity: li.quantityOrdered,
            unitCost: li.unitCost,
          })),
        );
      } else {
        form.reset({ supplierId: "", expectedDelivery: "", notes: "" });
        setLineItems([]);
      }
      setLineError("");
    }
  }, [open, purchaseOrder, form]);

  function onSubmit(values: FormValues) {
    if (lineItems.length === 0) {
      setLineError("Pelo menos um item é obrigatório");
      return;
    }
    if (lineItems.some((r) => !r.itemId)) {
      setLineError("Todos os itens devem ter um item selecionado");
      return;
    }
    setLineError("");

    const now = new Date().toISOString();
    const poItems: PurchaseOrderItem[] = lineItems.map((r) => ({
      id: r.id,
      purchaseOrderId: "",
      itemId: r.itemId,
      quantityOrdered: r.quantity,
      quantityReceived: 0,
      unitCost: r.unitCost,
    }));
    const totalCost = poItems.reduce((s, i) => s + i.quantityOrdered * i.unitCost, 0);

    if (isEdit && purchaseOrder) {
      poItems.forEach((p) => (p.purchaseOrderId = purchaseOrder.id));
      updatePO.mutate(
        {
          id: purchaseOrder.id,
          updates: {
            supplierId: values.supplierId,
            expectedDelivery: new Date(values.expectedDelivery).toISOString(),
            notes: values.notes,
            items: poItems,
            totalCost,
            updatedAt: now,
          },
        },
        {
          onSuccess: () => { toast.success(`${purchaseOrder.orderNumber} atualizado`); onOpenChange(false); },
          onError: (e) => toast.error(e.message || "Falha ao atualizar pedido de compra."),
        },
      );
    } else {
      const orderNumber = generatePONumber();
      const id = crypto.randomUUID();
      poItems.forEach((p) => (p.purchaseOrderId = id));
      const newPO: PurchaseOrder = {
        id,
        orderNumber,
        supplierId: values.supplierId,
        status: OrderStatus.Draft,
        items: poItems,
        totalCost,
        expectedDelivery: new Date(values.expectedDelivery).toISOString(),
        notes: values.notes,
        createdBy: "demo-user",
        createdAt: now,
        updatedAt: now,
      };
      createPO.mutate(newPO, {
        onSuccess: () => { toast.success(`${orderNumber} criado`); onOpenChange(false); },
        onError: (e) => toast.error(e.message || "Falha ao criar pedido de compra."),
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? `Editar ${purchaseOrder?.orderNumber}` : "Novo Pedido de Compra"}
          </SheetTitle>
          <SheetDescription>
            {isEdit ? "Atualize os detalhes do pedido de compra." : "Crie um novo pedido de compra para um fornecedor."}
          </SheetDescription>
        </SheetHeader>

        {isEdit && purchaseOrder && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge variant="outline">{STATUS_LABEL[purchaseOrder.status]}</Badge>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.filter((s) => s.isActive).map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedDelivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrega Prevista *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl><Textarea {...field} rows={2} placeholder="Observações adicionais…" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {!isEdit && (
              <LowStockSuggestions
                items={items}
                supplierId={form.watch("supplierId")}
                lineItems={lineItems}
                onAdd={(row) => setLineItems((prev) => [...prev, row])}
              />
            )}

            <LineItemsEditor
              items={items}
              lineItems={lineItems}
              onChange={setLineItems}
              error={lineError}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{isEdit ? "Salvar Alterações" : "Criar Pedido"}</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
