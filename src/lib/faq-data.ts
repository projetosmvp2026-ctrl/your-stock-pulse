export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const FAQ_DATA: FaqCategory[] = [
  {
    title: "Primeiros Passos",
    items: [
      { question: "O que é o Drilling do Brasil?", answer: "Drilling do Brasil é um sistema de gestão de estoque que ajuda você a acompanhar níveis de estoque, gerenciar fornecedores, criar pedidos de compra e obter insights por meio de análises." },
      { question: "Como entro no modo demonstração?", answer: "Clique em 'Experimentar Demonstração' na página inicial. O modo demonstração pré-carrega dados de exemplo para você explorar todos os recursos sem criar uma conta." },
      { question: "Como navego pelo aplicativo?", answer: "Use a barra lateral (desktop) ou a barra de navegação inferior (mobile) para alternar entre as seções. Pressione CMD+K para abrir a paleta de comandos e fazer buscas rápidas." },
      { question: "Posso redefinir os dados de demonstração?", answer: "Sim! Vá em Configurações → Sistema e clique em 'Redefinir Dados de Demonstração' para restaurar todos os dados de exemplo ao estado original." },
      { question: "Quais perfis estão disponíveis?", answer: "Três perfis: Administrador (acesso total), Gerente (pode gerenciar estoque e pedidos de compra) e Solicitante (pode navegar pelo catálogo e enviar solicitações)." },
    ],
  },
  {
    title: "Gestão de Estoque",
    items: [
      { question: "Como adiciono um novo item?", answer: "Vá até Catálogo e clique em '+ Novo Item'. Preencha o nome, SKU, categoria e detalhes de estoque. O SKU deve ser único." },
      { question: "O que significam as cores de status do estoque?", answer: "Verde (Em Estoque): quantidade acima do ponto de reposição. Âmbar (Estoque Baixo): quantidade igual ou abaixo do ponto de reposição. Vermelho (Sem Estoque): quantidade zero." },
      { question: "Como registro uma movimentação de estoque?", answer: "Vá até Movimentações e clique em 'Registrar Movimentação'. Selecione o tipo (Recebido, Enviado, Ajustado ou Transferido), escolha o item e informe a quantidade." },
      { question: "O que é ponto de reposição?", answer: "O limite mínimo de quantidade que dispara um alerta de estoque baixo. Quando o estoque atinge ou fica abaixo desse nível, o item aparece em 'Precisa de Atenção'." },
      { question: "Como atualizo itens em massa?", answer: "No Catálogo, selecione vários itens usando as caixas de seleção e use a barra de ações em massa para atualizar categoria, arquivar ou excluir os itens selecionados." },
    ],
  },
  {
    title: "Pedidos de Compra",
    items: [
      { question: "Como crio um pedido de compra?", answer: "Vá até Pedidos de Compra e clique em 'Criar Pedido'. Selecione um fornecedor, adicione itens com quantidades e custos, e depois envie." },
      { question: "Quais são os status de um pedido de compra?", answer: "Rascunho (ainda não enviado), Enviado (enviado ao fornecedor), Parcialmente Recebido (alguns itens recebidos), Totalmente Recebido (todos os itens recebidos), Cancelado." },
      { question: "Como recebo um envio?", answer: "Abra um pedido de compra enviado e clique em 'Receber Envio'. Informe as quantidades recebidas para cada item. O estoque é atualizado automaticamente." },
      { question: "Posso imprimir um pedido de compra?", answer: "Sim, abra a visualização detalhada do pedido e clique no ícone de impressão. Isso gera uma visualização imprimível com todos os detalhes do pedido." },
    ],
  },
  {
    title: "Relatórios e Análises",
    items: [
      { question: "Quais relatórios estão disponíveis?", answer: "Visão Geral de Estoque (por categoria e status), Tendências de Movimentação (ao longo do tempo), Análise de Giro, painéis de Desempenho de Fornecedores e detalhamentos de Custos." },
      { question: "Posso exportar dados?", answer: "Sim, use o botão 'Exportar CSV' na página de Análises ou o botão de exportação nas tabelas de dados para baixar seus dados." },
      { question: "O que são os Insights de IA?", answer: "Recursos com inteligência artificial, incluindo sugestões de reposição com base em padrões de demanda, detecção de anomalias em movimentações incomuns e busca em linguagem natural." },
    ],
  },
  {
    title: "Conta e Configurações",
    items: [
      { question: "Como gerencio usuários?", answer: "Administradores podem ir em Configurações → Usuários para convidar novos usuários, alterar perfis e desativar contas." },
      { question: "Como altero categorias?", answer: "Vá em Configurações → Categorias para adicionar, renomear ou excluir categorias. Itens de uma categoria excluída ficam sem categoria." },
      { question: "Onde estão as preferências de notificação?", answer: "Clique no ícone de sino no cabeçalho e, em seguida, no ícone de engrenagem para personalizar quais notificações você recebe." },
    ],
  },
];
