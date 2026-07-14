import type { VideoConfig } from "./configs";

export const AI_VIDEOS: VideoConfig[] = [
  {
    id: "ai-tool-rebellion",
    day: 1,
    dayLabel: "AI Integration",
    type: "tools",
    typeLabel: "Integração de IA",
    accentColor: "#d4e157",
    badge: "⚡ IA Integrada",
    headlineLines: ["A maioria das IAs", "é perda de tempo"],
    accentLineIndex: 1,
    subCopy: "Ferramentas isoladas geram retrabalho. O segredo para lucrar com IA é conectá-la diretamente aos seus sistemas.",
    scene2Title: "Como criar valor real ⚙️",
    items: [
      { icon: "01", text: "Conecte APIs ao banco de dados", sub: "Chega de copiar e colar prompts manualmente." },
      { icon: "02", text: "Crie agentes no seu processo", sub: "IA executando tarefas reais de suporte e vendas." },
      { icon: "✅", text: "Motion Studio desenvolve", sub: "Criamos seu sistema customizado com IA integrada em semanas.", highlight: true }
    ],
    ctaHeadline: "Conecte IA à operação real do seu negócio",
    ctaLabel: "Falar com especialista",
    metric: "+150% produtividade",
    footerNote: "Sistemas sob medida. motionstudio.art"
  },
  {
    id: "silent-leak-saas",
    day: 2,
    dayLabel: "SaaS MVP",
    type: "ad",
    typeLabel: "Desenvolvimento SaaS",
    accentColor: "#d4e157",
    badge: "🚀 Lançamento de SaaS",
    headlineLines: ["Quer criar um SaaS", "de IA? Pare e leia"],
    accentLineIndex: 0,
    subCopy: "Não crie apenas mais um wrapper de ChatGPT. Para ter valor de mercado, você precisa de banco de dados e UX proprietários.",
    scene2Title: "O caminho correto 📈",
    items: [
      { icon: "❌", text: "Evite ideias genéricas", sub: "Qualquer um pode copiar um wrapper de prompt simples." },
      { icon: "💡", text: "Foque em dores reais", sub: "Resolva problemas complexos de nichos de mercado." },
      { icon: "✅", text: "Desenvolvemos seu MVP", sub: "Do planejamento ao código em produção em semanas.", highlight: true }
    ],
    ctaHeadline: "Valide sua ideia com tecnologia robusta e rápida",
    ctaLabel: "Quero criar meu SaaS",
    metric: "MVP em 3 semanas",
    footerNote: "motionstudio.art — Do design ao código"
  },
  {
    id: "scaling-secret-digital",
    day: 3,
    dayLabel: "Automation Leak",
    type: "authority",
    typeLabel: "Sistemas Sob Medida",
    accentColor: "#d4e157",
    badge: "⚠️ Gargalo Operacional",
    headlineLines: ["Sua empresa ainda", "usa processos de 2015?"],
    accentLineIndex: 1,
    subCopy: "Funcionários copiando dados entre planilhas e e-mails é sinal de que você está jogando dinheiro e escala no lixo.",
    scene2Title: "A transformação digital 🔗",
    items: [
      { icon: "01", text: "Elimine planilhas manuais", sub: "Centralize todas as informações em um único dashboard." },
      { icon: "02", text: "Automatize integrações", sub: "Sincronização instantânea de leads, vendas e finanças." },
      { icon: "✅", text: "Seu sistema exclusivo", sub: "Criamos softwares escaláveis e focados no seu processo.", highlight: true }
    ],
    ctaHeadline: "Substitua processos manuais por sistemas eficientes",
    ctaLabel: "Solicitar diagnóstico grátis",
    metric: "Zero retrabalho",
    footerNote: "Automação real para escala. motionstudio.art"
  }
];
