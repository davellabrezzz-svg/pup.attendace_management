// Dark / Light mode — shared across all pages
(function () {
  const STORAGE_KEY = 'pup_theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
      btn.title = t === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
    localStorage.setItem(STORAGE_KEY, t);
  }
  function toggleTheme() {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
  // Apply saved theme immediately (before paint)
  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  window.__toggleTheme = toggleTheme;
  window.__applyTheme  = applyTheme;
  // After DOM ready, set icon
  document.addEventListener('DOMContentLoaded', () => applyTheme(saved));
})();
