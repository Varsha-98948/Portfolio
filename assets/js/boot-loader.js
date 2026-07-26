window.addEventListener('load', function () {
  window.setTimeout(function () {
    var boot = document.getElementById('boot');
    if (boot) boot.classList.add('done');
  }, 550);
});
