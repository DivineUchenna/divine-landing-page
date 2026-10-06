/* Theme toggle, avatar upload, copy email and toast. Vanilla, no dependencies. */

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

  /* ---------------------------------------------------------------- avatar */

  var avatarInput = document.getElementById('avatarInput');
  var heroAvatar = document.getElementById('heroAvatar');
  var AVATAR_KEY = 'avatar';

  try {
    var saved = localStorage.getItem(AVATAR_KEY);
    if (saved) heroAvatar.src = saved;
  } catch (e) { /* storage blocked: falls back to the default photo */ }

  // Crop to a centred square and shrink, so the saved copy stays small.
  function squareDataUrl(img, size) {
    var side = Math.min(img.naturalWidth, img.naturalHeight);
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    canvas.getContext('2d').drawImage(
      img,
      (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side,
      0, 0, size, size
    );
    return canvas.toDataURL('image/jpeg', 0.88);
  }

  avatarInput.addEventListener('change', function () {
    var file = avatarInput.files && avatarInput.files[0];
    if (!file) return;
    if (file.type.indexOf('image/') !== 0) {
      showToast('Pick an image file');
      return;
    }
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var data = squareDataUrl(img, 480);
      URL.revokeObjectURL(url);
      heroAvatar.src = data;
      try {
        localStorage.setItem(AVATAR_KEY, data);
        showToast('Photo updated');
      } catch (e) {
        showToast('Photo updated for this visit only');
      }
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      showToast('Could not read that image');
    };
    img.src = url;
    avatarInput.value = '';
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
