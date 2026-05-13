(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function resetToTopUnlessAnchored() {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  resetToTopUnlessAnchored();
  window.addEventListener('DOMContentLoaded', resetToTopUnlessAnchored);
  window.addEventListener('load', resetToTopUnlessAnchored);
  window.addEventListener('pageshow', resetToTopUnlessAnchored);
})();
