/* ===================== Leaf Aid — dashboard shell ===================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- sidebar page switching ---------- */
  const sideLinks = document.querySelectorAll('.side-link[data-page]');
  const pages = document.querySelectorAll('.page');
  const sidebar = document.getElementById('appSidebar');

  function goTo(pageId) {
    pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + pageId));
    sideLinks.forEach(l => l.classList.toggle('active', l.dataset.page === pageId));
    sidebar?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sideLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(link.dataset.page);
    });
  });

  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(el.dataset.goto);
    });
  });

  // deep link support e.g. dashboard.html#library
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) goTo(hash);

  /* ---------- mobile sidebar toggle ---------- */
  // The menu button (#mobileToggle) is handled in script.js — a second handler here
  // toggled the sidebar twice, so it never opened.

  /* ---------- open chat from sidebar / diagnose panel ---------- */
  function openChat() {
    sidebar?.classList.remove('open');   // close the phone menu behind the chat
    document.querySelector('.chat-panel')?.classList.add('open');
    const launcher = document.querySelector('.chat-launcher');
    if (launcher) launcher.style.display = 'none';
  }
  document.getElementById('openChatFromSide')?.addEventListener('click', (e) => { e.preventDefault(); openChat(); });
  document.getElementById('openChatFromDiagnose')?.addEventListener('click', openChat);
});
