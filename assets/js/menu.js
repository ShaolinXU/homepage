(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (!btn || !menu) return;
  function set(open) {
    root.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    (open ? menu.querySelector('a') : btn).focus();
  }
  btn.addEventListener('click', function () { set(true); });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('.menu-close') || e.target.closest('[data-close]')) set(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) set(false);
  });
})();
