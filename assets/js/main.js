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
      contactForm.reset();
    });
  }

  // Contact pop-up: one modal, opened by any [data-contact] button with a
  // context-aware subject. Cleared and closed after the message is sent.
  var contactModalHTML =
    '<div class="contact-modal" id="contactModal" hidden role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">' +
      '<div class="bio-backdrop" data-cm-close></div>' +
      '<div class="bio-dialog contact-dialog">' +
        '<button class="bio-close" type="button" data-cm-close aria-label="Close contact form">&times;</button>' +
        '<p class="eyebrow dark contact-modal-eyebrow">Get in Touch</p>' +
        '<h3 id="contactModalTitle" class="contact-modal-title">Send a message</h3>' +
        '<p class="contact-modal-topic">Regarding: <strong data-cm-topic>Website Inquiry</strong></p>' +
        '<form class="contact-form contact-form--modal" id="contactModalForm" novalidate>' +
          '<label>Name<input type="text" name="name" required /></label>' +
          '<label>Email<input type="email" name="email" required /></label>' +
          '<label>Phone<input type="tel" name="phone" /></label>' +
          '<label>How can we help?<textarea name="message" rows="4" placeholder="I\'m interested in..."></textarea></label>' +
          '<button type="submit" class="btn btn-dark btn-block">Send Message</button>' +
          '<p class="form-note">&ldquo;Send&rdquo; opens your email app with your message ready to go. Prefer to talk? Call <a href="tel:+17189191612">718.919.1612</a>.</p>' +
        '</form>' +
      '</div>' +
    '</div>';

  var contactTriggers = document.querySelectorAll('[data-contact]');
  if (contactTriggers.length) {
    var cmWrap = document.createElement('div');
    cmWrap.innerHTML = contactModalHTML;
    var contactModal = cmWrap.firstChild;
    document.body.appendChild(contactModal);

    var cmTopic = contactModal.querySelector('[data-cm-topic]');
    var cmForm = contactModal.querySelector('#contactModalForm');
    var cmSubject = 'Website Inquiry';
    var cmLastFocused = null;

    var openContact = function (subject) {
      cmSubject = subject || 'Website Inquiry';
      cmTopic.textContent = cmSubject;
      cmLastFocused = document.activeElement;
      contactModal.hidden = false;
      document.body.classList.add('modal-open');
      var first = cmForm.querySelector('input[name="name"]');
      if (first) first.focus();
    };
    var closeContact = function () {
      contactModal.hidden = true;
      document.body.classList.remove('modal-open');
      cmForm.reset();
      if (cmLastFocused) cmLastFocused.focus();
    };

    contactTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openContact(btn.getAttribute('data-subject'));
      });
    });
    contactModal.querySelectorAll('[data-cm-close]').forEach(function (el) {
      el.addEventListener('click', function () { closeContact(); });
    });
    document.addEventListener('keydown', function (e) {
      if (!contactModal.hidden && e.key === 'Escape') closeContact();
    });

    cmForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cmForm.checkValidity()) {
        cmForm.reportValidity();
        return;
      }
      var get = function (n) {
        var el = cmForm.querySelector('[name="' + n + '"]');
        return el ? el.value.trim() : '';
      };
      var name = get('name');
      var subject = cmSubject + (name ? ' — ' + name : '');
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + get('email') + '\n' +
        'Phone: ' + get('phone') + '\n' +
        'Regarding: ' + cmSubject + '\n\n' +
        'Message:\n' + get('message') + '\n';
      window.location.href =
        'mailto:darren@darrenkre.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      closeContact();
    });
  }

  // Photo gallery lightbox / carousel (listing pages)
  var gallery = document.querySelector('.fl-gallery');
  var lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
    var shots = Array.prototype.slice.call(gallery.querySelectorAll('.fl-shot'));
    var lbImg = lightbox.querySelector('.lightbox-img');
    var lbCounter = lightbox.querySelector('.lightbox-counter');
    var current = 0;
    var lbLastFocused = null;

    var showSlide = function (i) {
      current = (i + shots.length) % shots.length;
      var btn = shots[current];
      lbImg.src = btn.getAttribute('data-full');
      lbImg.alt = btn.getAttribute('aria-label') || '';
      lbCounter.textContent = (current + 1) + ' / ' + shots.length;
    };
    var openLightbox = function (i) {
      lbLastFocused = document.activeElement;
      showSlide(i);
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      var nextBtn = lightbox.querySelector('.lightbox-next');
      if (nextBtn) nextBtn.focus();
    };
    var closeLightbox = function () {
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lbImg.src = '';
      if (lbLastFocused) lbLastFocused.focus();
    };

    shots.forEach(function (btn, i) {
      btn.addEventListener('click', function () { openLightbox(i); });
    });
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(current + 1); });
    lightbox.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () { closeLightbox(); });
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showSlide(current - 1);
      else if (e.key === 'ArrowRight') showSlide(current + 1);
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
