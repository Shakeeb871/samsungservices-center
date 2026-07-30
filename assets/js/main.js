// Samsung Services Center — starter template scripts

// Mobile nav
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Footer year
(function () {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// Contact form — placeholder handler, wire this to your real endpoint
(function () {
  var form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var note = document.getElementById('formNote');
    if (note) {
      note.textContent = 'Demo form — no message was sent. Connect this to your mail handler.';
      note.style.color = '#1428a0';
    }
  });
})();
