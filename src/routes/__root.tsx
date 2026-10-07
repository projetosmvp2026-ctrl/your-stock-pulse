import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";


import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Drilling do Brasil" },
      { name: "description", content: "Gerencie o estoque com rastreamento em tempo real, gestão de fornecedores, pedidos de compra e previsão de demanda com IA. Inclui acesso baseado em função, suporte a código de barras" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Drilling do Brasil" },
      { property: "og:description", content: "Gerencie o estoque com rastreamento em tempo real, gestão de fornecedores, pedidos de compra e previsão de demanda com IA. Inclui acesso baseado em função, suporte a código de barras" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Drilling do Brasil" },
      { name: "twitter:description", content: "Gerencie o estoque com rastreamento em tempo real, gestão de fornecedores, pedidos de compra e previsão de demanda com IA. Inclui acesso baseado em função, suporte a código de barras" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <DemoProvider>
        <RoleProvider>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
          <Toaster position="bottom-right" richColors />
        </RoleProvider>
      </DemoProvider>
    </AuthProvider>
  );
}

