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

  // Home valuation form -> POST to the Cloudflare Worker (/api/valuation)
  var valForm = document.getElementById('valuationForm');
  if (valForm) {
    var status = document.getElementById('valStatus');
    valForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!valForm.checkValidity()) {
        valForm.reportValidity();
        return;
      }

      var btn = valForm.querySelector('button[type="submit"]');
      var data = {};
      new FormData(valForm).forEach(function (v, k) { data[k] = v; });

      btn.disabled = true;
      var original = btn.textContent;
      btn.textContent = 'Sending…';
      status.className = 'val-status';
      status.textContent = '';

      fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          valForm.reset();
          status.className = 'val-status ok';
          status.textContent = 'Thank you! Your request has been sent — Darren will be in touch shortly.';
        })
        .catch(function () {
          status.className = 'val-status err';
          status.innerHTML = 'Sorry, something went wrong. Please call 718.919.1612 or email ' +
            '<a href="mailto:darren@darrenkre.com">darren@darrenkre.com</a>.';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }
})();
