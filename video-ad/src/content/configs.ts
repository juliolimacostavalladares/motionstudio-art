export type ContentType =
  | 'ad'
  | 'organic'
  | 'engagement'
  | 'tools'
  | 'authority'
  | 'case'
  | 'community';

export interface ContentItem {
  icon: string;
  text: string;
  sub?: string;
  highlight?: boolean;
}

export interface VideoConfig {
  id: string;
  day: number;
  dayLabel: string;
  type: ContentType;
  typeLabel: string;
  accentColor: string; // e.g. '#d4e157'
  badge: string;
  headlineLines: string[];
  accentLineIndex: number; // which headline line is lime
  subCopy: string;
  scene2Title: string;
  items: ContentItem[];
  ctaHeadline: string;
  ctaLabel: string;
  metric?: string;
  footerNote?: string;
}

export const VIDEOS: VideoConfig[] = [
  // ─── DIA 1: PAID AD ───────────────────────────────────────────────
  {
    id: 'day1-ad',
    day: 1,
    dayLabel: 'Segunda-feira',
    type: 'ad',
    typeLabel: 'Anúncio Pago',
    accentColor: '#d4e157',
    badge: '⚡ Tráfego Pago',
    headlineLines: ['Planilha não é', 'sistema de gestão'],
    accentLineIndex: 1,
    subCopy:
      'Você perde tempo, dinheiro e clientes por falta de automação. Existe uma saída mais inteligente.',
    scene2Title: 'Você se identifica?',
    items: [
      { icon: '⚠', text: 'Processos manuais e repetitivos', sub: 'Equipe gasta horas em tarefas que deveriam ser automáticas' },
      { icon: '⚠', text: 'Dados fragmentados em planilhas', sub: 'Sem visibilidade em tempo real do negócio' },
      { icon: '⚠', text: 'Integrações que não conversam', sub: 'Cada ferramenta é uma ilha separada' },
      { icon: '✅', text: 'Motion Studio resolve isso', sub: 'Software sob medida, entrega em semanas', highlight: true },
    ],
    ctaHeadline: 'Transforme seu negócio com tecnologia sob medida',
    ctaLabel: 'Falar com especialista',
    metric: '+120% produtividade',
    footerNote: 'Sem contratos longos. Resultados em semanas.',
  },

  // ─── DIA 2: ORGÂNICO ──────────────────────────────────────────────
  {
    id: 'day2-organic',
    day: 2,
    dayLabel: 'Terça-feira',
    type: 'organic',
    typeLabel: 'Orgânico / SEO',
    accentColor: '#d4e157',
    badge: '📚 Conteúdo Educativo',
    headlineLines: ['3 sinais que você', 'precisa de um sistema'],
    accentLineIndex: 0,
    subCopy:
      'Se você se identifica com algum desses pontos, sua empresa está pronta para o próximo nível.',
    scene2Title: 'Sinais de alerta 🚨',
    items: [
      { icon: '01', text: 'Você tem mais de 3 planilhas pra gerenciar o mesmo processo', sub: 'Sinal claro de que falta centralização' },
      { icon: '02', text: 'Informações se perdem entre ferramentas', sub: 'WhatsApp, e-mail e planilha ao mesmo tempo' },
      { icon: '03', text: 'Escalar o negócio significaria contratar mais pessoas', sub: 'Automatizar é mais inteligente que contratar' },
    ],
    ctaHeadline: 'Salva esse vídeo e compartilha com seu sócio',
    ctaLabel: '💾 Salva esse vídeo',
    metric: '3 sinais identificados',
    footerNote: 'Siga para mais conteúdo sobre tecnologia para negócios',
  },

  // ─── DIA 3: ENGAJAMENTO ───────────────────────────────────────────
  {
    id: 'day3-engagement',
    day: 3,
    dayLabel: 'Quarta-feira',
    type: 'engagement',
    typeLabel: 'Engajamento',
    accentColor: '#d4e157',
    badge: '💬 Pergunta do dia',
    headlineLines: ['Qual trava mais', 'o seu negócio hoje?'],
    accentLineIndex: 1,
    subCopy:
      'Cada empresa tem seu ponto de travamento. Conta pra gente nos comentários — você vai se surpreender com as respostas.',
    scene2Title: 'Identifica o seu:',
    items: [
      { icon: '01', text: 'Processos 100% manuais', sub: 'Tudo depende de uma pessoa específica para funcionar' },
      { icon: '02', text: 'Dados espalhados em todo lugar', sub: 'Planilha, WhatsApp, e-mail — tudo separado' },
      { icon: '03', text: 'Ferramentas que não conversam', sub: 'Cada sistema é uma ilha isolada' },
      { icon: '04', text: 'Escalar significa contratar mais', sub: 'Sem tecnologia, crescer custa caro demais' },
    ],
    ctaHeadline: 'Conta nos comentários qual é a sua maior dor',
    ctaLabel: 'Comenta aqui em baixo',
    footerNote: 'Respondemos todos os comentários',
  },

  // ─── DIA 4: TOOLS GRATUITAS ───────────────────────────────────────
  {
    id: 'day4-tools',
    day: 4,
    dayLabel: 'Quinta-feira',
    type: 'tools',
    typeLabel: 'Software Gratuito',
    accentColor: '#d4e157',
    badge: '🛠 Ferramentas Gratuitas',
    headlineLines: ['4 ferramentas que usamos', 'com nossos clientes'],
    accentLineIndex: 0,
    subCopy:
      'Antes de construir qualquer software, ajudamos nossos clientes a mapear e entender seus processos com essas ferramentas — e são todas gratuitas.',
    scene2Title: 'Use agora, de graça:',
    items: [
      { icon: '🔵', text: 'Notion', sub: 'Centralizar processos, docs e tarefas da equipe', highlight: true },
      { icon: '🟡', text: 'Miro', sub: 'Mapear fluxos, jornadas e arquitetura visual' },
      { icon: '🟢', text: 'n8n (self-hosted)', sub: 'Automatizar tarefas entre sistemas sem código' },
      { icon: '🔴', text: 'Supabase', sub: 'Banco de dados e autenticação grátis para protótipos' },
    ],
    ctaHeadline: 'Quer um diagnóstico gratuito do seu processo?',
    ctaLabel: 'Quero uma análise',
    metric: '100% gratuitas',
    footerNote: 'Salva esse vídeo para usar de referência',
  },

  // ─── DIA 5: AUTORIDADE ────────────────────────────────────────────
  {
    id: 'day5-authority',
    day: 5,
    dayLabel: 'Sexta-feira',
    type: 'authority',
    typeLabel: 'Autoridade',
    accentColor: '#d4e157',
    badge: '🚀 Nosso Processo',
    headlineLines: ['Por que entregamos', 'em semanas, não meses'],
    accentLineIndex: 1,
    subCopy:
      'Não é mágica. É um processo testado e refinado em dezenas de projetos para eliminar o desperdício de tempo.',
    scene2Title: 'Como funciona na prática:',
    items: [
      { icon: '01', text: 'Descoberta (3 dias)', sub: 'Mapeamos seu processo, dores e objetivos reais' },
      { icon: '02', text: 'Planejamento (5 dias)', sub: 'Arquitetura, wireframes e escopo fechado sem surpresas' },
      { icon: '03', text: 'Desenvolvimento (4 semanas)', sub: 'Entregas semanais com feedback real e contínuo' },
      { icon: '04', text: 'Entrega & Suporte', sub: 'Go live com suporte ativo pós-lançamento' },
    ],
    ctaHeadline: 'Pronto para sair do planejamento e ir para o código?',
    ctaLabel: 'Fala com a gente',
    metric: 'Entrega em 5 semanas',
    footerNote: 'Siga para ver mais bastidores do nosso processo',
  },

  // ─── DIA 6: CASE REAL ─────────────────────────────────────────────
  {
    id: 'day6-case',
    day: 6,
    dayLabel: 'Sábado',
    type: 'case',
    typeLabel: 'Prova Social',
    accentColor: '#d4e157',
    badge: '📊 Case Real',
    headlineLines: ['MVP validado', 'em 3 semanas'],
    accentLineIndex: 0,
    subCopy:
      'Uma startup de gestão de agendamentos precisava validar sua ideia no mercado antes de investir pesado. Veja o que construímos juntos.',
    scene2Title: 'Os números do projeto:',
    items: [
      { icon: '⚡', text: '3 semanas', sub: 'Da ideia ao MVP em produção', highlight: true },
      { icon: '📈', text: '+40 usuários', sub: 'Primeiros clientes conquistados no lançamento' },
      { icon: '💰', text: 'R$ 28k', sub: 'Investimento total no desenvolvimento' },
      { icon: '🚀', text: 'Série Seed', sub: 'Captação iniciada após validação do produto' },
    ],
    ctaHeadline: 'Seu projeto pode ser o próximo caso de sucesso',
    ctaLabel: 'Conversa com a gente',
    metric: '3 semanas',
    footerNote: 'motionstudio.art — Agenda uma conversa',
  },

  // ─── DIA 7: COMUNIDADE ────────────────────────────────────────────
  {
    id: 'day7-community',
    day: 7,
    dayLabel: 'Domingo',
    type: 'community',
    typeLabel: 'Comunidade',
    accentColor: '#d4e157',
    badge: '🤝 Comunidade',
    headlineLines: ['O que você está', 'construindo essa semana?'],
    accentLineIndex: 1,
    subCopy:
      'Domingo é dia de planejar. Compartilha nos comentários o que você vai construir, lançar ou melhorar essa semana.',
    scene2Title: 'Reflexão da semana 💡',
    items: [
      { icon: '🎯', text: 'Defina 1 meta clara para a semana', sub: 'Foco gera resultado' },
      { icon: '⚙', text: 'Identifique 1 processo pra automatizar', sub: 'Cada hora salva é hora vendida' },
      { icon: '🤝', text: 'Conecte-se com 1 pessoa nova', sub: 'Networking gera oportunidades reais' },
      { icon: '📊', text: 'Revise os números da semana passada', sub: 'Dados guiam decisões inteligentes' },
    ],
    ctaHeadline: 'Conta pra gente nos comentários 👇',
    ctaLabel: '💬 O que você vai construir?',
    footerNote: 'Boa semana! — Motion Studio',
  },
];
