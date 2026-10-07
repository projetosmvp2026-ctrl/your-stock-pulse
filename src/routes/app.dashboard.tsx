import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Package, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardReorderSection } from "@/components/insights/DashboardReorderSection";
import { DashboardAnomalySection } from "@/components/insights/DashboardAnomalySection";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";

import { useStockSummary } from "@/hooks/useInventoryData";
import { useAlertGenerator } from "@/hooks/useStockAlertGenerator";
import { useDemo } from "@/hooks/useDemo";
import { useOnboarding, type TourStep } from "@/hooks/useOnboarding";

const TOUR_STEPS: TourStep[] = [
  { title: "Bem-vindo ao Stackwise!", description: "Vamos fazer um tour rápido pelos principais recursos. Isso leva apenas um minuto." },
  { target: "sidebar", title: "Navegação", description: "Use a barra lateral para alternar entre seções — catálogo, movimentações, fornecedores e mais." },
  { target: "metrics", title: "Saúde do estoque", description: "A saúde do seu estoque em um relance — total de SKUs, contagem de itens em estoque, estoque baixo e sem estoque." },
  { target: "needs-attention", title: "Precisa de atenção", description: "Itens que precisam de ação aparecem aqui — estoque baixo, pedidos atrasados e solicitações pendentes." },
  { target: "search", title: "Paleta de comandos", description: "Pressione CMD+K (ou Ctrl+K) para buscar qualquer coisa — itens, fornecedores, pedidos e mais." },
  { title: "Tudo pronto!", description: "Explore o app ou faça o tour guiado para aprender o fluxo principal. Boa gestão!" },
];

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{"title": "Painel — Stackwise"}, {"name": "description", "content": "Resumo do estoque, atividades recentes e alertas no painel Stackwise."}, {"property": "og:title", "content": "Painel — Stackwise"}, {"property": "og:description", "content": "Resumo do estoque, atividades recentes e alertas no painel Stackwise."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
});

function DashboardPage() {
  const { data: summary } = useStockSummary();
  const { demoStore, isDemo } = useDemo();
  useAlertGenerator();

  const items = demoStore?.getItems() ?? [];
  const movements = demoStore?.getMovements() ?? [];
  const suppliers = demoStore?.getSuppliers() ?? [];

  const tour = useOnboarding("dashboard");
  

  // Auto-start tour on first demo visit
  useEffect(() => {
    if (isDemo && !tour.hasCompleted) {
      const timer = setTimeout(() => tour.startTour(), 500);
      return () => clearTimeout(timer);
    }
  }, [isDemo, tour.hasCompleted]);

  const handleTourComplete = () => {
    tour.completeTour();
    toast.success("Tour concluído! Explore livremente ou inicie o passo a passo.");
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground">Bem-vindo de volta — aqui está a visão geral do seu estoque.</p>
      </div>

      <div data-tour="metrics" className="rounded-xl border border-border bg-card p-3 shadow-xs">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total de SKUs" value={summary.total} accentColor="neutral" icon={Package} />
          <MetricCard label="Em estoque" value={summary.inStock} accentColor="healthy" icon={CheckCircle2} />
          <MetricCard label="Estoque baixo" value={summary.lowStock} accentColor="warning" icon={AlertTriangle} />
          <MetricCard label="Sem estoque" value={summary.outOfStock} accentColor="danger" icon={XCircle} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div data-tour="needs-attention" className="min-h-0"><NeedsAttention /></div>
        <div className="min-h-0"><RecentActivity /></div>
      </div>

      <DashboardAnomalySection movements={movements} items={items} />
      <DashboardReorderSection items={items} movements={movements} suppliers={suppliers} />

      <OnboardingTour
        steps={TOUR_STEPS}
        currentStep={tour.currentStep}
        isActive={tour.isActive}
        onNext={tour.next}
        onBack={tour.back}
        onSkip={tour.skipTour}
        onComplete={handleTourComplete}
      />

      
    </div>
  );
}
