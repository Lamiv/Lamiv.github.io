// Theme management for Vimal Vidyadharan portfolio
// Handles toggle, icon sync, iframe broadcasting, and standalone page support

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  syncToggleButton();
  broadcastThemeToFrames(isDark);
}

function broadcastThemeToFrames(isDark) {
  document.querySelectorAll('iframe').forEach(function(frame) {
    try {
      frame.contentWindow.postMessage({ type: 'portfolioTheme', dark: isDark }, '*');
    } catch(e) {}
  });
}

function syncToggleButton() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.innerHTML = isDark
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.73 0-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

document.addEventListener('DOMContentLoaded', function() {
  syncToggleButton();
  // Sync iframes after a short delay so they have time to load
  var isDark = document.documentElement.classList.contains('dark');
  setTimeout(function() { broadcastThemeToFrames(isDark); }, 600);
  // Also sync when each iframe finishes loading
  document.querySelectorAll('iframe').forEach(function(frame) {
    frame.addEventListener('load', function() {
      var dark = document.documentElement.classList.contains('dark');
      try {
        frame.contentWindow.postMessage({ type: 'portfolioTheme', dark: dark }, '*');
      } catch(e) {}
    });
  });
});
