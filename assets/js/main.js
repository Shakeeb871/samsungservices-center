/* ==========================================================================
   Samsung Services Center — site scripts
   No dependencies. Every block guards for its own markup so the same file
   can be loaded on every page.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('headerNav');

  function closeNav() {
    if (!toggle || !panel) return;
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------------------- nav dropdowns */
  var parents = Array.prototype.slice.call(document.querySelectorAll('.nav-parent'));

  function closeAllSubnavs(except) {
    parents.forEach(function (btn) {
      if (btn === except) return;
      btn.parentNode.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  parents.forEach(function (btn) {
    var li = btn.parentNode;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = !li.classList.contains('is-open');
      closeAllSubnavs(btn);
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // pointer users get hover on wide screens, where the menu is horizontal
    li.addEventListener('mouseenter', function () {
      if (window.matchMedia('(min-width: 901px)').matches) {
        closeAllSubnavs(btn);
        li.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    li.addEventListener('mouseleave', function () {
      if (window.matchMedia('(min-width: 901px)').matches) {
        li.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav')) closeAllSubnavs(null);
    if (!e.target.closest('.site-header')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAllSubnavs(null);
    closeNav();
  });

  // close the mobile panel after following an in-page link
  if (panel) {
    panel.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link && link.getAttribute('href') && link.getAttribute('href').charAt(0) === '#') closeNav();
    });
  }

  /* ------------------------------------------------------- header shadow on scroll */
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-stuck', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------- footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------ FAQ accordion
     <details> cannot be transitioned in every browser yet, so the height is
     animated with the Web Animations API instead. The element stays a real
     <details>, so it still works — just without the slide — if this script
     never runs, and it is left alone entirely under prefers-reduced-motion.
     NOTE: this block must stay above the booking-form section, which returns
     early on pages that have no form. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FAQ_MS = 280;
  var FAQ_EASE = 'cubic-bezier(.4, 0, .2, 1)';

  Array.prototype.forEach.call(document.querySelectorAll('.faq-item'), function (item) {
    var summary = item.querySelector('summary');
    var body = item.querySelector('.faq-body');
    if (!summary || !body) return;

    var anim = null;
    var state = '';           // 'opening' | 'closing' | ''

    function settle(open) {
      item.open = open;
      anim = null;
      state = '';
      item.style.height = '';
      item.style.overflow = '';
    }

    function animateTo(endPx, open) {
      var startPx = item.offsetHeight;
      if (anim) anim.cancel();
      item.style.overflow = 'hidden';
      anim = item.animate(
        { height: [startPx + 'px', endPx + 'px'] },
        { duration: FAQ_MS, easing: FAQ_EASE }
      );
      anim.onfinish = function () { settle(open); };
      anim.oncancel = function () { state = ''; };
    }

    summary.addEventListener('click', function (e) {
      if (reduceMotion.matches) return;     // let the browser open it instantly
      e.preventDefault();

      if (state === 'closing' || !item.open) {
        state = 'opening';
        item.style.height = item.offsetHeight + 'px';
        item.open = true;
        window.requestAnimationFrame(function () {
          animateTo(summary.offsetHeight + body.offsetHeight, true);
        });
      } else {
        state = 'closing';
        animateTo(summary.offsetHeight, false);
      }
    });
  });

  /* ------------------------------------------------------------- sliders
     The track is a real horizontal scroll container, so a swipe, a trackpad,
     the arrow keys and the scrollbar page it whether or not this block runs.
     What this adds is the previous/next buttons and the dots, which page it
     by whole screens and wrap around at either end.
     NOTE: must stay above the booking-form block, which returns early on
     pages that have no form. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-slider]'), function (root) {
    var viewport = root.querySelector('.slider-viewport');
    var track = viewport && viewport.firstElementChild;
    if (!viewport || !track || !track.children.length) return;

    var prevBtn = root.querySelector('[data-slider-prev]');
    var nextBtn = root.querySelector('[data-slider-next]');
    var dotBox = root.querySelector('[data-slider-dots]');
    var slides = Array.prototype.slice.call(track.children);
    var dots = [];
    var pages = 0;

    // How many whole cards fit. offsetLeft is a layout position, so it is
    // unaffected by how far the track is currently scrolled.
    function perView() {
      var w = slides[0].getBoundingClientRect().width;
      if (!w) return 1;
      return Math.max(1, Math.round(viewport.clientWidth / w));
    }

    function slideStart(i) { return slides[i].offsetLeft - slides[0].offsetLeft; }

    function maxScroll() { return viewport.scrollWidth - viewport.clientWidth; }

    function currentPage() {
      var max = maxScroll();
      if (max <= 1 || pages < 2) return 0;
      if (viewport.scrollLeft >= max - 1) return pages - 1;
      return Math.min(pages - 1, Math.round(viewport.scrollLeft / viewport.clientWidth));
    }

    function goTo(page) {
      var target = ((page % pages) + pages) % pages;      // wrap both ways
      var index = Math.min(target * perView(), slides.length - 1);
      viewport.scrollTo({
        left: Math.min(slideStart(index), maxScroll()),
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    }

    function paint() {
      var page = currentPage();
      dots.forEach(function (dot, i) {
        if (i === page) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }

    function buildDots() {
      var want = Math.ceil(slides.length / perView());
      if (want === pages) { paint(); return; }
      pages = want;
      dots = [];
      if (!dotBox) return;
      dotBox.textContent = '';
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', 'Go to page ' + (i + 1) + ' of ' + pages);
        dot.addEventListener('click', (function (n) {
          return function () { goTo(n); };
        })(i));
        dotBox.appendChild(dot);
        dots.push(dot);
      }
      paint();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentPage() - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentPage() + 1); });

    var pending = false;
    viewport.addEventListener('scroll', function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () { pending = false; paint(); });
    }, { passive: true });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(buildDots, 150);
    });

    buildDots();
  });

  /* --------------------------------------------------------- booking form */
  var form = document.getElementById('bookingForm');
  if (!form) return;

  var status = document.getElementById('formStatus');

  var rules = {
    name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
    phone: function (v) {
      return /^[+()\d\s-]{7,20}$/.test(v.trim()) || 'Please enter a phone number we can reach you on.';
    },
    email: function (v) {
      if (!v.trim()) return true;                       // optional
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please check the email address.';
    },
    message: function (v) { return v.trim().length >= 10 || 'A short description of the fault helps us quote.'; }
  };

  function fieldError(input) {
    return document.getElementById(input.name + 'Error');
  }

  function validate(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var result = rule(input.value);
    var box = fieldError(input);
    if (result === true) {
      input.removeAttribute('aria-invalid');
      if (box) box.textContent = '';
      return true;
    }
    input.setAttribute('aria-invalid', 'true');
    if (box) box.textContent = result;
    return false;
  }

  Array.prototype.forEach.call(form.elements, function (el) {
    if (!el.name || !rules[el.name]) return;
    el.addEventListener('blur', function () { validate(el); });
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true') validate(el);
    });
  });

  // Timestamp the render, so send.php can reject a form filled in under three
  // seconds — no human does that, bots do it constantly.
  var startedAt = document.getElementById('startedAt');
  if (startedAt) startedAt.value = String(Date.now());

  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstBad = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || !rules[el.name]) return;
      if (!validate(el) && !firstBad) firstBad = el;
    });

    if (firstBad) {
      firstBad.focus();
      if (status) {
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status is-error';
      }
      return;
    }

    // Post to send.php without leaving the page. The form still has a real
    // action and method, so it degrades to a normal submission without JS.
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
    }
    if (status) {
      status.textContent = 'Sending your request…';
      status.className = 'form-status';
    }

    var done = function (ok, message) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.label || 'Send request';
      }
      if (status) {
        status.textContent = message;
        status.className = 'form-status ' + (ok ? 'is-ok' : 'is-error');
      }
      if (ok) {
        form.reset();
        if (startedAt) startedAt.value = String(Date.now());
      }
    };

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'fetch' }
    })
      .then(function (res) {
        return res.json().catch(function () {
          return { ok: res.ok, message: res.ok
            ? 'Thank you, your request has been received.'
            : 'Something went wrong. Please call us instead.' };
        });
      })
      .then(function (data) { done(!!data.ok, data.message); })
      .catch(function () {
        done(false, 'We could not reach the server. Please call or WhatsApp us instead.');
      });
  });
})();
