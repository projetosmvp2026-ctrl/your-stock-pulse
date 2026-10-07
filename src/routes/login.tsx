import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: () => { throw redirect({ to: "/app/dashboard", replace: true }); },
  head: () => ({ meta: [
    { title: "Acesso direto — Stackwise" },
    { name: "description", content: "Acesso direto ao painel de estoque Stackwise." },
    { property: "og:title", content: "Acesso direto — Stackwise" },
    { property: "og:description", content: "Acesso direto ao painel de estoque Stackwise." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
