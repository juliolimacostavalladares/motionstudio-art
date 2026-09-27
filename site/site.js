// Progressive enhancement: content stays visible if scripts or motion are unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncMotion() {
  document.body.classList.toggle('motion-paused', reducedMotion.matches);
}
reducedMotion.addEventListener('change', syncMotion);
syncMotion();

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
let menuOpen = false;
function setMenu(open, restoreFocus = true) {
  menuOpen = open;
  mobileMenu.inert = !open;
  mobileMenu.classList.toggle('open', open);
  menuOverlay.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) mobileMenu.querySelector('button').focus();
  else if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => setMenu(!menuOpen));
menuOverlay.addEventListener('click', () => setMenu(false));
mobileMenu.querySelector('.menu-close').addEventListener('click', () => setMenu(false));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  setMenu(false, false);
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
}));
document.addEventListener('keydown', event => {
  if (!menuOpen) return;
  if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
  if (event.key === 'Tab') {
    const items = [...mobileMenu.querySelectorAll('button,a[href]')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches && menuOpen) setMenu(false, false);
});
    // Form submission — Splitforms integration
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      // Loading state
      btn.textContent = 'Enviando...';
      btn.disabled = true;
      formMessage.className = 'form-message';
      formMessage.textContent = '';

      // Collect form data as JSON
      const data = {
        access_key: 'e66065887baa4eea8ae57b2889134b0d',
        subject: 'Novo contato - Motion Studio',
        name: contactForm.querySelector('[name="name"]').value,
        email: contactForm.querySelector('[name="email"]').value,
        company: contactForm.querySelector('[name="company"]').value,
        budget: contactForm.querySelector('[name="budget"]').value,
        message: contactForm.querySelector('[name="message"]').value,
        botcheck: contactForm.querySelector('[name="botcheck"]').checked,
      };

      try {
        const response = await fetch('https://splitforms.com/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          formMessage.className = 'form-message success';
          formMessage.textContent = '✓ Mensagem enviada! Retornamos em até 24 horas.';
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Erro ao enviar mensagem.');
        }
      } catch (err) {
        formMessage.className = 'form-message error';
        formMessage.textContent = '✕ ' + (err.message || 'Algo deu errado. Tente novamente ou nos envie um e-mail.');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;

      }
    });
