import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDemo } from "@/hooks/useDemo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FACTORY = { reorderPoint: 10, leadTimeDays: 7, safetyMultiplier: 1.5, orderQuantity: 25 };

export function ReorderDefaults() {
  const { demoStore, bumpVersion } = useDemo();
  const stored = demoStore?.getReorderDefaults() ?? FACTORY;

  const [values, setValues] = useState(stored);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setValues(stored); }, [demoStore]);

  const set = (key: keyof typeof values, v: string) => {
    setValues((prev) => ({ ...prev, [key]: Number(v) || 0 }));
  };

  const handleSave = () => {
    if (values.reorderPoint < 0 || values.leadTimeDays < 1 || values.safetyMultiplier < 1 || values.orderQuantity < 1) {
      toast.error("Corrija os erros de validação"); return;
    }
    setSaving(true);
    demoStore?.setReorderDefaults(values);
    bumpVersion();
    setTimeout(() => { setSaving(false); toast.success("Padrões de reposição salvos"); }, 300);
  };

  const handleReset = () => {
    setValues(FACTORY);
    demoStore?.setReorderDefaults(FACTORY);
    bumpVersion();
    toast.success("Padrões restaurados");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Padrões de Reposição</CardTitle>
        <CardDescription>Padrões globais aplicados a novos itens, salvo substituição.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Ponto de Reposição Padrão</Label>
            <Input type="number" min={0} value={values.reorderPoint} onChange={(e) => set("reorderPoint", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Prazo de Entrega Padrão (dias)</Label>
            <Input type="number" min={1} value={values.leadTimeDays} onChange={(e) => set("leadTimeDays", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Multiplicador de Estoque de Segurança</Label>
            <Input type="number" min={1} step={0.1} value={values.safetyMultiplier} onChange={(e) => set("safetyMultiplier", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Quantidade de Pedido Padrão</Label>
            <Input type="number" min={1} value={values.orderQuantity} onChange={(e) => set("orderQuantity", e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
          <Button variant="ghost" onClick={handleReset}>Restaurar Padrões</Button>
        </div>
      </CardContent>
    </Card>
  );
}
