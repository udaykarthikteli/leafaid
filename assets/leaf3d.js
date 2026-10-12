/* ===================== Leaf Aid — 3D layered leaf viewer (education mode) =====================
   After a scan, adds a "View in 3D layers" button. The viewer shows the leaf as a gently curved
   3D sheet you can rotate, zoom and "explode" into layers:
     1. Leaf photo   2. Vein & structure (edge detection)   3. Health map (colour analysis)
     4. Defect zones (AI-flagged boxes + damaged pixels)
   Uses Three.js (loaded on demand from jsDelivr, pinned). Listens to the 'leafaid:diagnosis' event.
================================================================================================ */
(() => {
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  let last = null, threePromise = null, viewer = null, overlay = null;

  const LAYERS = [
    { id: 'photo',  name: 'Leaf photo',        note: 'Your original image.', sw: '#49A87A' },
    { id: 'veins',  name: 'Vein & structure',  note: 'Edges in the image: veins, margins and lesion borders.', sw: '#DFFFF0' },
    { id: 'health', name: 'Health map',        note: 'Green = healthy, yellow = yellowing (chlorosis), brown = dead tissue (necrosis).', sw: 'linear-gradient(90deg,#2ecc71,#facc15,#925428)' },
    { id: 'defect', name: 'Defect zones',      note: 'Areas flagged as diseased, numbered below.', sw: '#ff3b30' }
  ];

  /* ---------- styles ---------- */
  const style = document.createElement('style');
  style.textContent = `
  .l3d-ov{position:fixed;inset:0;z-index:3000;display:none;align-items:center;justify-content:center;padding:14px;background:rgba(6,31,23,.82);backdrop-filter:blur(6px)}
  .l3d-ov.open{display:flex}
  .l3d-card{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 330px;width:min(1120px,100%);height:min(740px,100%);background:var(--surface);color:var(--ink-900);border-radius:var(--radius-l);overflow:hidden;box-shadow:var(--shadow-soft)}
  .l3d-stage{position:relative;min-height:0;background:radial-gradient(circle at 50% 40%,#134430,#061F17 75%);touch-action:none;cursor:grab}
  .l3d-stage:active{cursor:grabbing}
  .l3d-stage canvas{display:block;width:100%;height:100%}
  .l3d-hint{position:absolute;left:14px;bottom:12px;font-size:.78rem;color:rgba(255,255,255,.72);pointer-events:none}
  .l3d-load{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:.95rem;pointer-events:none}
  .l3d-side{overflow:auto;padding:52px 20px 20px;display:flex;flex-direction:column;gap:14px;font-size:.88rem}
  .l3d-side h3{font-size:1.1rem;margin:0}
  .l3d-side small{color:var(--ink-500);display:block;line-height:1.45}
  .l3d-x{position:absolute;top:12px;right:12px;z-index:3;width:36px;height:36px;border-radius:50%;border:1px solid var(--mist-200);background:var(--surface);color:var(--ink-900);cursor:pointer;font-size:1.1rem;line-height:1}
  .l3d-row{display:flex;gap:10px;align-items:flex-start;cursor:pointer}
  .l3d-row input{margin-top:3px;accent-color:var(--canopy-500)}
  .l3d-sw{flex:none;width:16px;height:16px;border-radius:5px;margin-top:2px;border:1px solid rgba(0,0,0,.15)}
  .l3d-btns{display:flex;flex-wrap:wrap;gap:8px}
  .l3d-btn{border:1px solid var(--mist-200);background:var(--surface-2);color:var(--ink-900);border-radius:999px;padding:8px 12px;font-size:.82rem;cursor:pointer}
  .l3d-btn:hover,.l3d-btn.on{background:var(--canopy-500);color:#fff;border-color:var(--canopy-500)}
  .l3d-box{background:var(--surface-2);border-radius:var(--radius-s);padding:12px 14px;line-height:1.5}
  .l3d-box ol{margin:6px 0 0;padding-left:20px}
  .l3d-range{width:100%;accent-color:var(--canopy-500)}
  @media(max-width:820px){.l3d-card{grid-template-columns:1fr;grid-template-rows:minmax(0,50%) minmax(0,50%)}.l3d-side{padding-top:16px}}
  `;
  document.head.appendChild(style);

  /* ---------- entry point: button appears after every diagnosis ---------- */
  document.addEventListener('leafaid:diagnosis', (e) => { last = e.detail; addButton(); });

  function addButton() {
    const card = document.querySelector('#resultWrap .diagnosis-card');
    if (!card || document.getElementById('leaf3dBtn')) return;
    const b = document.createElement('button');
    b.id = 'leaf3dBtn'; b.type = 'button'; b.className = 'btn btn-primary btn-block'; b.style.marginTop = '14px';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg> View in 3D layers';
    b.addEventListener('click', openViewer);
    card.appendChild(b);
  }

  /* ---------- modal shell (built once) ---------- */
  function ensureModal() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'l3d-ov';
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', '3D leaf viewer');
    overlay.innerHTML = `
      <div class="l3d-card">
        <button class="l3d-x" type="button" aria-label="Close 3D viewer">✕</button>
        <div class="l3d-stage"><div class="l3d-load">Building 3D model…</div><div class="l3d-hint">Drag to rotate · scroll / pinch to zoom</div></div>
        <aside class="l3d-side">
          <div><h3 class="l3d-title"></h3><small class="l3d-sub"></small></div>
          <div class="l3d-box l3d-stats"></div>
          <div><b>Layers</b>${LAYERS.map(L => `
            <label class="l3d-row" style="margin-top:10px"><input type="checkbox" data-layer="${L.id}" checked>
              <i class="l3d-sw" style="background:${L.sw}"></i><span><b>${L.name}</b><small>${L.note}</small></span></label>`).join('')}
          </div>
          <div><b>Separate layers</b><input class="l3d-range" type="range" min="0" max="1" step="0.01" value="0.5" aria-label="Layer separation"></div>
          <div class="l3d-btns">
            <button class="l3d-btn" type="button" data-act="all">All layers</button>
            <button class="l3d-btn" type="button" data-act="defects">Defects only</button>
            <button class="l3d-btn" type="button" data-act="roll">⟳ Rotate 90°</button>
            <button class="l3d-btn" type="button" data-act="flip">Flip</button>
            <button class="l3d-btn" type="button" data-act="auto">Auto-spin</button>
            <button class="l3d-btn" type="button" data-act="reset">Reset view</button>
          </div>
          <div class="l3d-box l3d-lesions"></div>
          <div class="l3d-box l3d-symptoms"></div>
          <small>Educational view: layers come from AI analysis plus simple colour/edge detection on your photo. It is an estimate, not a lab result.</small>
        </aside>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.l3d-x').addEventListener('click', closeViewer);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeViewer(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeViewer(); });
  }

  const $ = (sel) => overlay.querySelector(sel);

  async function openViewer() {
    if (!last) return;
    ensureModal();
    overlay.classList.add('open'); document.body.style.overflow = 'hidden';
    $('.l3d-load').style.display = 'grid';
    try {
      if (!threePromise) threePromise = import(THREE_URL).catch((err) => { threePromise = null; throw err; });
      const [THREE, img] = await Promise.all([threePromise, loadImage(last.imgSrc)]);
      if (!overlay.classList.contains('open')) return;
      startViewer(THREE, img);
    } catch (err) {
      console.error('3D viewer error:', err);
      closeViewer();
      if (window.showToast) showToast('3D view needs an internet connection and WebGL support.');
    }
  }

  function loadImage(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  /* ---------- image analysis → layer textures ---------- */
  function analyse(img, lesions, healthy) {
    const S = 512, sc = Math.min(1, S / Math.max(img.width, img.height));
    const W = Math.max(8, Math.round(img.width * sc)), H = Math.max(8, Math.round(img.height * sc));
    const base = document.createElement('canvas'); base.width = W; base.height = H;
    const bctx = base.getContext('2d', { willReadFrequently: true });
    bctx.drawImage(img, 0, 0, W, H);
    const px = bctx.getImageData(0, 0, W, H).data;
    const layer = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); return { c, x, d: x.createImageData(W, H) }; };
    const health = layer(), defect = layer(), veins = layer();

    // AI boxes (0-1000, [ymin,xmin,ymax,xmax]) → pixel boxes, padded 10%
    const boxes = lesions.map((l) => {
      const [y1, x1, y2, x2] = l.box, py = (y2 - y1) * 0.1, pxx = (x2 - x1) * 0.1;
      return { x1: (x1 - pxx) / 1000 * W, x2: (x2 + pxx) / 1000 * W, y1: (y1 - py) / 1000 * H, y2: (y2 + py) / 1000 * H };
    });
    const useRegion = !healthy;
    const inRegion = (x, y) => boxes.length === 0 || boxes.some((b) => x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2);

    const gray = new Float32Array(W * H);
    let leafPx = 0, badPx = 0;
    for (let i = 0, p = 0; i < W * H; i++, p += 4) {
      const r = px[p] / 255, g = px[p + 1] / 255, b = px[p + 2] / 255;
      gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      const mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
      if (d === 0 || d / mx < 0.18 || mx < 0.1) continue;           // grey/white/shadow = background
      let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
      let col, bad = false;
      if (h >= 70 && h <= 170) col = [46, 204, 113, 120];            // healthy green
      else if (h >= 38 && h < 70) { col = [250, 204, 21, 190]; bad = true; }   // yellowing
      else if (h < 38 || h >= 330) { col = [146, 84, 40, 210]; bad = true; }   // brown / necrotic
      else continue;                                                  // blues/purples ignored
      leafPx++;
      health.d.data.set(col, p);
      if (bad && useRegion && inRegion(i % W, (i / W) | 0)) { badPx++; defect.d.data.set([255, 59, 48, 235], p); }
    }
    // Sobel edges → vein/structure layer
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = -gray[i - W - 1] - 2 * gray[i - 1] - gray[i + W - 1] + gray[i - W + 1] + 2 * gray[i + 1] + gray[i + W + 1];
      const gy = -gray[i - W - 1] - 2 * gray[i - W] - gray[i - W + 1] + gray[i + W - 1] + 2 * gray[i + W] + gray[i + W + 1];
      const m = Math.hypot(gx, gy);
      if (m > 0.6) veins.d.data.set([225, 255, 240, Math.min(255, m * 260)], i * 4);
    }
    [health, defect, veins].forEach((l) => l.x.putImageData(l.d, 0, 0));

    // numbered outlines for AI-flagged areas
    const dx = defect.x; dx.lineWidth = Math.max(2, W / 170); dx.strokeStyle = '#ff3b30'; dx.shadowColor = '#ff3b30'; dx.shadowBlur = 8;
    dx.font = `bold ${Math.round(W / 24)}px sans-serif`; dx.textAlign = 'center'; dx.textBaseline = 'middle';
    boxes.forEach((b, n) => {
      dx.strokeRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1);
      const r = W / 36, cx = Math.max(r, b.x1), cy = Math.max(r, b.y1);
      dx.shadowBlur = 0; dx.fillStyle = '#ff3b30'; dx.beginPath(); dx.arc(cx, cy, r, 0, 7); dx.fill();
      dx.fillStyle = '#fff'; dx.fillText(String(n + 1), cx, cy + 1); dx.shadowBlur = 8;
    });
    return { maps: { veins: veins.c, health: health.c, defect: defect.c }, pct: leafPx ? badPx / leafPx * 100 : 0, leafPx };
  }

  /* ---------- Three.js scene ---------- */
  function startViewer(THREE, img) {
    stopViewer();
    const lesions = last.lesions || [], healthy = !!last.healthy;
    const { maps, pct } = analyse(img, lesions, healthy);

    // side panel text (textContent only — safe)
    $('.l3d-title').textContent = last.name || 'Leaf';
    $('.l3d-sub').textContent = (last.crop && last.crop !== 'Unknown' ? last.crop + ' · ' : '') + (last.severity || '').toUpperCase() + ' severity';
    $('.l3d-stats').textContent = healthy
      ? 'No disease flagged — this leaf looks healthy.'
      : `About ${pct < 1 ? '<1' : Math.round(pct)}% of the visible leaf area looks affected (rough colour-based estimate).`;
    const les = $('.l3d-lesions'); les.textContent = '';
    if (lesions.length) {
      const t = document.createElement('b'); t.textContent = 'Defect zones'; les.appendChild(t);
      const ol = document.createElement('ol');
      lesions.forEach((l) => { const li = document.createElement('li'); li.textContent = l.label || 'Affected area'; ol.appendChild(li); });
      les.appendChild(ol);
    } else les.style.display = 'none';
    if (lesions.length) les.style.display = '';
    const sym = document.querySelector('#resultWrap .tab-panel.symptoms')?.textContent?.trim();
    const symBox = $('.l3d-symptoms'); symBox.textContent = ''; symBox.style.display = sym ? '' : 'none';
    if (sym) { const t = document.createElement('b'); t.textContent = 'What to look for'; const p = document.createElement('div'); p.textContent = sym; symBox.append(t, p); }

    const stage = $('.l3d-stage');
    const w = stage.clientWidth || 600, h = stage.clientHeight || 500;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    stage.insertBefore(renderer.domElement, stage.firstChild);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
    let zoomTarget = 4.4; camera.position.z = zoomTarget;
    const root = new THREE.Group(); root.rotation.order = 'YXZ'; scene.add(root);

    const aspect = img.width / img.height, pw = aspect >= 1 ? 2.4 : 2.4 * aspect, ph = aspect >= 1 ? 2.4 / aspect : 2.4;
    const makeGeo = () => {          // gentle leaf-like curl: cupped sides, drooping tip, slight ripple
      const g = new THREE.PlaneGeometry(pw, ph, 48, 48), p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const nx = p.getX(i) / (pw / 2), ny = p.getY(i) / (ph / 2);
        p.setZ(i, 0.16 * (1 - nx * nx) - 0.1 * ny * ny + 0.03 * Math.sin(nx * 4) * ny);
      }
      g.computeVertexNormals(); return g;
    };
    const textures = [], meshes = {};
    const tex = (src) => { const t = new THREE.Texture(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.needsUpdate = true; textures.push(t); return t; };
    const sources = { photo: img, veins: maps.veins, health: maps.health, defect: maps.defect };
    LAYERS.forEach((L, i) => {
      const m = new THREE.Mesh(makeGeo(), new THREE.MeshBasicMaterial({ map: tex(sources[L.id]), transparent: i > 0, side: THREE.DoubleSide, depthWrite: i === 0 }));
      m.renderOrder = i; root.add(m); meshes[L.id] = m;
    });

    const state = { x: -0.25, y: 0.45, vx: 0, vy: 0, roll: 0, rollTarget: 0, auto: false, explode: 0.5, dragging: false };
    const layout = () => { const gap = 0.05 + 0.5 * state.explode; LAYERS.forEach((L, i) => { meshes[L.id].position.z = (i - 1.5) * gap; }); };
    layout();

    /* pointer: drag = rotate, two fingers = pinch zoom */
    const el = renderer.domElement, ptrs = new Map(); let pinch = 0;
    const onDown = (e) => { el.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, e); state.dragging = true; state.vx = state.vy = 0; };
    const onMove = (e) => {
      if (!ptrs.has(e.pointerId)) return;
      const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, e);
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pinch) zoomTarget = Math.max(1.8, Math.min(7, zoomTarget * (pinch / d)));
        pinch = d; return;
      }
      state.vy = (e.clientX - prev.clientX) * 0.008; state.vx = (e.clientY - prev.clientY) * 0.008;
      state.y += state.vy; state.x = Math.max(-1.5, Math.min(1.5, state.x + state.vx));
    };
    const onUp = (e) => { ptrs.delete(e.pointerId); pinch = 0; if (!ptrs.size) state.dragging = false; };
    const onWheel = (e) => { e.preventDefault(); zoomTarget = Math.max(1.8, Math.min(7, zoomTarget * (1 + e.deltaY * 0.001))); };
    el.addEventListener('pointerdown', onDown); el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp); el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    /* side controls */
    const boxesEls = [...overlay.querySelectorAll('input[data-layer]')];
    const setLayers = (map) => boxesEls.forEach((c) => { c.checked = !!map[c.dataset.layer]; meshes[c.dataset.layer].visible = c.checked; });
    const onChange = (e) => {
      if (e.target.matches('input[data-layer]')) meshes[e.target.dataset.layer].visible = e.target.checked;
      if (e.target.matches('.l3d-range')) { state.explode = +e.target.value; layout(); }
    };
    const autoBtn = overlay.querySelector('[data-act="auto"]');
    const onClick = (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act; if (!act) return;
      if (act === 'all') setLayers({ photo: 1, veins: 1, health: 1, defect: 1 });
      if (act === 'defects') setLayers({ defect: 1 });
      if (act === 'roll') state.rollTarget += Math.PI / 2;
      if (act === 'flip') state.y += Math.PI;
      if (act === 'auto') { state.auto = !state.auto; autoBtn.classList.toggle('on', state.auto); }
      if (act === 'reset') { Object.assign(state, { x: -0.25, y: 0.45, vx: 0, vy: 0, rollTarget: 0, roll: 0 }); zoomTarget = 4.4; }
    };
    overlay.addEventListener('change', onChange); overlay.addEventListener('click', onClick);
    setLayers({ photo: 1, veins: 1, health: 1, defect: 1 });
    overlay.querySelector('.l3d-range').value = 0.5; autoBtn.classList.remove('on');

    const onResize = () => {
      const W = stage.clientWidth, H = stage.clientHeight; if (!W || !H) return;
      renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    viewer = { raf: 0, cleanup: () => {
      cancelAnimationFrame(viewer.raf);
      el.removeEventListener('pointerdown', onDown); el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp); el.removeEventListener('pointercancel', onUp); el.removeEventListener('wheel', onWheel);
      overlay.removeEventListener('change', onChange); overlay.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      Object.values(meshes).forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
      textures.forEach((t) => t.dispose());
      renderer.dispose(); el.remove();
    } };

    $('.l3d-load').style.display = 'none';
    const tick = () => {
      viewer.raf = requestAnimationFrame(tick);
      if (!state.dragging) {
        if (state.auto) state.y += 0.006;
        state.y += state.vy; state.x = Math.max(-1.5, Math.min(1.5, state.x + state.vx));
        state.vx *= 0.92; state.vy *= 0.92;
      }
      state.roll += (state.rollTarget - state.roll) * 0.12;
      root.rotation.set(state.x, state.y, state.roll);
      camera.position.z += (zoomTarget - camera.position.z) * 0.15;
      renderer.render(scene, camera);
    };
    tick();
  }

  function stopViewer() { if (viewer) { viewer.cleanup(); viewer = null; } }

  function closeViewer() {
    stopViewer();
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
})();
