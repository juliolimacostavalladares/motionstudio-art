import type { VideoConfig } from "./configs";

export const AI_VIDEOS: VideoConfig[] = [
  {
    id: "ai-tool-rebellion",
    day: 1,
    dayLabel: "AI Agent Stack",
    type: "tools",
    typeLabel: "Stack de IA",
    accentColor: "#d4e157",
    badge: "⚡ Dev Stack 2026",
    headlineLines: ["A maioria das IAs", "é perda de tempo"],
    accentLineIndex: 1,
    subCopy: "Ferramentas isoladas geram retrabalho. O segredo está nos agentes autônomos e APIs integrados diretamente ao seu código.",
    scene2Title: "O Stack Definitivo ⚙️",
    items: [
      { icon: "CL", text: "Claude (Anthropic)", sub: "A inteligência mais avançada para escrita, refatoração e lógica de código." },
      { icon: "OA", text: "OpenAI (ChatGPT)", sub: "APIs robustas para geração de texto, análise de dados e automações complexas." },
      { icon: "MS", text: "Motion Studio", sub: "Desenvolvemos sua infraestrutura customizada com IA integrada sob medida.", highlight: true }
    ],
    ctaHeadline: "Integre agentes de IA à engenharia real do seu negócio",
    ctaLabel: "Solicitar projeto sob medida",
    metric: "10x mais velocity",
    footerNote: "motionstudio.art — Dev de Elite"
  },
  {
    id: "silent-leak-saas",
    day: 2,
    dayLabel: "SaaS Architecture",
    type: "ad",
    typeLabel: "Arquitetura SaaS",
    accentColor: "#d4e157",
    badge: "🚀 Engenharia SaaS",
    headlineLines: ["Construindo o novo", "SaaS com Agentes"],
    accentLineIndex: 1,
    subCopy: "Esqueça wrappers genéricos. O SaaS moderno usa orquestradores robustos e APIs para resolver problemas complexos.",
    scene2Title: "Arquitetura de Elite 📈",
    items: [
      { icon: "CL", text: "Claude (Anthropic)", sub: "Acelera a escrita de rotas, schemas e migrações no backend." },
      { icon: "OA", text: "OpenAI (ChatGPT)", sub: "Garante processamento dinâmico de linguagem natural na sua aplicação." },
      { icon: "MS", text: "Motion Studio", sub: "Transformamos sua ideia em um produto escalável com engenharia de ponta.", highlight: true }
    ],
    ctaHeadline: "Valide seu produto com stack tecnológico imbatível",
    ctaLabel: "Criar meu SaaS agora",
    metric: "MVP em 3 semanas",
    footerNote: "motionstudio.art — Do design ao código"
  },
  {
    id: "scaling-secret-digital",
    day: 3,
    dayLabel: "System Automation",
    type: "authority",
    typeLabel: "Automação Operacional",
    accentColor: "#d4e157",
    badge: "⚠️ Retorno Financeiro",
    headlineLines: ["Sua operação ainda", "depende de cliques?"],
    accentLineIndex: 1,
    subCopy: "Processos manuais travam seu crescimento. Automatize workflows de engenharia e negócios com agentes e APIs.",
    scene2Title: "Orquestração Autônoma 🔗",
    items: [
      { icon: "CL", text: "Claude (Anthropic)", sub: "Automatiza correções de bugs e monitoramento de logs no terminal." },
      { icon: "OA", text: "OpenAI (ChatGPT)", sub: "Processa entradas de clientes e responde e-mails de forma inteligente." },
      { icon: "MS", text: "Motion Studio", sub: "Construímos seu ecossistema de automação interna sob medida.", highlight: true }
    ],
    ctaHeadline: "Substitua planilhas e cliques por agentes de IA autônomos",
    ctaLabel: "Solicitar diagnóstico gratuito",
    metric: "Zero intervenção",
    footerNote: "Sistemas autônomos. motionstudio.art"
  }
];
