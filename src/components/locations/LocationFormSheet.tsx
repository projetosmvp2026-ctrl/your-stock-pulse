import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocations } from "@/hooks/useLocations";
import { useCreateLocation, useUpdateLocation } from "@/hooks/useInventoryMutations";
import type { Location, LocationType } from "@/types/inventory";

const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: "warehouse", label: "Armazém" },
  { value: "zone", label: "Zona" },
  { value: "aisle", label: "Corredor" },
  { value: "shelf", label: "Prateleira" },
  { value: "bin", label: "Compartimento" },
];

const VALID_PARENTS: Record<LocationType, LocationType[]> = {
  warehouse: [],
  zone: ["warehouse"],
  aisle: ["zone"],
  shelf: ["aisle"],
  bin: ["shelf"],
};

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  type: z.enum(["warehouse", "zone", "aisle", "shelf", "bin"]),
  parentId: z.string().nullable(),
  description: z.string().max(500),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface LocationFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editLocation?: Location | null;
}

export function LocationFormSheet({ open, onOpenChange, editLocation }: LocationFormSheetProps) {
  const { data: allLocations } = useLocations();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const isEdit = !!editLocation;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "warehouse" as LocationType,
      parentId: null,
      description: "",
      isActive: true,
    },
  });

  const watchedType = form.watch("type");

  const validParents = useMemo(() => {
    const allowedParentTypes = VALID_PARENTS[watchedType] ?? [];
    if (allowedParentTypes.length === 0) return [];
    return allLocations.filter(
      (l) => allowedParentTypes.includes(l.type) && l.id !== editLocation?.id,
    );
  }, [watchedType, allLocations, editLocation?.id]);

  // Reset parentId when type changes and current parent is invalid
  useEffect(() => {
    const currentParent = form.getValues("parentId");
    if (currentParent && !validParents.find((p) => p.id === currentParent)) {
      form.setValue("parentId", null);
    }
  }, [validParents, form]);

  // Populate form when editing
  useEffect(() => {
    if (open && editLocation) {
      form.reset({
        name: editLocation.name,
        type: editLocation.type,
        parentId: editLocation.parentId,
        description: editLocation.description ?? "",
        isActive: editLocation.isActive,
      });
    } else if (open) {
      form.reset({
        name: "",
        type: "warehouse",
        parentId: null,
        description: "",
        isActive: true,
      });
    }
  }, [open, editLocation, form]);

  function onSubmit(values: FormValues) {
    if (isEdit && editLocation) {
      updateMutation.mutate(
        { id: editLocation.id, updates: { name: values.name, type: values.type, parentId: values.parentId, description: values.description, isActive: values.isActive } },
        {
          onSuccess: () => {
            toast.success("Local atualizado");
            onOpenChange(false);
          },
          onError: (e) => toast.error(e.message || "Falha ao atualizar local."),
        },
      );
    } else {
      const newLocation: Location = {
        id: `loc-${Date.now()}`,
        name: values.name,
        type: values.type,
        parentId: values.parentId,
        description: values.description ?? "",
        address: "",
        isActive: values.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      createMutation.mutate(newLocation, {
        onSuccess: () => {
          toast.success("Local criado");
          onOpenChange(false);
        },
        onError: (e) => toast.error(e.message || "Falha ao criar local."),
      });
    }
  }

  const noParentAllowed = VALID_PARENTS[watchedType].length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar Local" : "Novo Local"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Atualize os detalhes do local." : "Adicione um novo local de armazenamento."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. Armazém Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATION_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!noParentAllowed && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local Pai</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o local pai" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">Nenhum</SelectItem>
                        {validParents.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição opcional" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                  <FormLabel className="cursor-pointer">Ativo</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isLoading || updateMutation.isLoading}>
                {isEdit ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
