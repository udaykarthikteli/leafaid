/* ===================== Leaf Aid — real auth & scan history =====================
   Requires assets/supabase-config.js (defines `supabaseClient`) to be
   loaded first, and the Supabase JS CDN script loaded before that.
=================================================================================== */

function authError(msg) {
  window.showToast ? showToast(msg) : alert(msg);
}

/* ---------------------------------------------------------------
   LOGIN PAGE
--------------------------------------------------------------- */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Logging in…';

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      btn.disabled = false;
      btn.textContent = original;
      authError(error.message);
      return;
    }
    window.location.href = 'dashboard.html';
  });
}

/* ---------------------------------------------------------------
   SIGNUP PAGE
--------------------------------------------------------------- */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = signupForm.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Creating account…';

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const growerType = document.getElementById('growerType').value;
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, grower_type: growerType }
      }
    });

    if (error) {
      btn.disabled = false;
      btn.textContent = original;
      authError(error.message);
      return;
    }
    window.location.href = 'dashboard.html';
  });
}

/* ---------------------------------------------------------------
   DASHBOARD: auth guard + user info + logout + scan history
--------------------------------------------------------------- */
const isDashboard = document.body.contains(document.querySelector('.app-shell'));

if (isDashboard) {
  (async function initDashboard() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    const user = session.user;
    const displayName = user.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
      : user.email.split('@')[0];

    document.querySelectorAll('.side-user strong').forEach(el => el.textContent = displayName);
    document.querySelectorAll('.side-user span').forEach(el => el.textContent = user.user_metadata?.grower_type || user.email);
    document.querySelectorAll('.page-head h1').forEach(el => {
      if (el.textContent.includes('Welcome back')) el.textContent = `Welcome back, ${displayName.split(' ')[0]} 🌿`;
    });

    // logout
    const logoutBtn = document.querySelector('.icon-btn[aria-label="Log out"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await supabaseClient.auth.signOut();
        window.location.href = 'index.html';
      });
    }

    loadScans(user.id);
  })();
}

/* ---------------------------------------------------------------
   Fetch this user's scans and render into Recent scans + History
--------------------------------------------------------------- */
async function loadScans(userId) {
  const { data, error } = await supabaseClient
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }

  const thumbMap = {
    high: 'assets/thumb-blight.svg',
    medium: 'assets/thumb-mildew.svg',
    low: 'assets/thumb-insect.svg'
  };

  function rowHtml(scan) {
    const when = new Date(scan.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const thumb = scan.image_url || thumbMap[scan.severity] || thumbMap.low;
    return `<div class="history-item">
      <div class="history-thumb"><img src="${thumb}" alt=""></div>
      <div class="h-body"><strong>${scan.disease_name}${scan.crop ? ' — ' + scan.crop : ''}</strong><span>${when} · ${scan.confidence || 0}% confidence</span></div>
      <span class="status-dot ${scan.severity || 'low'}"></span>
    </div>`;
  }

  // History page — full list
  const historyPanel = document.querySelector('#page-history .panel');
  if (historyPanel) {
    historyPanel.innerHTML = data.length
      ? data.map(rowHtml).join('')
      : `<p style="color:var(--ink-500);font-size:.9rem;padding:20px 0;">No scans yet — run a diagnosis to see it here.</p>`;
  }

  // Overview — recent scans (top 4) + live scan count
  const recentPanel = document.querySelector('#page-overview .panel .history-item')?.closest('.panel');
  if (recentPanel) {
    const list = recentPanel.querySelectorAll('.history-item');
    const recent = data.slice(0, 4);
    if (recent.length) {
      recentPanel.querySelectorAll('.history-item').forEach(el => el.remove());
      recentPanel.insertAdjacentHTML('beforeend', recent.map(rowHtml).join(''));
    }
  }

  const scanCountEl = document.querySelector('.stat-card h3');
  if (scanCountEl) scanCountEl.textContent = data.length;
}

/* ---------------------------------------------------------------
   Save a completed (simulated) diagnosis to Supabase — image
   upload to Storage, then a row into the `scans` table.
   Listens for the 'leafaid:diagnosis' event dispatched by script.js
--------------------------------------------------------------- */
document.addEventListener('leafaid:diagnosis', async (e) => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return;
  const user = session.user;
  const { name, crop, confidence, severity, imgSrc } = e.detail;

  try {
    // data URL -> blob
    const res = await fetch(imgSrc);
    const blob = await res.blob();
    const path = `${user.id}/${Date.now()}.jpg`;

    const { error: uploadError } = await supabaseClient.storage
      .from('leaf-photos')
      .upload(path, blob, { contentType: blob.type || 'image/jpeg' });

    let imageUrl = null;
    if (!uploadError) {
      const { data: pub } = supabaseClient.storage.from('leaf-photos').getPublicUrl(path);
      imageUrl = pub.publicUrl;
    }

    await supabaseClient.from('scans').insert({
      user_id: user.id,
      disease_name: name,
      crop,
      confidence,
      severity,
      image_url: imageUrl
    });

    loadScans(user.id);
  } catch (err) {
    console.error('Could not save scan:', err);
  }
});
