/* ===================== Leaf Aid — shared interactions ===================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- dark mode toggle ---------- */
  const THEME_KEY = 'leafaid-theme';
  const sunIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  const moonIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  function applyThemeIcon(btn) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark ? sunIcon : moonIcon;
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    applyThemeIcon(btn);
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(THEME_KEY, 'dark');
      }
      document.querySelectorAll('[data-theme-toggle]').forEach(applyThemeIcon);
    });
  });

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-open');
      navToggle.setAttribute('aria-expanded', open);
      navLinks.style.cssText = open
        ? 'display:flex;flex-direction:column;position:absolute;top:74px;left:16px;right:16px;background:rgba(6,20,15,.96);border-radius:20px;padding:10px;gap:4px;border:1px solid rgba(255,255,255,.12)'
        : '';
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- hero magnifier scanner ---------- */
  const scanner = document.querySelector('.scanner');
  if (scanner) {
    const analysis = scanner.querySelector('.layer-analysis');
    const ring = scanner.querySelector('.scan-ring');
    const setPos = (x, y) => {
      const r = 95;
      if (analysis) analysis.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
      if (ring) ring.style.left = x + 'px', ring.style.top = y + 'px';
    };
    let auto = true;
    let t = 0;
    function autoScan() {
      if (!auto) return;
      const rect = scanner.getBoundingClientRect();
      t += 0.012;
      const x = rect.width * (0.5 + 0.32 * Math.cos(t));
      const y = rect.height * (0.5 + 0.32 * Math.sin(t * 1.3));
      setPos(x, y);
      requestAnimationFrame(autoScan);
    }
    requestAnimationFrame(autoScan);
    scanner.addEventListener('mousemove', (e) => {
      auto = false;
      const rect = scanner.getBoundingClientRect();
      setPos(e.clientX - rect.left, e.clientY - rect.top);
    });
    scanner.addEventListener('mouseleave', () => { auto = true; });
  }

  /* ---------- disease library filter (used on index + dashboard) ---------- */
  document.querySelectorAll('[data-lib-root]').forEach(root => {
    const input = root.querySelector('.search-box input');
    const chips = root.querySelectorAll('.chip-filter');
    const cards = root.querySelectorAll('.disease-card');
    let activeChip = 'all';

    function apply() {
      const q = (input?.value || '').toLowerCase().trim();
      cards.forEach(card => {
        const text = card.dataset.name.toLowerCase() + ' ' + card.dataset.crop.toLowerCase();
        const matchesText = text.includes(q);
        const matchesChip = activeChip === 'all' || card.dataset.crop === activeChip || card.dataset.severity === activeChip;
        card.style.display = (matchesText && matchesChip) ? '' : 'none';
      });
    }
    input?.addEventListener('input', apply);
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeChip = chip.dataset.filter;
      apply();
    }));
  });

  /* ---------- disease card -> detail modal ---------- */
  const modal = document.getElementById('diseaseModal');
  if (modal) {
    document.querySelectorAll('.disease-card').forEach(card => {
      card.addEventListener('click', () => {
        modal.querySelector('.m-title').textContent = card.dataset.name;
        modal.querySelector('.m-crop').textContent = card.dataset.crop;
        modal.querySelector('.m-desc').textContent = card.dataset.desc || '';
        modal.querySelector('.m-treat').textContent = card.dataset.treat || '';
        modal.querySelector('.m-prevent').textContent = card.dataset.prevent || '';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    modal.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- password visibility toggle ---------- */
  document.querySelectorAll('.toggle-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.classList.toggle('is-visible');
    });
  });

  /* ---------- auth forms (mock submit) ---------- */
  document.querySelectorAll('.auth-submit-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const original = btn.textContent;
      btn.textContent = 'Please wait…';
      btn.disabled = true;
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 900);
    });
  });

  /* ---------- toast ---------- */
  window.showToast = (msg) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  };

  /* =========================================================
     CHATBOT WIDGET
     ========================================================= */
  const launcher = document.querySelector('.chat-launcher');
  const panel = document.querySelector('.chat-panel');
  if (launcher && panel) {
    const body = panel.querySelector('.chat-body');
    const input = panel.querySelector('.chat-input input');
    const sendBtn = panel.querySelector('.chat-input button');

    const open = () => { panel.classList.add('open'); launcher.style.display = 'none'; input?.focus(); };
    const close = () => { panel.classList.remove('open'); launcher.style.display = 'flex'; };
    launcher.addEventListener('click', open);
    panel.querySelector('.chat-close')?.addEventListener('click', close);

    function addMsg(text, who) {
      const div = document.createElement('div');
      div.className = 'msg ' + who;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }
    async function botRespond(userText) {
      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      let reply;
      try {
        const lastDiagnosis = window.__lastDiagnosis || null;
        const res = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            context: lastDiagnosis
              ? `${lastDiagnosis.name} on ${lastDiagnosis.crop} at ${lastDiagnosis.confidence}% confidence, severity ${lastDiagnosis.severity}.`
              : null
          })
        });
        const data = await res.json();
        reply = data.reply || "Sorry, I couldn't reach the assistant just now.";
      } catch (err) {
        reply = "I'm having trouble connecting right now — please try again in a moment.";
      }

      typing.remove();
      addMsg(reply, 'bot');
    }
    function send() {
      const val = input.value.trim();
      if (!val) return;
      addMsg(val, 'user');
      input.value = '';
      botRespond(val);
    }
    sendBtn?.addEventListener('click', send);
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
    panel.querySelectorAll('.msg-suggestions button').forEach(b => {
      b.addEventListener('click', () => { input.value = b.textContent; send(); });
    });
  }

  /* =========================================================
     DASHBOARD: sidebar toggle
     ========================================================= */
  const sidebar = document.querySelector('.app-sidebar');
  const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.app-main').forEach(m => m.addEventListener('click', () => sidebar.classList.remove('open')));
  }

  /* =========================================================
     DASHBOARD: upload + mock diagnosis + explainable AI toggle
     ========================================================= */
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const resultWrap = document.getElementById('resultWrap');

  const diagnoses = [
    { name: 'Early Blight', crop: 'Tomato', confidence: 96, severity: 'high',
      reasons: ['Concentric dark rings detected on 3 lesion clusters', 'Yellow halo pattern matches early blight signature', 'Lesion density concentrated on lower canopy leaves'],
      symptoms: 'Small brown spots with concentric rings, surrounded by a yellow halo, usually starting on older, lower leaves before moving upward.',
      treatment: 'Remove and destroy infected leaves. Apply a copper-based or chlorothalonil fungicide every 7–10 days. Avoid overhead watering to keep foliage dry.',
      prevention: 'Rotate crops on a 2–3 year cycle, mulch to prevent soil splash, stake plants for airflow, and choose resistant varieties where available.' },
    { name: 'Powdery Mildew', crop: 'Cucumber', confidence: 91, severity: 'medium',
      reasons: ['White powdery texture detected across upper leaf surface', 'Low lesion depth suggests surface-level fungal growth', 'Pattern consistent with mildew spread along veins'],
      symptoms: 'White or gray powdery patches on leaf surfaces and stems, often starting on older leaves and spreading quickly in humid, low-light conditions.',
      treatment: 'Apply sulfur or potassium bicarbonate-based fungicide. Prune affected foliage and increase spacing between plants for better airflow.',
      prevention: 'Water in the morning at the base of plants, avoid excess nitrogen fertilizer, and prune dense growth to improve air circulation.' },
    { name: 'Leaf Rust', crop: 'Wheat', confidence: 88, severity: 'medium',
      reasons: ['Orange pustule clusters detected along leaf blade', 'Radial spread pattern typical of rust spores', 'Texture signature matches rust fungal structure'],
      symptoms: 'Small orange-brown pustules scattered across the leaf blade, which rupture and release powdery spores that spread quickly by wind.',
      treatment: 'Apply a triazole-based fungicide at first sign of pustules. Remove volunteer plants that can harbor spores between seasons.',
      prevention: 'Plant rust-resistant cultivars, avoid dense planting, and monitor fields closely during warm, humid stretches of the season.' },
    { name: 'Insect Feeding Damage', crop: 'Cabbage', confidence: 84, severity: 'low',
      reasons: ['Irregular hole patterns with clean margins detected', 'Insect silhouette identified near leaf margin', 'Damage concentrated on younger leaf tissue'],
      symptoms: 'Irregular holes and chewed margins on leaves, often with visible larvae, eggs, or adult insects nearby, most active in early morning or evening.',
      treatment: 'Hand-pick visible pests, introduce beneficial insects like ladybugs, or apply an appropriate organic insecticide such as neem oil.',
      prevention: 'Use row covers on young plants, rotate crops, and inspect the underside of leaves weekly for eggs or larvae.' }
  ];

  function renderResult(imgSrc) {
    const pick = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    resultWrap.querySelector('.preview-box img').src = imgSrc;
    resultWrap.querySelector('.disease-name').textContent = pick.name;
    resultWrap.querySelector('.crop-line').textContent = 'Detected on ' + pick.crop + ' leaf';
    resultWrap.querySelector('.bar-fill').style.width = pick.confidence + '%';
    resultWrap.querySelector('.bar-confidence-val').textContent = pick.confidence + '% confidence';
    const sevTag = resultWrap.querySelector('.severity-pill');
    sevTag.textContent = pick.severity.toUpperCase() + ' SEVERITY';
    sevTag.className = 'mini-tag severity-pill sev-' + pick.severity;

    const reasonList = resultWrap.querySelector('.reason-list');
    reasonList.innerHTML = pick.reasons.map(r => `<div class="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span>${r}</span></div>`).join('');

    resultWrap.querySelector('.tab-panel.symptoms').textContent = pick.symptoms;
    resultWrap.querySelector('.tab-panel.treatment').textContent = pick.treatment;
    resultWrap.querySelector('.tab-panel.prevention').textContent = pick.prevention;

    window.__lastDiagnosis = { name: pick.name, crop: pick.crop, confidence: pick.confidence, severity: pick.severity };

    resultWrap.classList.add('show');
    resultWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Diagnosis complete — ' + pick.name);

    document.dispatchEvent(new CustomEvent('leafaid:diagnosis', {
      detail: { name: pick.name, crop: pick.crop, confidence: pick.confidence, severity: pick.severity, imgSrc }
    }));
  }

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      dropzone.querySelector('h4').textContent = 'Analyzing leaf image…';
      dropzone.querySelector('.dz-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
      setTimeout(() => {
        renderResult(e.target.result);
        dropzone.querySelector('h4').textContent = 'Drop a new leaf photo to re-scan';
        dropzone.querySelector('.dz-icon').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/></svg>';
      }, 1400);
    };
    reader.readAsDataURL(file);
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
    ['dragenter', 'dragover'].forEach(evt => dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(evt => dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('drag'); }));
    dropzone.addEventListener('drop', (e) => handleFile(e.dataTransfer.files[0]));
  }

  /* XAI toggle inside result preview */
  document.querySelectorAll('.xai-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = resultWrap.querySelector('.layer-analysis');
      layer.style.opacity = btn.dataset.mode === 'ai' ? '1' : '0';
    });
  });

  /* result tabs */
  document.querySelectorAll('.tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabs = btn.closest('.tabs');
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const panelGroup = tabs.nextElementSibling.parentElement || tabs.parentElement;
      panelGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      panelGroup.querySelector('.tab-panel.' + btn.dataset.tab).classList.add('active');
    });
  });

  /* animate stat / chart bars already sized via inline style on load */
  document.querySelectorAll('.mini-chart .bar').forEach((bar, i) => {
    bar.style.animationDelay = (i * 0.08) + 's';
  });
});

/* ---------- PWA: register service worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
