/* ============================================================
   RECIFE FLATS — ANIMATIONS
   
   - Navbar: transparente sobre hero / frosted glass ao rolar
   - Hero: entrada sequencial (badge → título → desc → CTAs)
   - Scroll reveal via IntersectionObserver
   - Parallax backgrounds via GSAP ScrollTrigger
   
   Dependências: GSAP 3.12+ com ScrollTrigger
============================================================ */

function initAnimations() {

  /* ══════════════════════════════════════════
     NAVBAR: estado visual baseado na posição
  ══════════════════════════════════════════ */
  const navbar  = document.getElementById('navbar');
  const heroSec = document.getElementById('hero');

  if (navbar && heroSec) {
    new IntersectionObserver(entries => {
      const isOver = entries[0].isIntersecting;
      navbar.classList.toggle('over-hero', isOver);
      navbar.classList.toggle('scrolled', !isOver);
    }, { threshold: 0.05 }).observe(heroSec);
  }

  /* ══════════════════════════════════════════
     HERO: animação de entrada sequencial
  ══════════════════════════════════════════ */
  const heroTitle = document.querySelector('.hero-title');

  /* Texto letra a letra */
  if (heroTitle) {
    const walkNode = node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach(ch => {
          const s = document.createElement('span');
          s.className = 'letter';
          s.style.display = 'inline-block';
          s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
          frag.appendChild(s);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        [...node.childNodes].forEach(walkNode);
      }
    };
    [...heroTitle.childNodes].forEach(walkNode);

    gsap.fromTo(heroTitle.querySelectorAll('.letter'),
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.022,
        delay: 0.35,
        scrollTrigger: {
          trigger: heroTitle,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  /* Sequência: badge → desc → ctas → stats */
  const heroTl = gsap.timeline({ delay: 0.1 });

  const heroElements = [
    { sel: '.hero-badge',       y: 20, dur: 0.6 },
    { sel: '.hero-description', y: 24, dur: 0.7, offset: '-=0.2' },
    { sel: '.hero-cta-group',   y: 24, dur: 0.7, offset: '-=0.4' },
    { sel: '.hero-stats',       y: 20, dur: 0.7, offset: '-=0.3' },
  ];

  heroElements.forEach(({ sel, y, dur, offset }) => {
    const el = document.querySelector(sel);
    if (el) {
      heroTl.fromTo(el,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: dur, ease: 'power2.out' },
        offset || undefined
      );
    }
  });

  /* Cards do lado direito */
  gsap.utils.toArray('.hero-img-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 + (i * 20), scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.4 + (i * 0.2) }
    );
  });

  /* Floating review card */
  const floatCard = document.querySelector('.hero-float-card');
  if (floatCard) {
    gsap.fromTo(floatCard,
      { opacity: 0, x: 20, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)', delay: 1.0 }
    );
  }

  /* Parallax no background do hero */
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ══════════════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
     Ativa classes .visible em .reveal, .reveal-left, .reveal-scale
  ══════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ══════════════════════════════════════════
     PARALLAX BACKGROUNDS (genérico)
     Qualquer .bg-circle-deco ou elemento com data-parallax
     recebe um leve movimento no scroll.
  ══════════════════════════════════════════ */
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || -30;
    gsap.to(el, {
      y: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.section') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}
