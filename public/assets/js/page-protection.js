(function () {
  function ensureAuth() {
    const session = localStorage.getItem('fibernoc_session');
    if (!session) {
      window.location.href = '/login.html';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAuth);
  } else {
    ensureAuth();
  }
})();
