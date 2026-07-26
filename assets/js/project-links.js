(function () {
  var names = 'aion greengrid lunaops synczone gallimart triggerly medicore wanderwave'.split(' ');
  var projectPage = /\/projects\.html$/i.test(window.location.pathname);
  var projectDetail = /\/projects\//i.test(window.location.pathname);
  function projectName(value) {
    var match = String(value || '').toLowerCase().match(/(?:projects\/)?([a-z]+)\.html(?:$|[?#])/);
    return match && names.indexOf(match[1]) !== -1 ? match[1] : null;
  }
  function destination(name) { return projectPage ? '#' + name : (projectDetail ? '../projects.html#' : 'projects.html#') + name; }
  if (!projectPage) {
    document.querySelectorAll('a[href]').forEach(function (link) {
      var name = projectName(link.getAttribute('href'));
      if (name) link.setAttribute('href', destination(name));
    });
  }
  if (!projectPage) return;
  document.querySelectorAll('[data-href]').forEach(function (card) {
    var name = projectName(card.getAttribute('data-href'));
    if (name) card.id = name;
  });
  document.querySelectorAll('a[href]').forEach(function (link) {
    var name = projectName(link.getAttribute('href'));
    if (!name) return;
    var target = link.closest('article, .build-card');
    if (target) target.id = name;
  });
  function focusProject() {
    var target = window.location.hash && document.querySelector(window.location.hash);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('is-targeted');
    window.setTimeout(function () { target.classList.remove('is-targeted'); }, 1100);
  }
  window.addEventListener('load', focusProject);
  window.addEventListener('hashchange', focusProject);
}());
