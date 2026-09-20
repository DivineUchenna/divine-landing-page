/* Theme toggle, about dialog and toast. Vanilla, no dependencies. */

(function () {
  'use strict';

  // TODO before launch: swap in the address you actually want people to use.
  var EMAIL = 'divine@flowly.org.uk';

  var root = document.documentElement;

  /* ---------------------------------------------------------------- toast */

  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toastText');
  var toastTimer;

  function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-on');
    }, 2600);
  }

  /* ---------------------------------------------------------------- theme */

  var themeToggle = document.getElementById('themeToggle');

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncToggleLabel() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  themeToggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) { /* storage blocked: the choice just won't survive a reload */ }
    syncToggleLabel();
    showToast(next === 'dark' ? 'Dark theme' : 'Light theme');
  });

  syncToggleLabel();

  /* ---------------------------------------------------------------- about */

  var modal = document.getElementById('aboutModal');
  var box = modal.querySelector('.modal__box');
  var openBtn = document.getElementById('aboutOpen');
  var closeBtn = document.getElementById('aboutClose');
  var lastFocused = null;

  var FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    // Next frame, so the transition has a starting state to animate from.
    requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      modal.hidden = true;
    }, 250);

    // Never leave focus stranded on the dialog once it is hidden: if whatever
    // opened it is not focusable any more, fall back to the trigger.
    var back = lastFocused;
    if (!back || back === document.body || typeof back.focus !== 'function') {
      back = openBtn;
    }
    back.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (event) {
    if (modal.hidden) return;

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    // Keep focus inside the dialog while it is open.
    var items = Array.prototype.filter.call(
      box.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null; }
    );
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ---------------------------------------------------------------- email */

  document.getElementById('copyEmail').addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(
        function () { showToast('Copied ' + EMAIL); },
        function () { window.location.href = 'mailto:' + EMAIL; }
      );
    } else {
      window.location.href = 'mailto:' + EMAIL;
    }
  });
})();
