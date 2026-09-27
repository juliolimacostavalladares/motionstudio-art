# Referências visuais — Motion Studio

Foram extraídos 12 frames distribuídos ao longo de cada vídeo e agrupados em contact sheets 4 × 3. A leitura é da esquerda para a direita, de cima para baixo. As imagens são materiais de análise; não são usadas no site.

| Vídeo | Duração | Intervalo aproximado | Contact sheet |
| --- | --- | --- | --- |
| 1107181889670287812 | 4,20 s | 0,35 s | [Galeria em perspectiva](pinsnap-1107181889670287812-story1.jpg) |
| 1109504058203386739 | 50,70 s | 4,23 s | [Abertura em leque](pinsnap-1109504058203386739-story1.jpg) |
| 852728510746190267 | 43,01 s | 3,58 s | [Composição editorial](pinsnap-852728510746190267-story1.jpg) |

## Leitura individual

**1107181889670287812:** headline central, grande área de respiro e uma sequência panorâmica de cartões que diminui em direção ao centro. A perspectiva organiza a profundidade. Aplicação: vitrine de interfaces em perspectiva, CTA central e movimento ambiente discreto.

**1109504058203386739:** tutorial de construção de uma composição no Figma. Os cartões partem de uma pilha central e se abrem em leque; título e CTA aparecem em etapas. Aplicação: entrada coordenada dos painéis laterais e pequeno deslocamento vertical. Não há reprodução de conteúdo do tutorial.

**852728510746190267:** página criativa que alterna galeria central, composições assimétricas, cartões sobrepostos e grandes blocos de cor. Aplicação: seções com ritmos distintos, cases em escalas diferentes, bloco lima para diferenciais e assinatura tipográfica grande no rodapé.

## Propósito e identidade preservados

Software house focada em web apps, mobile apps, MVPs e consultoria. O objetivo de conversão continua sendo o formulário de contato, com os campos e integração Splitforms originais. Fontes: Bricolage Grotesque e Sora. Cores: #0a0a0a, #111111, #d4e157 e #f5f5f5.

O documento legado em design-system/motion-studio/MASTER.md descreve Roboto e azul, divergindo da página atual. Neste redesign prevalece a instrução explícita de preservar a identidade do site fornecido.

Clientes, depoimentos e métricas são conteúdo preexistente, preservado sem validação externa. As novas interfaces são composições ilustrativas em HTML/CSS, identificadas como tal; não são capturas de projetos reais.

## Movimento e acessibilidade

Entrada em leque, flutuação suave do conjunto, hover discreto e revelação na rolagem. Controle de pausa para a animação contínua e respeito a prefers-reduced-motion. Menu móvel com Escape, contenção e restauração de foco; links de salto e status de formulário anunciado por tecnologia assistiva. Conteúdo legível mesmo sem JavaScript.

## Segunda análise: extração de movimento e implementação GSAP

Foram produzidas sequências mais densas para separar deslocamento, abertura e transição. Os tempos abaixo são aproximações da leitura visual, não valores extraídos do projeto original.

| Sequência | Amostragem | Observação | Aplicação |
| --- | --- | --- | --- |
| [Galeria, primeiros 4 s](motion-gallery-first-4s.jpg) | 4 fps, 16 frames | Os cartões atravessam uma faixa curva e mudam de perspectiva. Não é apenas flutuação vertical. | GSAP anima uma posição contínua em ciclo de 35 s; a posição determina inclinação, profundidade visual e altura de cada painel. |
| [Leque, primeiros 4 s](motion-fan-first-4s.jpg) | 4 fps, 16 frames | Um cartão sobe; outros aparecem empilhados; o conjunto se abre perto de 3,2–3,8 s. Título e CTA completam a composição. | Timeline: subida 0,85 s, surgimento das camadas, abertura 1,35 s com power3.inOut; texto e CTA em sequência. A espera da demonstração foi encurtada. |
| [Página editorial, primeiros 8 s](motion-editorial-first-8s.jpg) | 2 fps, 16 frames | Título aparece progressivamente, pilha abre, recolhe e reaparece como composição diagonal. Depois a página revela a seção seguinte. | Títulos revelados por máscaras de linha; grupos em sequência; cases assentam de inclinação/escala reduzida à posição final conforme a rolagem. |

Implementação em `../motion.js`, com GSAP 3.13.0 e ScrollTrigger locais em `../vendor/`. O movimento antigo via CSS e o loop manual foram substituídos. ScrollTrigger usa a rolagem nativa, sem travar a página. A galeria para fora da tela e quando a aba fica oculta. A pausa conclui entradas para preservar o acesso ao conteúdo e congela o movimento contínuo. `gsap.matchMedia` restaura o layout estático ao ativar movimento reduzido.

Referência técnica: [documentação oficial do ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
