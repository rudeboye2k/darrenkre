// Mobile nav toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu after tapping a link (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header: transparent over the hero, solid once scrolled
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll-reveal: gently fade/slide elements in as they enter the viewport
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealSelectors = [
      '.section-head', '.card', '.listing', '.fl-card', '.press-card',
      '.why-item', '.building', '.about-media', '.about-copy', '.value-inner'
    ];
    var revealEls = document.querySelectorAll(revealSelectors.join(','));
    revealEls.forEach(function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Contact form: open the visitor's mail client (Outlook, etc.) pre-filled
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      var get = function (n) {
        var el = contactForm.querySelector('[name="' + n + '"]');
        return el ? el.value.trim() : '';
      };
      var name = get('name');
      var subject = 'Website inquiry' + (name ? ' from ' + name : '');
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + get('email') + '\n' +
        'Phone: ' + get('phone') + '\n\n' +
        'Message:\n' + get('message') + '\n';
      window.location.href =
        'mailto:darren@darrenkre.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  // Keep the footer year current
  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Leadership bio modals
  var triggers = document.querySelectorAll('.leader[data-bio]');
  var lastFocused = null;

  function openModal(modal) {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    var closeBtn = modal.querySelector('.bio-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var modal = document.getElementById('bio-' + trigger.getAttribute('data-bio'));
      if (modal) openModal(modal);
    });
  });

  document.querySelectorAll('.bio-modal').forEach(function (modal) {
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () { closeModal(modal); });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.bio-modal:not([hidden])').forEach(closeModal);
    }
  });
})();
