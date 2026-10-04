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
        ? 'display:flex;flex-direction:column;position:absolute;top:74px;left:16px;right:16px;background:rgba(6,20,15,.96);border-radius:20px;padding:10px;gap:4px;border:1px solid rgba(255,255,255,.14);box-shadow:0 18px 30px rgba(0,0,0,.25);'
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
      return div;
    }

    async function botRespond(userText) {
      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      let reply = "I'm having trouble connecting right now — please try again in a moment.";
      let ok = false;

      try {
        const lastDiagnosis = window.__lastDiagnosis || null;
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            lang: (() => { try { return localStorage.getItem('leafaid-lang') || 'en'; } catch (e) { return 'en'; } })(),
            context: lastDiagnosis
              ? `${lastDiagnosis.name} on ${lastDiagnosis.crop} at ${lastDiagnosis.confidence}% confidence, severity ${lastDiagnosis.severity}.`
              : null
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Chat API failed');
        }

        reply = data.reply || "Sorry, I couldn't reach the assistant just now.";
        ok = !!data.reply;
      } catch (err) {
        console.error('Chat API error:', err);
        reply = "I'm having trouble connecting right now — please try again in a moment.";
      }

      typing.remove();
      addMsg(reply, 'bot');
      if (ok) speak(reply);
    }

    function send() {
      const val = input.value.trim();
      if (!val) return;
      stopSpeaking();
      addMsg(val, 'user');
      input.value = '';
      botRespond(val);
    }

    /* =========================================================
       VOICE: mic input (language auto-detected by Gemini) + spoken replies
       ========================================================= */
    const diagContext = () => {
      const d = window.__lastDiagnosis;
      return d ? `${d.name} on ${d.crop} at ${d.confidence}% confidence, severity ${d.severity}.` : null;
    };
    const uiLangCode = () => { try { return localStorage.getItem('leafaid-lang') || 'en'; } catch (e) { return 'en'; } };

    const voiceStyle = document.createElement('style');
    voiceStyle.textContent = `
      .chat-input .mic-btn{background:var(--amber-400,#F0B429);}
      .chat-input .mic-btn.rec{background:#d93025;animation:micpulse 1.2s infinite;}
      .chat-input .mic-btn:disabled{opacity:.5;}
      @keyframes micpulse{0%{box-shadow:0 0 0 0 rgba(217,48,37,.5);}100%{box-shadow:0 0 0 12px rgba(217,48,37,0);}}
      .chat-head .head-actions{display:flex;align-items:center;gap:8px;}
      .chat-speak{background:rgba(255,255,255,.12);border:none;width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
      .chat-speak svg{width:16px;height:16px;color:#fff;}
      .chat-speak.off{opacity:.6;}
    `;
    document.head.appendChild(voiceStyle);

    const SVG_ATTR = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    const ICON_MIC = `<svg ${SVG_ATTR}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>`;
    const ICON_STOP = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    const ICON_SPK_ON = `<svg ${SVG_ATTR}><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>`;
    const ICON_SPK_OFF = `<svg ${SVG_ATTR}><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>`;

    /* ---------- speaker (text-to-speech) ---------- */
    const synth = window.speechSynthesis || null;
    let voices = [];
    const loadVoices = () => { voices = synth ? synth.getVoices() : []; };
    if (synth) { loadVoices(); if (synth.addEventListener) synth.addEventListener('voiceschanged', loadVoices); }

    let speakerOn = true;
    try { speakerOn = localStorage.getItem('leafaid-voice-reply') !== 'off'; } catch (e) {}

    const LANG_NAMES = { te: 'Telugu', hi: 'Hindi', ta: 'Tamil', kn: 'Kannada', ml: 'Malayalam', bn: 'Bengali', gu: 'Gujarati', pa: 'Punjabi', or: 'Odia', en: 'English' };
    const SCRIPT_LANGS = [
      [/[\u0C00-\u0C7F]/, 'te-IN'], [/[\u0900-\u097F]/, 'hi-IN'], [/[\u0B80-\u0BFF]/, 'ta-IN'],
      [/[\u0C80-\u0CFF]/, 'kn-IN'], [/[\u0D00-\u0D7F]/, 'ml-IN'], [/[\u0980-\u09FF]/, 'bn-IN'],
      [/[\u0A80-\u0AFF]/, 'gu-IN'], [/[\u0A00-\u0A7F]/, 'pa-IN'], [/[\u0B00-\u0B7F]/, 'or-IN']
    ];
    const detectScriptLang = (text) => {
      for (const [re, code] of SCRIPT_LANGS) if (re.test(text)) return code;
      return null;
    };
    const warnedLangs = new Set();

    function pickVoice(code) {
      const want = code.toLowerCase().replace('_', '-');
      const base = want.split('-')[0];
      const list = voices.length ? voices : (synth ? synth.getVoices() : []);
      const norm = (v) => v.lang.toLowerCase().replace('_', '-');
      return list.find(v => norm(v) === want) || list.find(v => norm(v).split('-')[0] === base) || null;
    }

    function stopSpeaking() { if (synth) synth.cancel(); }

    function speak(text, langHint) {
      if (!synth || !speakerOn || !text) return;
      const clean = String(text)
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
        .replace(/[*_`#>]/g, '')
        .trim();
      if (!clean) return;

      const code = detectScriptLang(clean) || langHint || 'en-IN';
      const base = code.toLowerCase().split('-')[0];
      const voice = pickVoice(code);
      if (!voice && base !== 'en' && !warnedLangs.has(base)) {
        warnedLangs.add(base);
        showToast('No ' + (LANG_NAMES[base] || code) + ' voice found on this device — install one in your system settings to hear replies.');
      }

      synth.cancel();
      // Read sentence by sentence (long single utterances get cut off in some browsers).
      const parts = clean.match(/[^.!?।]+[.!?।]*/g) || [clean];
      parts.forEach((part) => {
        const t = part.trim();
        if (!t) return;
        const u = new SpeechSynthesisUtterance(t);
        u.lang = code;
        if (voice) u.voice = voice;
        u.rate = 0.95;
        synth.speak(u);
      });
    }

    const closeBtn = panel.querySelector('.chat-close');
    let speakBtn = null;
    if (closeBtn && synth) {
      speakBtn = document.createElement('button');
      speakBtn.type = 'button';
      speakBtn.className = 'chat-speak';
      const paintSpeaker = () => {
        speakBtn.innerHTML = speakerOn ? ICON_SPK_ON : ICON_SPK_OFF;
        speakBtn.classList.toggle('off', !speakerOn);
        speakBtn.setAttribute('aria-label', speakerOn ? 'Mute spoken replies' : 'Turn on spoken replies');
        speakBtn.title = speakerOn ? 'Spoken replies: on' : 'Spoken replies: off';
      };
      paintSpeaker();
      speakBtn.addEventListener('click', () => {
        speakerOn = !speakerOn;
        try { localStorage.setItem('leafaid-voice-reply', speakerOn ? 'on' : 'off'); } catch (e) {}
        if (!speakerOn) stopSpeaking();
        paintSpeaker();
      });
      const actions = document.createElement('div');
      actions.className = 'head-actions';
      closeBtn.replaceWith(actions);
      actions.append(speakBtn, closeBtn);
    }

    /* ---------- mic (speech input) ---------- */
    function decodeAudio(arrayBuf) {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      return new Promise((resolve, reject) => {
        ctx.decodeAudioData(arrayBuf,
          (d) => { ctx.close(); resolve(d); },
          (e) => { ctx.close(); reject(e || new Error('decode failed')); });
      });
    }

    function encodeWav(pcm, rate) {
      const buf = new ArrayBuffer(44 + pcm.length * 2);
      const v = new DataView(buf);
      const w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
      w(0, 'RIFF'); v.setUint32(4, 36 + pcm.length * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
      v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
      w(36, 'data'); v.setUint32(40, pcm.length * 2, true);
      let o = 44;
      for (let i = 0; i < pcm.length; i++, o += 2) {
        const x = Math.max(-1, Math.min(1, pcm[i]));
        v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7FFF, true);
      }
      return buf;
    }

    // Recording (webm/mp4) -> 16 kHz mono WAV, base64. Keeps uploads small and the format universal.
    async function blobToWavBase64(blob) {
      const decoded = await decodeAudio(await blob.arrayBuffer());
      const rate = 16000;
      const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const off = new OAC(1, Math.max(1, Math.ceil(decoded.duration * rate)), rate);
      const src = off.createBufferSource();
      src.buffer = decoded;
      src.connect(off.destination);
      src.start();
      const rendered = await off.startRendering();
      const wav = new Blob([encodeWav(rendered.getChannelData(0), rate)], { type: 'audio/wav' });
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result).split(',')[1]);
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(wav);
      });
    }

    async function voiceRespond(wavB64, bubble) {
      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      try {
        const res = await fetch('/api/voice-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: wavB64, lang: uiLangCode(), context: diagContext() })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Voice chat failed');

        typing.remove();
        if (!data.transcript || !data.reply) {
          bubble.remove();
          showToast("I couldn't catch that — please try again and speak clearly.");
          return;
        }
        bubble.textContent = data.transcript;
        addMsg(data.reply, 'bot');
        speak(data.reply, data.lang);
      } catch (err) {
        console.error('Voice chat error:', err);
        typing.remove();
        bubble.remove();
        addMsg("I'm having trouble connecting right now — please try again in a moment.", 'bot');
      }
    }

    let micBtn = null;
    if (sendBtn) {
      micBtn = document.createElement('button');
      micBtn.type = 'button';
      micBtn.className = 'mic-btn';
      micBtn.setAttribute('aria-label', 'Speak your question');
      micBtn.title = 'Tap to speak, tap again to send';
      micBtn.innerHTML = ICON_MIC;
      sendBtn.before(micBtn);

      let recorder = null, stream = null, chunks = [], recTimer = null, recording = false, discard = false;

      const setRecUi = (on) => {
        micBtn.classList.toggle('rec', on);
        micBtn.innerHTML = on ? ICON_STOP : ICON_MIC;
        micBtn.setAttribute('aria-label', on ? 'Stop and send' : 'Speak your question');
        if (input) {
          if (on) { micBtn._ph = input.placeholder; input.placeholder = 'Listening… tap the mic again to send'; }
          else if (micBtn._ph) { input.placeholder = micBtn._ph; }
        }
      };

      const releaseStream = () => { if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } };

      async function onRecordingDone() {
        releaseStream();
        const blob = new Blob(chunks, { type: (recorder && recorder.mimeType) || 'audio/webm' });
        chunks = [];
        if (discard) { discard = false; return; }
        if (blob.size < 1500) { showToast("I didn't hear anything — hold the phone closer and try again."); return; }

        micBtn.disabled = true;
        const bubble = addMsg('🎤 …', 'user');
        try {
          const wavB64 = await blobToWavBase64(blob);
          await voiceRespond(wavB64, bubble);
        } catch (err) {
          console.error('Audio processing error:', err);
          bubble.remove();
          showToast("Couldn't process that recording — please try again.");
        } finally {
          micBtn.disabled = false;
        }
      }

      function stopRec(cancel) {
        clearTimeout(recTimer);
        if (cancel) discard = true;
        recording = false;
        setRecUi(false);
        if (recorder && recorder.state !== 'inactive') recorder.stop();
        else releaseStream();
      }

      async function startRec() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
          showToast('Voice input is not supported in this browser.');
          return;
        }
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          showToast('Microphone access was blocked — allow it in your browser settings to use voice.');
          return;
        }
        stopSpeaking();
        chunks = [];
        discard = false;
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.onstop = onRecordingDone;
        recorder.start();
        recording = true;
        setRecUi(true);
        recTimer = setTimeout(() => stopRec(false), 30000); // 30 s max
      }

      micBtn.addEventListener('click', () => { recording ? stopRec(false) : startRec(); });

      // Closing the chat cancels any recording and silences the voice.
      panel.querySelector('.chat-close')?.addEventListener('click', () => {
        stopSpeaking();
        if (recording) stopRec(true);
      });
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

  /* ---------- real diagnosis via /api/diagnose (Gemini vision) ---------- */
  const escapeHtmlText = (str) => String(str).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const uiLang = () => { try { return localStorage.getItem('leafaid-lang') || 'en'; } catch (e) { return 'en'; } };

  // Shrink the photo before upload so it stays small and fast.
  function resizeImage(file, maxSide = 1024, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read this image')); };
      img.src = url;
    });
  }

  const ICON_BUSY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
  const ICON_IDLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/></svg>';

  function setDropzoneBusy(busy) {
    if (!dropzone) return;
    dropzone.querySelector('h4').textContent = busy ? 'Analyzing leaf image…' : 'Drop a new leaf photo to re-scan';
    dropzone.querySelector('.dz-icon').innerHTML = busy ? ICON_BUSY : ICON_IDLE;
    dropzone.style.pointerEvents = busy ? 'none' : '';
  }

  function renderResult(imgSrc, pick) {
    resultWrap.querySelector('.preview-box img').src = imgSrc;
    resultWrap.querySelector('.disease-name').textContent = pick.name;
    resultWrap.querySelector('.crop-line').textContent = 'Detected on ' + pick.crop + ' leaf';
    resultWrap.querySelector('.bar-fill').style.width = pick.confidence + '%';
    resultWrap.querySelector('.bar-confidence-val').textContent = pick.confidence + '% confidence';
    const sevTag = resultWrap.querySelector('.severity-pill');
    sevTag.textContent = pick.severity.toUpperCase() + ' SEVERITY';
    sevTag.className = 'mini-tag severity-pill sev-' + pick.severity;

    const reasonList = resultWrap.querySelector('.reason-list');
    reasonList.innerHTML = (pick.reasons || []).map(r => `<div class="reason-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span>${escapeHtmlText(r)}</span></div>`).join('')
      + '<p style="margin-top:10px;font-size:.78rem;color:var(--ink-500);">AI estimate — confirm with a local agronomist before treating.</p>';

    resultWrap.querySelector('.tab-panel.symptoms').textContent = pick.symptoms || '—';
    resultWrap.querySelector('.tab-panel.treatment').textContent = pick.treatment || '—';
    resultWrap.querySelector('.tab-panel.prevention').textContent = pick.prevention || '—';

    window.__lastDiagnosis = { name: pick.name, crop: pick.crop, confidence: pick.confidence, severity: pick.severity };

    resultWrap.classList.add('show');
    resultWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Diagnosis complete — ' + pick.name);

    document.dispatchEvent(new CustomEvent('leafaid:diagnosis', {
      detail: { name: pick.name, crop: pick.crop, confidence: pick.confidence, severity: pick.severity, imgSrc }
    }));
  }

  async function handleFile(file) {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) { showToast('Please choose an image file'); return; }

    setDropzoneBusy(true);
    try {
      const imgSrc = await resizeImage(file);
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imgSrc, lang: uiLang() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Analysis failed');

      if (!data.is_plant_leaf) {
        showToast("This doesn't look like a plant leaf — try a clear, close-up photo of one leaf.");
        return;
      }
      renderResult(imgSrc, data);
    } catch (err) {
      console.error('Diagnosis error:', err);
      showToast('Could not analyze this photo — please try again.');
    } finally {
      setDropzoneBusy(false);
      if (fileInput) fileInput.value = '';
      const camInput = document.getElementById('cameraInput');
      if (camInput) camInput.value = '';
    }
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

    // "Take photo" (phones): open the camera directly instead of the gallery.
    const cameraBtn = document.getElementById('cameraBtn');
    const cameraInput = document.getElementById('cameraInput');
    if (cameraBtn && cameraInput) {
      cameraBtn.addEventListener('click', (e) => { e.stopPropagation(); cameraInput.click(); });
      cameraInput.addEventListener('change', () => handleFile(cameraInput.files[0]));
    }
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
