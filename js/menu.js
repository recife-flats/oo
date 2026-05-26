/* ============================================================
   RECIFE FLATS — MENU PAGE-FLIP
   
   Animação de catálogo: o #site-content "vira" como uma página
   de livro, revelando o #menu-page que estava atrás.
   
   Dependência: GSAP 3.12+ (gsap.min.js)
   
   Exporta: initMenu() para ser chamado no app principal.
============================================================ */

function initMenu() {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Estado & seletores ── */
  let menuIsOpen   = false;
  let menuTimeline = null;

  const siteContent  = document.getElementById('site-content');
  const menuPage     = document.getElementById('menu-page');
  const menuToggle   = document.getElementById('menu-toggle');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuLinks    = document.querySelectorAll('[data-menu-link]');

  if (!siteContent || !menuPage || !menuToggle) return;

  /* Estado inicial: menu escondido */
  gsap.set(menuPage, {
    opacity: 0,
    xPercent: 5,
    rotateY: 6,
    transformPerspective: 1400,
  });

  /* ── Construção da timeline ── */
  function buildMenuTimeline() {
    const DUR  = 0.88;
    const EASE = 'power3.inOut';

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: EASE, duration: DUR },

      onStart() {
        menuPage.classList.add('is-active');
        menuPage.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      },

      onReverseComplete() {
        menuPage.classList.remove('is-active');
        menuPage.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      },
    });

    /* ATO 1: Página vira/recua */
    tl.to(siteContent, {
      rotateY:              -9,
      scale:                0.91,
      x:                    '-2.5%',
      transformPerspective: 1400,
      transformOrigin:      'right center',
      borderRadius:         '14px',
      filter:               'brightness(0.65) saturate(0.8)',
      duration:             DUR,
    }, 0);

    /* ATO 2: Catálogo emerge */
    tl.fromTo(menuPage,
      {
        xPercent:             5,
        rotateY:              6,
        opacity:              0,
        transformPerspective: 1400,
        transformOrigin:      'right center',
      },
      {
        xPercent: 0,
        rotateY:  0,
        opacity:  1,
        duration: DUR,
        ease:     EASE,
      },
      0
    );

    /* ATO 3a: Links surgem de baixo */
    tl.fromTo('.menu-nav-link',
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity:  1,
        duration: 0.65,
        ease:     'power3.out',
        stagger:  0.07,
      },
      DUR * 0.42
    );

    /* ATO 3b: Cabeçalho, rodapé, conteúdo direito */
    tl.fromTo(
      ['.menu-header', '.menu-footer', '.menu-right-content'],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.09 },
      DUR * 0.48
    );

    return tl;
  }

  /* ── Abrir ── */
  function openMenu() {
    if (menuIsOpen) return;
    menuIsOpen = true;
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (!menuTimeline) menuTimeline = buildMenuTimeline();
    menuTimeline.play();
  }

  /* ── Fechar ── */
  function closeMenu() {
    if (!menuIsOpen) return;
    menuIsOpen = false;
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuTimeline.reverse();
  }

  /* ── Events ── */
  menuToggle.addEventListener('click', () => menuIsOpen ? closeMenu() : openMenu());
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
  menuLinks.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuIsOpen) closeMenu();
  });

  /* ── Announcement bar close ── */
  const annClose = document.getElementById('ann-close');
  const annBar   = document.getElementById('announcement-bar');
  if (annClose && annBar) {
    annClose.addEventListener('click', () => annBar.classList.add('hidden'));
  }
}
