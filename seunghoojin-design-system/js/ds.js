/* Andrew SeungHoo Jin design system: the few behaviours CSS cannot provide.
   No dependencies. Load once at the end of <body>; everything initialises itself. */
(function () {
  /* Contents: marks the section in view with aria-current="true" in every .ds-toc */
  function initToc() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.ds-toc a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var byId = {};
    links.forEach(function (a) { var id = decodeURIComponent(a.getAttribute('href').slice(1)); (byId[id] = byId[id] || []).push(a); });
    var targets = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        (byId[e.target.id] || []).forEach(function (a) { a.setAttribute('aria-current', 'true'); });
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* Zoom: <a class="ds-zoom" href="full.jpg"><img …></a> opens the full image in a dialog */
  function initZoom() {
    var zooms = document.querySelectorAll('a.ds-zoom');
    if (!zooms.length || typeof HTMLDialogElement !== 'function') return;
    var dlg = document.createElement('dialog');
    dlg.className = 'ds-lightbox';
    dlg.setAttribute('aria-label', 'Enlarged figure');
    var img = document.createElement('img');
    var cap = document.createElement('p');
    dlg.appendChild(img); dlg.appendChild(cap);
    document.body.appendChild(dlg);
    dlg.addEventListener('click', function () { dlg.close(); });
    zooms.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var small = a.querySelector('img');
        var fig = a.closest('figure');
        var fc = fig && fig.querySelector('figcaption');
        img.src = a.getAttribute('href');
        img.alt = small ? small.alt : '';
        cap.textContent = fc ? fc.textContent : '';
        cap.hidden = !fc;
        dlg.showModal();
      });
    });
  }

  function init() { initToc(); initZoom(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.dsSite = { initToc: initToc, initZoom: initZoom };
})();
