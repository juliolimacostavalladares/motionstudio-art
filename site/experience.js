/* Business context drives the illustration; no invented ROI or project estimate. */
(() => {
  const choices = {
    operations: {
      problem: 'Pedidos espalhados entre planilhas e conversas dificultam saber o que está acontecendo.',
      value: 'Um sistema que reúne solicitações, responsáveis e status. Sua equipe acompanha a operação; seu cliente acompanha o pedido.',
      heading: 'Da solicitação à entrega.', kind: 'SOLICITAÇÃO', task: 'Novo pedido',
      columns: ['Recebido', 'Em andamento', 'Concluído'], firstTeam: 'Equipe comercial', history: 'Histórico atualizado',
      taskNote: 'Informações organizadas', active: 'Atendimento em curso', owner: 'Equipe de operação',
      complete: 'Entrega confirmada', bottom: 'Cada pedido com status e responsável.',
      phoneTitle: 'Seu pedido, sem incerteza.', phoneDescription: 'Acompanhe cada etapa.',
      phoneLabel: 'SEU PEDIDO', phoneMain: 'Tudo em movimento.', phoneStatus: 'Em andamento',
      notification: 'Status atualizado', notificationNote: 'A equipe já está cuidando de tudo.',
      brief: 'Quero organizar minha operação com um sistema sob medida. Hoje, meu principal desafio é: ',
    },
    validate: {
      problem: 'Você tem uma ideia de produto, mas precisa entender o que vale construir primeiro.',
      value: 'Um MVP focado na jornada principal. Pessoas reais experimentam a solução e o time usa o aprendizado para priorizar a próxima versão.',
      heading: 'Da hipótese ao primeiro uso.', kind: 'HIPÓTESE', task: 'Problema a validar',
      columns: ['Hipóteses', 'Em teste', 'Aprendizados'], firstTeam: 'Time de produto', history: 'Aprendizado para evoluir',
      taskNote: 'Público e objetivo definidos', active: 'Primeira versão em teste', owner: 'Time de produto',
      complete: 'Feedback recebido', bottom: 'Prioridades orientadas pelo uso do produto.',
      phoneTitle: 'Sua ideia nas mãos de quem usa.', phoneDescription: 'Uma jornada essencial, bem resolvida.',
      phoneLabel: 'PRIMEIRA EXPERIÊNCIA', phoneMain: 'Experimente. Conte pra gente.', phoneStatus: 'Versão de validação',
      notification: 'Feedback registrado', notificationNote: 'Cada aprendizado orienta a evolução.',
      brief: 'Quero validar uma ideia com um MVP. O problema que pretendo resolver é: ',
    },
    mobile: {
      problem: 'Seu cliente precisa ligar ou mandar mensagem para resolver algo que poderia fazer sozinho.',
      value: 'Uma experiência mobile conectada à sua operação. Agendamentos, solicitações e atualizações chegam ao cliente e à equipe com o mesmo contexto.',
      heading: 'Do agendamento ao atendimento.', kind: 'AGENDAMENTO', task: 'Novo horário solicitado',
      columns: ['Solicitado', 'Confirmado', 'Atendido'], firstTeam: 'Equipe de atendimento', history: 'Histórico atualizado',
      taskNote: 'Preferências do cliente', active: 'Atendimento confirmado', owner: 'Equipe de atendimento',
      complete: 'Histórico disponível', bottom: 'O cliente agenda. Sua equipe se organiza.',
      phoneTitle: 'Mais autonomia. Menos espera.', phoneDescription: 'Seu próximo atendimento, por aqui.',
      phoneLabel: 'SEU AGENDAMENTO', phoneMain: 'Quinta-feira, 10h30.', phoneStatus: 'Horário confirmado',
      notification: 'Lembrete disponível', notificationNote: 'Os detalhes sempre à mão.',
      brief: 'Quero melhorar a experiência dos meus clientes no celular. Hoje, eles precisam: ',
    },
  };
  const fieldMap = {
    heading: '.demo-heading', kind: '.demo-kind', task: '.demo-task', taskNote: '.demo-task-note',
    active: '.demo-active', owner: '.demo-owner', complete: '.demo-complete', bottom: '.demo-bottom',
    phoneTitle: '.demo-phone-title', phoneDescription: '.demo-phone-description', phoneLabel: '.demo-phone-label',
    phoneMain: '.demo-phone-main', phoneStatus: '.demo-phone-status', notification: '.demo-notification',
    notificationNote: '.demo-notification-note',
  };
  const stage = document.querySelector('.solution-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animate = window.gsap;
  const buttons = [...document.querySelectorAll('[data-solution]')];
  const steps = [...document.querySelectorAll('[data-step]')];
  let selected = 'operations';
  let navigateScenario = null;
  const keys = Object.keys(choices);
  const rail = document.createElement('div');
  rail.className = 'solution-rail';
  const sceneTemplate = stage.innerHTML;
  const scenes = keys.map(key => {
    const scene = document.createElement('div');
    scene.className = 'solution-scene';
    scene.dataset.solution = key;
    scene.innerHTML = sceneTemplate;
    const content = choices[key];
    Object.entries(fieldMap).forEach(([field, selector]) => { scene.querySelector(selector).textContent = content[field]; });
    scene.querySelectorAll('.workflow-labels > span').forEach((label, index) => { label.textContent = content.columns[index]; });
    scene.querySelector('.workflow-featured > small').textContent = content.columns[1].toUpperCase();
    scene.querySelector('.workflow-complete > small').textContent = content.columns[2].toUpperCase();
    scene.querySelector('.workflow-card > i').textContent = content.firstTeam;
    scene.querySelector('.workflow-complete > span').textContent = content.history;
    scene.querySelector('.solution-toolbar b span').textContent = key === 'validate' ? '/ produto' : key === 'mobile' ? '/ agenda' : '/ operação';
    scene.querySelector('.stage-caption').textContent = { operations: '01 / OPERAÇÃO ORGANIZADA', validate: '02 / IDEIA EM VALIDAÇÃO', mobile: '03 / ATENDIMENTO CONECTADO' }[key];
    rail.append(scene);
    return scene;
  });
  stage.replaceChildren(rail);
  const calendar = document.createElement('div');
  calendar.className = 'appointment-calendar';
  calendar.innerHTML = '<div class="calendar-days"><span>SEG <b>21</b></span><span>TER <b>22</b></span><span>QUA <b>23</b></span><span class="calendar-selected">QUI <b>24</b></span><span>SEX <b>25</b></span></div><div class="calendar-entry"><span>09:00</span><div>Atendimento concluído <small>Histórico disponível</small></div></div><div class="calendar-entry calendar-current"><span>10:30</span><div>Mariana · atendimento confirmado <small>Lembrete enviado para o aplicativo</small></div><b>✓</b></div><div class="calendar-entry"><span>14:00</span><div>Horário disponível <small>Pronto para um novo agendamento</small></div></div>';
  scenes[2].querySelector('.workflow-labels').remove();
  scenes[2].querySelector('.workflow-board').replaceWith(calendar);
  // Scene illustrations fit the space left by controls and contextual copy.
  const fitScene = () => {
    const phoneHeight = scenes[0].querySelector('.solution-phone').offsetHeight;
    stage.style.setProperty('--phone-fit', Math.min(1, Math.max(.25, (stage.clientHeight - 70) / phoneHeight)));
    stage.style.setProperty('--screen-fit', Math.min(1, Math.max(.35, (stage.clientHeight - 70) / 345)));
  };
  new ResizeObserver(fitScene).observe(stage);
  fitScene();
  let selectedStep = 0;
  let navigateDelivery = null;
  const deliveryViewer = document.createElement('div');
  deliveryViewer.className = 'delivery-viewer';
  const deliveryMap = document.querySelector('.delivery-map');
  deliveryMap.before(deliveryViewer);
  ['.delivery-map', '.process-steps', '.delivery-detail', '.process-contact'].forEach(selector => {
    deliveryViewer.append(document.querySelector(selector));
  });
  const details = [
    { name: 'DESCOBERTA', title: 'O problema certo. Antes da primeira linha.', output: 'Objetivos, prioridades e um escopo inicial alinhado ao desafio do seu negócio.', participation: 'Você compartilha a rotina, os gargalos e o que precisa mudar. Nós ajudamos a transformar isso em direção.' },
    { name: 'PLANEJAMENTO', title: 'Decisões claras. Um plano compartilhado.', output: 'Fluxos de uso, proposta de arquitetura e um cronograma de entregas para orientar o desenvolvimento.', participation: 'Revisamos juntos as prioridades e os caminhos do produto. Você entende o que será construído e por quê.' },
    { name: 'DESENVOLVIMENTO', title: 'O produto evolui. Você vê acontecer.', output: 'Versões parciais para experimentar, com revisão de código e testes ao longo do desenvolvimento.', participation: 'Você acompanha as demonstrações, testa as entregas e dá feedback para os próximos ciclos.' },
    { name: 'ENTREGA & EVOLUÇÃO', title: 'No ar é o começo. Evoluir faz parte.', output: 'Produto em produção, acompanhamento do lançamento e próximos passos para sua evolução.', participation: 'Observamos o uso, ouvimos as pessoas e priorizamos melhorias junto com você.' },
  ];
  const path = document.querySelector('.delivery-path');
  const marker = document.querySelector('.delivery-marker');
  const nodes = [...document.querySelectorAll('.delivery-nodes circle')];
  const length = path.getTotalLength();
  const checkpoints = [0, .32, .64, 1];
  const pathState = { progress: 0 };
  nodes.forEach((node, index) => {
    const point = path.getPointAtLength(checkpoints[index] * length);
    node.setAttribute('cx', point.x);
    node.setAttribute('cy', point.y);
  });
  path.style.strokeDasharray = String(length);
  function drawPath() {
    path.style.strokeDashoffset = String(length * (1 - pathState.progress));
    const point = path.getPointAtLength(pathState.progress * length);
    marker.setAttribute('cx', point.x);
    marker.setAttribute('cy', point.y);
    nodes.forEach((node, index) => node.classList.toggle('is-complete', index <= selectedStep));
  }
  drawPath();

  function revealChange(elements) {
    if (!animate || reduced.matches) return;
    gsap.fromTo(elements, { y: 10, opacity: .35 }, { y: 0, opacity: 1, duration: .4, stagger: .035, ease: 'power2.out', overwrite: true });
  }
  function selectScenario(index) {
    const key = keys[index];
    if (selected === key) return;
    selected = key;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.solution === key)));
    document.querySelector('#solution-problem').textContent = choices[key].problem;
    document.querySelector('#solution-value').textContent = choices[key].value;
  }
  function showScenario(index) {
    if (navigateScenario) { navigateScenario(index); return; }
    selectScenario(index);
    if (animate && !reduced.matches) gsap.to(rail, { xPercent: -index * 100, duration: .75, ease: 'power3.inOut', overwrite: true });
    else rail.style.transform = `translateX(${-index * 100}%)`;
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => showScenario(index)));
  document.querySelector('.solution-cta').addEventListener('click', () => {
    const message = document.querySelector('#message');
    // Only seed an empty draft; never replace something the visitor has written.
    if (!message.value.trim()) message.value = choices[selected].brief;
  });
  function selectDelivery(index, fromScroll = false) {
    if (selectedStep === index) return;
    const direction = index > selectedStep ? 1 : -1;
    selectedStep = index;
    const content = details[selectedStep];
    steps.forEach((item, position) => item.setAttribute('aria-pressed', String(position === index)));
    document.querySelector('#delivery-number').textContent = `0${selectedStep + 1} / ${content.name}`;
    document.querySelector('#delivery-title').textContent = content.title;
    document.querySelector('#delivery-output').textContent = content.output;
    document.querySelector('#delivery-participation').textContent = content.participation;
    if (!fromScroll) {
      if (animate && !reduced.matches) gsap.to(pathState, { progress: checkpoints[selectedStep], duration: .9, ease: 'power2.inOut', onUpdate: drawPath, overwrite: true });
      else { pathState.progress = checkpoints[selectedStep]; drawPath(); }
    }
    if (animate && !reduced.matches) gsap.fromTo('.delivery-detail > div', { x: direction * 36, opacity: .25 }, { x: 0, opacity: 1, duration: .4, stagger: .035, ease: 'power2.out', overwrite: true });
  }
  steps.forEach((button, index) => button.addEventListener('click', () => {
    if (navigateDelivery) navigateDelivery(index);
    else selectDelivery(index);
  }));

  // Arrow keys complement native Tab / Enter / Space behavior.
  [buttons, steps].forEach(group => group.forEach((button, index) => {
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? group.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + group.length) % group.length;
      group[next].focus();
      group[next].click();
    });
  }));
  if (!animate || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const title = gsap.timeline({
      scrollTrigger: { trigger: '.solution-heading', start: 'top 82%', toggleActions: 'play none none reverse' },
    });
    title.from('.solution-title-line', { yPercent: 112, autoAlpha: 0, duration: .9, stagger: .13, ease: 'power3.out' })
      .fromTo('.word-highlight', { backgroundSize: '0% 100%', color: '#0a0a0a' }, { backgroundSize: '100% 100%', color: '#d4e157', duration: .8, ease: 'power2.inOut' }, .5);
    gsap.set(rail, { xPercent: 0 });
    const horizontal = gsap.timeline({
      scrollTrigger: {
        id: 'solution-horizontal',
        trigger: '.solution-viewer',
        start: 'top 16px',
        end: () => '+=' + Math.max(innerHeight * 2.6, 1500),
        pin: true,
        anticipatePin: 1,
        scrub: .55,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        const index = Math.max(0, Math.min(2, Math.round(-Number(gsap.getProperty(rail, 'xPercent')) / 100)));
        selectScenario(index);
      },
    });
    horizontal.to(rail, { xPercent: -100, duration: 1, ease: 'power1.inOut' }, .2)
      .to(rail, { xPercent: -200, duration: 1, ease: 'power1.inOut' }, 1.6)
      .to({}, { duration: .2 }, 2.6);
    // Pin progress and buttons share the same timeline, so scroll cannot undo a click.
    navigateScenario = index => {
      const trigger = horizontal.scrollTrigger;
      const stops = [.02, .5, .98];
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * stops[index], behavior: 'instant' });
      ScrollTrigger.update();
    };
    const delivery = gsap.timeline({
      scrollTrigger: {
        id: 'delivery-horizontal', trigger: deliveryViewer, start: 'top 16px',
        end: () => '+=' + Math.max(innerHeight * 3, 1800),
        pin: true, scrub: .55, anticipatePin: 1, invalidateOnRefresh: true,
      },
      onUpdate: () => {
        let nearest = 0;
        checkpoints.forEach((point, index) => {
          if (Math.abs(point - pathState.progress) < Math.abs(checkpoints[nearest] - pathState.progress)) nearest = index;
        });
        selectDelivery(nearest, true);
        drawPath();
      },
    });
    delivery.fromTo(pathState, { progress: 0 }, { progress: checkpoints[1], duration: 1, ease: 'power1.inOut' }, .2)
      .to(pathState, { progress: checkpoints[2], duration: 1, ease: 'power1.inOut' }, 1.6)
      .to(pathState, { progress: 1, duration: 1, ease: 'power1.inOut' }, 3)
      .to({}, { duration: .2 }, 4);
    navigateDelivery = index => {
      const trigger = delivery.scrollTrigger;
      const stops = [.01, 1.4 / 4.2, 2.8 / 4.2, .99];
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * stops[index], behavior: 'instant' });
      ScrollTrigger.update();
    };
    return () => { navigateScenario = null; navigateDelivery = null; };
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    rail.style.transform = `translateX(${-keys.indexOf(selected) * 100}%)`;
    gsap.killTweensOf(pathState);
    pathState.progress = checkpoints[selectedStep];
    drawPath();
    const targets = document.querySelectorAll('#solution-problem,#solution-value,.demo-heading,.workflow-card,.demo-phone-title,.phone-order,.phone-notification,.delivery-detail > div');
    gsap.killTweensOf(targets);
    gsap.set(targets, { clearProps: 'transform,opacity' });
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
