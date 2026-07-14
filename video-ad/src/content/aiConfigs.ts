import type { VideoConfig } from "./configs";

export const AI_VIDEOS: VideoConfig[] = [
  {
    id: "ai-tool-rebellion",
    day: 1,
    dayLabel: "AI Rebellion",
    type: "tools",
    typeLabel: "Ferramentas de AI",
    accentColor: "#d4e157",
    badge: "🔥 Revelação",
    headlineLines: ["A maioria das IAs", "é perda de tempo"],
    accentLineIndex: 1,
    subCopy: "Menos hype, mais resultado. Estas 3 ferramentas realmente geram lucro e eficiência para o seu negócio.",
    scene2Title: "As 3 que funcionam ⚙️",
    items: [
      { icon: "💬", text: "Manychat AI", sub: "Qualifica leads e vende no direct do Instagram no piloto automático." },
      { icon: "🔗", text: "n8n.io", sub: "Integra todas as suas ferramentas e bancos de dados sem custos abusivos." },
      { icon: "⚡", text: "Motion Studio", sub: "Cria anúncios premium em vídeo do seu software em minutos.", highlight: true }
    ],
    ctaHeadline: "Comente 'DETALHES' para receber o guia no direct",
    ctaLabel: "Comente agora",
    metric: "+340% eficiência",
    footerNote: "Links e tutoriais enviados direto na sua DM."
  },
  {
    id: "silent-leak-saas",
    day: 2,
    dayLabel: "Silent Leak",
    type: "ad",
    typeLabel: "Tráfego e Conversão",
    accentColor: "#d4e157",
    badge: "⚠️ Erro Comum",
    headlineLines: ["Como SaaS perdem", "dinheiro com anúncios"],
    accentLineIndex: 1,
    subCopy: "Gravar telas e editar cliques consome dias inteiros de trabalho de designers caros. Existe um jeito inteligente.",
    scene2Title: "O jeito inteligente 🚀",
    items: [
      { icon: "❌", text: "Gravar telas manualmente", sub: "Perda de tempo ajustando zoom e limpando dados sensíveis." },
      { icon: "❌", text: "Contratar editores caros", sub: "Atrasos na entrega e orçamentos estourados." },
      { icon: "✅", text: "Motion Studio", sub: "Cole a URL do seu produto e gere motion design profissional na hora.", highlight: true }
    ],
    ctaHeadline: "Crie anúncios com qualidade de agência em minutos",
    ctaLabel: "Comece grátis hoje",
    metric: "R$ 3.000 salvos",
    footerNote: "Experimente em motionstudio.art"
  },
  {
    id: "scaling-secret-digital",
    day: 3,
    dayLabel: "Scaling Secret",
    type: "authority",
    typeLabel: "Modo Escala",
    accentColor: "#d4e157",
    badge: "🚀 Escala Sem Contratar",
    headlineLines: ["Como escalar sem", "aumentar sua equipe"],
    accentLineIndex: 0,
    subCopy: "O segredo das empresas enxutas está na automação. Veja como reestruturar sua operação com inteligência artificial.",
    scene2Title: "Operação Enxuta ⚙️",
    items: [
      { icon: "🤖", text: "Suporte com agentes de IA", sub: "Atendimento imediato e qualificado 24/7." },
      { icon: "🔄", text: "Integrações automatizadas", sub: "Dados de vendas fluindo direto pro financeiro e CRM." },
      { icon: "🎥", text: "Escala de criativos de vídeo", sub: "Gere variações de anúncios em lote usando o Motion Studio.", highlight: true }
    ],
    ctaHeadline: "Pronto para automatizar e escalar seu negócio?",
    ctaLabel: "Falar com especialista",
    metric: "10x mais escala",
    footerNote: "Sem contratações caras. Automação pura."
  }
];
