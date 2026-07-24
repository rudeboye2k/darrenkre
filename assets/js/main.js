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
        'mailto:info@darrenkrealestate.com' +
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
          '<p class="form-note">&ldquo;Send&rdquo; opens your email app with your message ready to go. Prefer to talk? Call <a href="tel:+19177094285">917.709.4285</a>.</p>' +
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
        'mailto:info@darrenkrealestate.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      closeContact();
    });
  }

  // Open house announcement — elegant pop-up, shown once per browsing
  // session and only through the last event date (then it stops appearing).
  (function () {
    // Skip on a listing detail page — no need to advertise a listing to
    // someone already viewing it.
    if (document.querySelector('.listing-hero')) return;
    var OH_KEY = 'ohSeen-2026-07-25';
    var deadline = new Date('2026-07-27T04:00:00Z'); // end of Jul 26, 2026 (ET)
    var seen = false;
    try { seen = sessionStorage.getItem(OH_KEY) === '1'; } catch (e) {}
    if (seen || new Date() > deadline) return;

    // Random collage of 3 property photos (shuffled each time it appears)
    var OH_POOL = [
      '/assets/listings/30West13thStreet/living-room.webp',
      '/assets/listings/30West13thStreet/living-dining.webp',
      '/assets/listings/30West13thStreet/kitchen.webp',
      '/assets/listings/30West13thStreet/bedroom.webp',
      '/assets/listings/30West13thStreet/bathroom.webp',
      '/assets/listings/30West13thStreet/hallway.webp',
      '/assets/listings/30West13thStreet/main.webp'
    ];
    var pics = OH_POOL.slice();
    for (var pi = pics.length - 1; pi > 0; pi--) {
      var pj = Math.floor(Math.random() * (pi + 1));
      var pt = pics[pi]; pics[pi] = pics[pj]; pics[pj] = pt;
    }
    var collage = pics.slice(0, 3).map(function (src) {
      return '<div class="oh-tile" style="background-image:url(\'' + src + '\')"></div>';
    }).join('');

    var html =
      '<div class="oh-modal" id="ohModal" hidden role="dialog" aria-modal="true" aria-labelledby="ohTitle">' +
        '<div class="oh-backdrop" data-oh-close></div>' +
        '<div class="oh-dialog">' +
          '<button class="bio-close oh-close" type="button" data-oh-close aria-label="Close announcement">&times;</button>' +
          '<div class="oh-media oh-collage">' + collage + '</div>' +
          '<div class="oh-body">' +
            '<p class="oh-eyebrow">Open House</p>' +
            '<h2 class="oh-title" id="ohTitle">You&rsquo;re invited.</h2>' +
            '<div class="oh-dates">' +
              '<div class="oh-date-row">' +
                '<span class="oh-date">Saturday, July 25</span>' +
                '<span class="oh-time">1:30 &ndash; 3:30 PM EST</span>' +
                '<a class="oh-rsvp" href="https://www.facebook.com/events/963671020058894" target="_blank" rel="noopener">RSVP on Facebook &#8599;</a>' +
              '</div>' +
              '<div class="oh-date-row">' +
                '<span class="oh-date">Sunday, July 26</span>' +
                '<span class="oh-time">2:00 &ndash; 4:00 PM EST</span>' +
                '<a class="oh-rsvp" href="https://www.facebook.com/events/1558524752635162" target="_blank" rel="noopener">RSVP on Facebook &#8599;</a>' +
              '</div>' +
            '</div>' +
            '<hr class="oh-rule" />' +
            '<p class="oh-addr">30 West 13th Street, Residence 4A</p>' +
            '<p class="oh-loc">Greenwich Village &middot; Manhattan</p>' +
            '<div class="oh-actions">' +
              '<a class="btn btn-dark" href="/30West13thStreet.html">View the Listing</a>' +
              '<a class="btn btn-dark-ghost" href="https://streeteasy.com/building/30-west-13-street-new_york/sale/1824381" target="_blank" rel="noopener">StreetEasy &#8599;</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var oh = wrap.firstChild;
    document.body.appendChild(oh);

    var ohLastFocused = null;
    var markSeen = function () { try { sessionStorage.setItem(OH_KEY, '1'); } catch (e) {} };
    var closeOH = function () {
      oh.hidden = true;
      document.body.classList.remove('modal-open');
      markSeen();
      if (ohLastFocused) ohLastFocused.focus();
    };
    var openOH = function () {
      ohLastFocused = document.activeElement;
      oh.hidden = false;
      document.body.classList.add('modal-open');
      var c = oh.querySelector('.oh-close');
      if (c) c.focus();
    };

    oh.querySelectorAll('[data-oh-close]').forEach(function (el) {
      el.addEventListener('click', function () { closeOH(); });
    });
    document.addEventListener('keydown', function (e) {
      if (!oh.hidden && e.key === 'Escape') closeOH();
    });

    window.setTimeout(openOH, 700);
  })();

  // Mortgage estimator (listing pages). Reusable: reads the property price
  // from the .mortgage element's data-price attribute.
  var mort = document.querySelector('.mortgage');
  if (mort) {
    var mPanel = mort.querySelector('.mortgage-panel');
    var mToggle = mort.querySelector('.mortgage-toggle');
    var mDonut = mort.querySelector('.mortgage-donut');
    var mEl = function (k) { return mort.querySelector('[data-m="' + k + '"]'); };
    var mOut = function (k) { return mort.querySelector('[data-' + k + ']'); };
    var fPrice = mEl('price'), fDown = mEl('down'), fPct = mEl('downpct'),
        fRange = mEl('downrange'), fTerm = mEl('term'), fRate = mEl('rate'),
        fTax = mEl('tax'), fCC = mEl('cc');

    var mNum = function (v) { return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0; };
    var mMoney = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };

    var recalc = function () {
      var price = mNum(fPrice.value);
      var down = Math.min(mNum(fDown.value), price);
      var rate = mNum(fRate.value) / 100 / 12;
      var n = mNum(fTerm.value) * 12;
      var loan = Math.max(price - down, 0);
      var pi;
      if (rate > 0) pi = loan * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1);
      else pi = n > 0 ? loan / n : 0;
      var tax = mNum(fTax.value), cc = mNum(fCC.value);
      var total = pi + tax + cc;
      mOut('total').textContent = mMoney(total);
      mOut('pi').textContent = mMoney(pi);
      mOut('tax').textContent = mMoney(tax);
      mOut('cc').textContent = mMoney(cc);
      if (total <= 0) {
        mDonut.style.background = 'var(--line)';
      } else {
        var a = pi / total * 100, b = tax / total * 100;
        mDonut.style.background =
          'conic-gradient(var(--accent) 0 ' + a + '%, var(--ink) ' + a + '% ' + (a + b) +
          '%, var(--muted) ' + (a + b) + '% 100%)';
      }
    };

    var setPct = function (pctVal) {
      var price = mNum(fPrice.value);
      var pct = Math.max(0, Math.min(100, pctVal));
      fDown.value = mMoney(price * pct / 100);
      fPct.value = Math.round(pct) + '%';
      fRange.value = Math.round(pct);
      recalc();
    };
    var fromDown = function () {
      var price = mNum(fPrice.value);
      var pct = price > 0 ? Math.min(100, mNum(fDown.value) / price * 100) : 0;
      fPct.value = Math.round(pct) + '%';
      fRange.value = Math.round(pct);
      recalc();
    };

    if (mToggle) {
      mToggle.addEventListener('click', function () {
        var open = mPanel.hidden;
        mPanel.hidden = !open;
        mToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        mort.classList.toggle('is-open', open);
      });
    }
    fPrice.addEventListener('input', function () { setPct(mNum(fPct.value)); });
    fDown.addEventListener('input', fromDown);
    fPct.addEventListener('input', function () { setPct(mNum(fPct.value)); });
    fRange.addEventListener('input', function () { setPct(mNum(fRange.value)); });
    fTerm.addEventListener('change', recalc);
    [fRate, fTax, fCC].forEach(function (f) { f.addEventListener('input', recalc); });
    [fPrice, fDown, fTax, fCC].forEach(function (f) {
      f.addEventListener('blur', function () { f.value = mMoney(mNum(f.value)); recalc(); });
    });
    fRate.addEventListener('blur', function () { fRate.value = mNum(fRate.value) + '%'; });

    // Initialise from data-price, defaulting to a 20% down payment.
    var dp = mort.getAttribute('data-price');
    if (dp) fPrice.value = mMoney(mNum(dp));
    setPct(mNum(fPct.value) || 20);
  }

  // Collapsible "read more" panels (e.g. the full listing description)
  var revealToggles = document.querySelectorAll('.reveal-toggle');
  revealToggles.forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    var label = btn.querySelector('.reveal-label');
    btn.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Show less' : 'Read the full description';
    });
  });

  // Photo gallery lightbox / carousel (listing pages) — includes the floor plan
  var lightbox = document.getElementById('lightbox');
  var shots = Array.prototype.slice.call(document.querySelectorAll('.fl-shot, .floorplan-btn'));
  if (lightbox && shots.length) {
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
