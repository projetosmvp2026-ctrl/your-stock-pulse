import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemo } from "@/hooks/useDemo";
import { toast } from "sonner";
import type { NotificationPrefs } from "@/lib/demo/index";

const PREF_LABELS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: "low_stock", label: "Alertas de Estoque Baixo", description: "Quando um item fica abaixo do ponto de reposição" },
  { key: "zero_stock", label: "Alertas de Estoque Zerado", description: "Quando um item atinge estoque zero" },
  { key: "po_reminder", label: "Lembretes de Pedido", description: "Quando a entrega de um pedido está a até 3 dias" },
  { key: "po_overdue", label: "Pedido Atrasado", description: "Quando um pedido ultrapassa a data prevista de entrega" },
  { key: "request_update", label: "Atualizações de Solicitação", description: "Quando o status de uma solicitação de estoque muda" },
];

interface NotificationPreferencesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPreferences({ open, onOpenChange }: NotificationPreferencesProps) {
  const { demoStore, bumpVersion } = useDemo();
  const [prefs, setPrefs] = useState<NotificationPrefs>(() =>
    demoStore?.getNotificationPrefs() ?? {
      low_stock: true, zero_stock: true, po_reminder: true, po_overdue: true, request_update: true,
    },
  );

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    demoStore?.setNotificationPrefs(prefs);
    bumpVersion();
    toast.success("Preferências de notificação salvas.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Settings2 className="h-4 w-4" />
            Preferências de Notificação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {PREF_LABELS.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div className="min-w-0">
                <Label htmlFor={`pref-${key}`} className="text-sm font-medium">{label}</Label>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Switch
                id={`pref-${key}`}
                checked={prefs[key]}
                onCheckedChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSave} className="w-full mt-2">Salvar Preferências</Button>
      </DialogContent>
    </Dialog>
  );
}
