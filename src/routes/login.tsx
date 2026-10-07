import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: () => { throw redirect({ to: "/app/dashboard", replace: true }); },
  head: () => ({ meta: [
    { title: "Acesso direto — Drilling do Brasil" },
    { name: "description", content: "Acesso direto ao painel de estoque Drilling do Brasil." },
    { property: "og:title", content: "Acesso direto — Drilling do Brasil" },
    { property: "og:description", content: "Acesso direto ao painel de estoque Drilling do Brasil." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
