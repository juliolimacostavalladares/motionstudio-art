// Reference-video motion, orchestrated by GSAP and native-scroll ScrollTrigger.
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const panels = gsap.utils.toArray('.showcase-panel');
  const media = gsap.matchMedia();

  // Retain semantic headings and their original nodes inside line masks.
  document.querySelectorAll('.hero h1,.section-title,.cta-content h2').forEach(title => {
    const lines = [[]];
    [...title.childNodes].forEach(node => {
      if (node.nodeName === 'BR') lines.push([]);
      else lines[lines.length - 1].push(node);
    });
    title.replaceChildren();
    lines.forEach((nodes, index) => {
      const mask = document.createElement('span');
      const line = document.createElement('span');
      mask.className = 'title-mask';
      line.className = 'title-line';
      line.append(...nodes);
      mask.append(line);
      title.append(mask);
      if (index < lines.length - 1) title.append(document.createTextNode(' '));
    });
  });

  media.add('(prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('gsap-motion');
    const entrances = [], scrollAnimations = [], triggers = [], progressLines = [];
    let introDone = false, heroVisible = true;
    let paused = document.body.classList.contains('motion-paused');
    const state = { spread: 0, rise: 0, reveal: 0, travel: 0 };
    const spacing = 450, circumference = panels.length * spacing;
    const wrap = gsap.utils.wrap(-circumference / 2, circumference / 2);
    const widths = panels.map(panel => panel.offsetWidth);
    gsap.set(panels, { x: 0, y: 0, rotation: 0, rotationY: 0, scale: 1, opacity: 0, zIndex: 1, transformPerspective: 1400, force3D: true });
    const setters = panels.map(panel => ({
      x: gsap.quickSetter(panel, 'x', 'px'),
      y: gsap.quickSetter(panel, 'y', 'px'),
      rotation: gsap.quickSetter(panel, 'rotation', 'deg'),
      rotationY: gsap.quickSetter(panel, 'rotationY', 'deg'),
      scale: gsap.quickSetter(panel, 'scale'),
      opacity: gsap.quickSetter(panel, 'opacity'),
      zIndex: gsap.quickSetter(panel, 'zIndex'),
    }));

    function drawGallery() {
      panels.forEach((panel, index) => {
        const x = wrap((index - 2) * spacing - state.travel);
        const arc = Math.min(Math.abs(x) / 850, 1.4);
        const position = x * state.spread + (index - 2) * 9 * (1 - state.spread);
        const y = 12 + Math.pow(arc, 1.5) * 12 * state.spread + (1 - state.rise) * 100;
        const angle = x / 850 * 4 * state.spread;
        const turn = -x / 850 * 8 * state.spread;
        const scale = .76 + .24 * state.spread - arc * .015 * state.spread;
        setters[index].x(740 + position - widths[index] / 2);
        setters[index].y(y);
        setters[index].rotation(angle);
        setters[index].rotationY(turn);
        setters[index].scale(scale);
        setters[index].opacity(index === 2 ? state.rise : state.reveal);
        setters[index].zIndex(20 - Math.round(Math.abs(x) / 100));
      });
    }
    drawGallery();
    // Reference 1: a constant conveyor along a curved perspective path.
    const conveyor = gsap.to(state, {
      travel: circumference, duration: 35, repeat: -1, ease: 'none',
      paused: true, onUpdate: drawGallery,
    });
    function syncConveyor() {
      conveyor.paused(paused || !introDone || !heroVisible || document.hidden);
    }
    // Reference 2: rise as a stack, unfold, reveal copy and call to action.
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => {
      introDone = true;
      syncConveyor();
    } });
    intro.from('.hero h1 .title-line', { yPercent: 115, duration: .95, stagger: .12 }, 0)
      .from('.hero-eyebrow', { y: 12, autoAlpha: 0, duration: .6 }, .05)
      .to(state, { rise: 1, duration: .85, onUpdate: drawGallery }, .12)
      .to(state, { reveal: 1, duration: .35, onUpdate: drawGallery }, .45)
      .to(state, { spread: 1, duration: 1.35, ease: 'power3.inOut', onUpdate: drawGallery }, .65)
      .from('.hero-intro > p', { y: 18, autoAlpha: 0, duration: .7 }, .65)
      .from('.hero-intro > .btn', { y: 20, autoAlpha: 0, duration: .6 }, .85);
    triggers.push(ScrollTrigger.create({
      trigger: '.hero', start: 'top bottom', end: 'bottom top',
      onToggle: self => { heroVisible = self.isActive; syncConveyor(); },
      onRefresh: self => { heroVisible = self.isActive; syncConveyor(); },
    }));

    // Reference 3: clipped headings and staggered groups through the page.
    function reveal(elements, trigger, vars = {}) {
      if (!elements.length) return;
      const animation = gsap.from(elements, {
        y: 30, autoAlpha: 0, duration: .8, stagger: .09, ease: 'power3.out', ...vars,
        scrollTrigger: { trigger, start: 'top 88%', once: true },
      });
      entrances.push(animation);
      triggers.push(animation.scrollTrigger);
    }
    document.querySelectorAll('.section-header').forEach(header => {
      reveal([...header.querySelectorAll('.title-line')], header, { y: 0, yPercent: 110, autoAlpha: 1, stagger: .11 });
      reveal([...header.querySelectorAll('.section-label,.section-subtitle')], header, { stagger: .12 });
    });
    ['.trust-logos','.services-grid','.diff-grid','.testimonials-grid'].forEach(selector => {
      const group = document.querySelector(selector);
      reveal([...group.children], group);
    });
    reveal([...document.querySelectorAll('.cta-content > .section-label,.cta-content .title-line,.cta-content > p,.contact-form')], '.cta-content');
    reveal([...document.querySelectorAll('.footer-wordmark')], '.footer-wordmark', { y: 45, duration: 1.1 });
    document.querySelectorAll('.case-card').forEach(card => {
      const animation = gsap.from(card.querySelector('.case-header'), {
        scale: 1.06, transformOrigin: 'center center', ease: 'none',
        scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 35%', scrub: .65 },
      });
      scrollAnimations.push(animation);
      triggers.push(animation.scrollTrigger);
      reveal([card.querySelector('.case-body')], card.querySelector('.case-body'));
    });

    function syncPause() {
      paused = document.body.classList.contains('motion-paused');
      if (paused) {
        // Complete entrances: pausing must never strand content offscreen.
        intro.progress(1).pause();
        entrances.forEach(animation => animation.progress(1).pause());
        triggers.forEach(trigger => trigger.disable(false));
        scrollAnimations.forEach(animation => animation.pause());
      } else {
        triggers.forEach(trigger => { if (!trigger.vars.once) trigger.enable(); });
        ScrollTrigger.refresh();
      }
      syncConveyor();
    }
    const observer = new MutationObserver(syncPause);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', syncConveyor);
    if (paused) syncPause();
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncConveyor);
      progressLines.forEach(line => line.remove());
      document.documentElement.classList.remove('gsap-motion');
    };
  });
})();
