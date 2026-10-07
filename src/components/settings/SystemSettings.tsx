import { useState } from "react";
import { RotateCcw, Info, Play } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/hooks/useDemo";
import { DemoWalkthrough } from "@/components/onboarding/DemoWalkthrough";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function SystemSettings() {
  const { isDemo, demoStore, resetDemoData } = useDemo();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [walkthroughActive, setWalkthroughActive] = useState(false);

  const items = demoStore?.getItems()?.length ?? 0;
  const suppliers = demoStore?.getSuppliers()?.length ?? 0;
  const locations = demoStore?.getLocations()?.length ?? 0;

  const handleReset = () => {
    resetDemoData();
    setConfirmOpen(false);
    toast.success("Dados de demonstração restaurados para os padrões");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados de demonstração</CardTitle>
          <CardDescription>Gerencie os dados iniciais de demonstração para testes e exploração.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDemo ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-semibold text-foreground">{items}</p>
                  <p className="text-xs text-muted-foreground">Itens</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-semibold text-foreground">{suppliers}</p>
                  <p className="text-xs text-muted-foreground">Fornecedores</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-semibold text-foreground">{locations}</p>
                  <p className="text-xs text-muted-foreground">Locais</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setWalkthroughActive(true)} className="gap-1.5">
                  <Play className="h-4 w-4" /> Iniciar tutorial guiado
                </Button>
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                  <RotateCcw className="mr-1.5 h-4 w-4" /> Redefinir dados de demonstração
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Controles de demonstração não disponíveis — entre no modo demonstração primeiro.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-4 w-4" />Sobre</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">Versão</dt><dd className="font-medium">1.0.0</dd>
            <dt className="text-muted-foreground">Plataforma</dt><dd className="font-medium">Drilling do Brasil</dd>
          </dl>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir Dados de Demonstração?</AlertDialogTitle>
            <AlertDialogDescription>Isso redefinirá todos os dados para os padrões. Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Redefinir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DemoWalkthrough active={walkthroughActive} onClose={() => setWalkthroughActive(false)} />
    </div>
  );
}
