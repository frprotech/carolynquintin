(function () {
  var root = document.documentElement;
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');

  function setHeaderHeight() {
    root.style.setProperty('--header-h', header.offsetHeight + 'px');
  }

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) setHeaderHeight();
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 1160px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHeaderHeight);
  onScroll();
  setHeaderHeight();

  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) {
      var siblings = el.parentElement.querySelectorAll(':scope > [data-reveal]');
      var index = Array.prototype.indexOf.call(siblings, el);
      if (index > 0) el.style.transitionDelay = (index * 120) + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  document.querySelectorAll('[data-interest]').forEach(function (link) {
    link.addEventListener('click', function () {
      var radio = document.querySelector('input[name="interest"][value="' + link.dataset.interest + '"]');
      if (radio) radio.checked = true;
    });
  });

  // Concept only: the designer connects these to her Kit / Showit forms.
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('is-sent');
      form.querySelector('.form-thanks').hidden = false;
    });
  });

  var track = document.querySelector('[data-track]');
  if (track) {
    var prev = document.querySelector('[data-prev]');
    var next = document.querySelector('[data-next]');
    var bar = document.querySelector('[data-progress]');

    var step = function () {
      var card = track.querySelector('.t-card');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.offsetWidth + gap : track.clientWidth;
    };
    var update = function () {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      var visible = track.clientWidth / track.scrollWidth;
      bar.style.width = (visible * 100) + '%';
      bar.style.left = (max > 0 ? (track.scrollLeft / max) * (1 - visible) * 100 : 0) + '%';
    };

    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
