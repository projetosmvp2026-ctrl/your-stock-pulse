import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, X, Check, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/hooks/useDemo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CustomFieldDefinition } from "@/types/inventory";

const MAX_FIELDS = 20;
const FIELD_TYPES = ["text", "number", "boolean", "select"] as const;

export function CustomFieldManager() {
  const { demoStore, bumpVersion, version } = useDemo();
  const fields = demoStore?.getCustomFieldDefs() ?? [];

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<CustomFieldDefinition["fieldType"]>("text");
  const [newOptions, setNewOptions] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CustomFieldDefinition | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (adding) nameRef.current?.focus(); }, [adding]);

  const handleAdd = () => {
    if (!newName.trim()) { toast.error("O nome do campo é obrigatório"); return; }
    if (!demoStore) return;
    const def: CustomFieldDefinition = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      fieldType: newType,
      options: newType === "select" ? newOptions.split(",").map((o) => o.trim()).filter(Boolean) : [],
      required: false,
      createdAt: new Date().toISOString(),
    };
    demoStore.addCustomFieldDef(def);
    bumpVersion();
    toast.success("Campo personalizado adicionado");
    setNewName(""); setNewType("text"); setNewOptions(""); setAdding(false);
  };

  const handleDelete = () => {
    if (!deleteTarget || !demoStore) return;
    demoStore.deleteCustomFieldDef(deleteTarget.id);
    bumpVersion();
    toast.success("Campo personalizado removido");
    setDeleteTarget(null);
  };

  const moveField = (index: number, direction: -1 | 1) => {
    if (!demoStore) return;
    const ids = fields.map((f) => f.id);
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= ids.length) return;
    [ids[index], ids[newIdx]] = [ids[newIdx], ids[index]];
    demoStore.reorderCustomFieldDefs(ids);
    bumpVersion();
  };

  if (fields.length === 0 && !adding) {
    return <EmptyState icon={ListChecks} title="Nenhum campo personalizado definido" description="Campos personalizados adicionam dados extras aos seus itens, como números de série ou condições." actionLabel="Adicionar Campo" onAction={() => setAdding(true)} />;
  }

  const atLimit = fields.length >= MAX_FIELDS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{fields.length}/{MAX_FIELDS} campos</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button size="sm" variant="outline" disabled={atLimit} onClick={() => setAdding(true)}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Adicionar Campo
                </Button>
              </span>
            </TooltipTrigger>
            {atLimit && <TooltipContent>Máximo de {MAX_FIELDS} campos personalizados atingido</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      {adding && (
        <div className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input ref={nameRef} placeholder="Nome do campo" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-8 text-sm flex-1" />
            <Select value={newType} onValueChange={(v) => setNewType(v as CustomFieldDefinition["fieldType"])}>
              <SelectTrigger className="h-8 w-[120px] text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {newType === "select" && (
            <Input placeholder="Opções (separadas por vírgula)" value={newOptions} onChange={(e) => setNewOptions(e.target.value)} className="h-8 text-sm" />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}><Check className="mr-1.5 h-3.5 w-3.5" />Salvar</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}><X className="mr-1.5 h-3.5 w-3.5" />Cancelar</Button>
          </div>
        </div>
      )}

      <div className="divide-y divide-border rounded-lg border border-border">
        {fields.map((f, i) => (
          <div key={f.id} className="flex items-center justify-between gap-2 p-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate max-w-[200px]">{f.name}</span>
              <Badge variant="outline" className="text-xs shrink-0">{f.fieldType}</Badge>
              {f.fieldType === "select" && f.options.length > 0 && (
                <span className="text-xs text-muted-foreground truncate">{f.options.join(", ")}</span>
              )}
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === 0} onClick={() => moveField(i, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === fields.length - 1} onClick={() => moveField(i, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(f)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>Os valores existentes dos itens para este campo ficarão órfãos. Isso não pode ser desfeito.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
