# Stackwise — continuidade no Cursor

Sistema de estoque em React 19, TanStack Start, TypeScript e Tailwind CSS v4.

## Abrir no Cursor

1. Conecte/exporte o projeto ao GitHub pelo Lovable e clone o repositório no computador, ou baixe o código pela opção disponível no editor.
2. Abra a pasta inteira no Cursor.
3. Instale Node.js 22 LTS e Bun 1.3.3 ou superior.
4. Copie `.env.example` para `.env` e preencha as configurações públicas do ambiente existente, de forma privada.
5. Execute no terminal:

```bash
bun install --frozen-lockfile
bun run dev
```

Abra `http://localhost:8080`. `/` e `/login` redirecionam para `/app/dashboard`, sem formulário de login nem página de apresentação.

## Comandos

```bash
bun run dev
bun run build
bun run preview
bun run lint
bunx playwright install chromium
bunx playwright test e2e/direct-access.spec.ts
```

A saída de produção usa Cloudflare Workers. O teste de acesso direto inicia o servidor quando necessário. Os arquivos `eval-session.tmp.*` são verificações históricas do antigo demo em inglês; o teste padrão atualizado é `direct-access.spec.ts`.

O acesso por `/`, `/login` e `/app/dashboard` foi verificado no navegador sem erros de execução. A execução do teste JavaScript neste ambiente não encontrou a versão correspondente do navegador; execute a instalação de Chromium acima antes de rodar esse teste no computador.

## Mapa do projeto

- `src/routes/`: páginas e navegação; `__root.tsx` contém os provedores compartilhados.
- `src/components/`: catálogo, pedidos, movimentações, fornecedores, análises e configurações.
- `src/contexts/AuthContext.tsx`: sessão e papel real da conta.
- `src/contexts/DemoContext.tsx` e `src/lib/demo-store.ts`: dados de trabalho locais usados pelas telas.
- `src/hooks/useInventoryData.ts` e `useInventoryMutations.ts`: leitura e alteração desse conjunto local.
- `src/integrations/`: clientes de conexão com Lovable Cloud.
- `src/styles.css`: fontes, tokens e estilos globais.
- `docs/`: requisitos históricos e referências; alguns descrevem o demo antigo.
- `docs/migrations/`: SQL de referência, não garantia de que todas as tabelas já foram aplicadas ao ambiente conectado.

## Limites atuais

- O painel abre sem autenticação; isso **não concede privilégios administrativos** nem remove as regras de acesso do Lovable Cloud.
- A autenticação existente ainda recupera sessões válidas e consulta o papel real em `user_roles`.
- O estoque das telas usa dados de exemplo **em memória**: alterações não são persistidas no Cloud e desaparecem ao recarregar a página.
- A gestão de usuários do armazenamento local não cria ou altera contas reais no Cloud.
- Os insights usam cálculos locais; não presuma integração remota de IA.
- Clonar o código não exporta usuários, senhas ou dados do Cloud, nem transfere a hospedagem.

**Próxima prioridade:** conectar o estoque à persistência real, revisar permissões no servidor e definir acesso seguro às operações privadas sem reintroduzir uma tela de login. Não atribua papel de administrador por e-mail fixo, chave privada no navegador ou armazenamento local.

## Segurança

`VITE_` torna o valor público no navegador. Use apenas endereço público, chave publicável e identificador público. Nunca inclua senha de usuário ou chave privada.

Antes do primeiro envio ao GitHub pelo Cursor, confirme que `.env` está ignorado e não rastreado. O arquivo de exclusões deste ambiente é gerenciado pela plataforma e não foi alterado aqui; acrescente localmente, se necessário:

```gitignore
.env
.env.*
!.env.example
test-results/
playwright-report/
*.tsbuildinfo
```

O Lovable Cloud não fornece senha do banco ou chave de serviço privada para exportação. Este preparo não migra o Cloud para outro serviço.

Não edite `src/routeTree.gen.ts`: as rotas são geradas. Não adicione React Router nem arquivos de redirecionamento de hospedagem para resolver rotas normais. Leia `AGENTS.md` e as regras do Cursor antes de solicitar alterações à IA.