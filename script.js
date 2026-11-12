const $ = s => document.querySelector(s), root = document.documentElement;

// Light / dark theme (remembered between visits)
const setTheme = t => {
  root.dataset.theme = t;
  try { localStorage.setItem('theme', t); } catch {}
  $('#theme').textContent = t === 'dark' ? 'Light mode' : 'Dark mode';
};
setTheme(root.dataset.theme || 'light');
$('#theme').onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');

// Mobile menu
const nav = $('#nav'), menu = $('#menu');
menu.onclick = () => menu.setAttribute('aria-expanded', nav.classList.toggle('open'));
nav.onclick = e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); menu.setAttribute('aria-expanded', false); }
};

// Highlight the nav link of the section in view
const links = [...document.querySelectorAll('.nav a')];
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => io.observe(s));

// Footer year
$('#year').textContent = new Date().getFullYear();

// Contact form: sends in the background, no page redirect
const form = $('#form'), status = $('#status');
form.onsubmit = async e => {
  e.preventDefault();
  status.textContent = 'Sending...';
  try {
    const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error();
    form.reset();
    status.textContent = 'Thanks, your message is sent. I will reply soon.';
  } catch {
    status.textContent = 'Could not send. Please email mbariropaul9@gmail.com directly.';
  }
};
