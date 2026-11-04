(function () {
  var list = document.querySelector('[data-gallery]');
  if (!list) return;
  var links = Array.prototype.slice.call(list.querySelectorAll('.g-item'));
  if (!links.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.hidden = true;
  box.innerHTML =
    '<button type="button" class="lb-close" aria-label="' + list.dataset.close + '">&times;</button>' +
    '<button type="button" class="lb-nav lb-prev" aria-label="' + list.dataset.prev + '">&#8249;</button>' +
    '<figure><img alt=""><figcaption><p class="lb-text"></p><p class="lb-count"></p></figcaption></figure>' +
    '<button type="button" class="lb-nav lb-next" aria-label="' + list.dataset.next + '">&#8250;</button>';
  document.body.appendChild(box);

  var img = box.querySelector('img');
  var text = box.querySelector('.lb-text');
  var count = box.querySelector('.lb-count');
  var current = -1, opener = null;

  function show(i) {
    current = (i + links.length) % links.length;
    var a = links[current];
    var desc = a.parentNode.querySelector('.g-desc').textContent.trim();
    img.src = a.href;
    img.alt = desc;
    text.textContent = desc;
    text.hidden = !desc;
    count.textContent = links.length > 1 ? (current + 1) + ' / ' + links.length : '';
    box.classList.toggle('single', links.length < 2);
    var next = new Image();
    next.src = links[(current + 1) % links.length].href;
  }
  function open(i, from) {
    opener = from;
    show(i);
    box.hidden = false;
    document.documentElement.classList.add('lb-open');
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.hidden = true;
    document.documentElement.classList.remove('lb-open');
    img.removeAttribute('src');
    if (opener) opener.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(i, a); });
  });
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.closest('.lb-close')) close();
    else if (e.target.closest('.lb-prev')) show(current - 1);
    else if (e.target.closest('.lb-next')) show(current + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
})();
