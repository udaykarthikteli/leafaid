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
   Scan notes — toggle the editor open, and save edits to Supabase.
   Delegated on document since rows are re-rendered on every load.
--------------------------------------------------------------- */
document.addEventListener('click', async (e) => {
  const toggleBtn = e.target.closest('.note-toggle-btn');
  if (toggleBtn) {
    const editor = toggleBtn.nextElementSibling;
    if (editor) editor.hidden = !editor.hidden;
    return;
  }

  const saveBtn = e.target.closest('.note-save-btn');
  if (saveBtn) {
    const item = saveBtn.closest('.history-item');
    const scanId = item?.dataset.scanId;
    const textarea = item?.querySelector('.note-textarea');
    if (!scanId || !textarea) return;

    const notes = textarea.value.trim();
    const original = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    const { error } = await supabaseClient.from('scans').update({ notes }).eq('id', scanId);

    if (error) {
      saveBtn.disabled = false;
      saveBtn.textContent = original;
      authError('Could not save note — try again.');
      return;
    }

    showToast ? showToast('Note saved') : null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) loadScans(session.user.id);
  }
});

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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function rowHtml(scan) {
    const when = new Date(scan.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const thumb = scan.image_url || thumbMap[scan.severity] || thumbMap.low;
    const notes = scan.notes || '';
    return `<div class="history-item" data-scan-id="${scan.id}" data-feedback="${scan.feedback || ''}">
      <div class="history-thumb"><img src="${thumb}" alt=""></div>
      <div class="h-body">
        <strong>${escapeHtml(scan.disease_name)}${scan.crop ? ' — ' + escapeHtml(scan.crop) : ''}</strong><span>${when} · ${scan.confidence || 0}% confidence</span>
        <div class="note-area">
          ${notes ? `<p class="note-preview">📝 ${escapeHtml(notes)}</p>` : ''}
          <button class="note-toggle-btn" type="button">${notes ? 'Edit note' : '+ Add note'}</button>
          <div class="note-editor" hidden>
            <textarea class="note-textarea" placeholder="What did you do about this scan?">${escapeHtml(notes)}</textarea>
            <button class="note-save-btn" type="button">Save note</button>
          </div>
        </div>
      </div>
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

/* ---------------------------------------------------------------
   FORGOT PASSWORD
--------------------------------------------------------------- */
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = forgotForm.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const email = document.getElementById('forgotEmail').value.trim();
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password.html'
    });

    btn.disabled = false;
    btn.textContent = 'Send reset link';

    if (error) { authError(error.message); return; }
    forgotForm.hidden = true;
    document.getElementById('forgotSuccess').hidden = false;
  });
}

/* ---------------------------------------------------------------
   RESET PASSWORD (landing page from the emailed link)
--------------------------------------------------------------- */
const resetForm = document.getElementById('resetForm');
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (pw !== confirm) { authError("Passwords don't match."); return; }
    if (pw.length < 6) { authError('Password must be at least 6 characters.'); return; }

    const btn = resetForm.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Updating…';

    const { error } = await supabaseClient.auth.updateUser({ password: pw });

    if (error) {
      btn.disabled = false;
      btn.textContent = 'Update password';
      authError(error.message);
      return;
    }
    showToast ? showToast('Password updated') : null;
    window.location.href = 'dashboard.html';
  });
}

/* ---------------------------------------------------------------
   FEEDBACK (thumbs up/down) — auto-injected into scan rows
--------------------------------------------------------------- */
function feedbackRowHtml(current) {
  return `<div class="feedback-row">
    <span>Helpful?</span>
    <button class="feedback-btn up ${current === 'up' ? 'active' : ''}" type="button" data-fb="up" aria-label="Mark helpful">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h12.6a2 2 0 0 0 2-1.7l1.4-8a2 2 0 0 0-2-2.3H15V5a3 3 0 0 0-3-3l-3 7"/></svg>
    </button>
    <button class="feedback-btn down ${current === 'down' ? 'active' : ''}" type="button" data-fb="down" aria-label="Mark not helpful">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2v11M22 11V4a2 2 0 0 0-2-2H7.4a2 2 0 0 0-2 1.7L4 11.7a2 2 0 0 0 2 2.3H9v5a3 3 0 0 0 3 3l3-7"/></svg>
    </button>
  </div>`;
}

function injectFeedbackRows(root) {
  root.querySelectorAll('.history-item').forEach(item => {
    if (item.querySelector('.feedback-row')) return;
    const body = item.querySelector('.h-body');
    if (!body) return;
    body.insertAdjacentHTML('beforeend', feedbackRowHtml(item.dataset.feedback || ''));
  });
}

document.querySelectorAll('#page-history .panel, #page-overview .panel').forEach(panel => {
  injectFeedbackRows(panel);
  new MutationObserver(() => injectFeedbackRows(panel)).observe(panel, { childList: true });
});

document.addEventListener('click', async (e) => {
  const fbBtn = e.target.closest('.feedback-btn');
  if (!fbBtn) return;
  const item = fbBtn.closest('.history-item');
  const scanId = item?.dataset.scanId;
  if (!scanId) return;

  const isActive = fbBtn.classList.contains('active');
  const newValue = isActive ? null : fbBtn.dataset.fb;

  const { error } = await supabaseClient.from('scans').update({ feedback: newValue }).eq('id', scanId);
  if (!error) {
    item.dataset.feedback = newValue || '';
    item.querySelectorAll('.feedback-btn').forEach(b => b.classList.toggle('active', b.dataset.fb === newValue));
  }
});

/* ---------------------------------------------------------------
   AVATAR — apply saved avatar on load, handle new uploads
--------------------------------------------------------------- */
function applyAvatar(url) {
  document.querySelectorAll('.side-user .avatar, #avatarPreview').forEach(el => {
    el.style.backgroundImage = `url('${url}')`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
  });
}

(async function initAvatar() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session?.user?.user_metadata?.avatar_url) {
    applyAvatar(session.user.user_metadata.avatar_url);
  }
})();

const avatarInput = document.getElementById('avatarInput');
const avatarUploadBtn = document.getElementById('avatarUploadBtn');
avatarUploadBtn?.addEventListener('click', () => avatarInput.click());
avatarInput?.addEventListener('change', async () => {
  const file = avatarInput.files[0];
  if (!file) return;
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return;
  const path = `${session.user.id}/avatar.jpg`;

  const original = avatarUploadBtn.textContent;
  avatarUploadBtn.textContent = 'Uploading…';
  const { error: upErr } = await supabaseClient.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type || 'image/jpeg' });
  if (upErr) { authError('Could not upload photo.'); avatarUploadBtn.textContent = original; return; }

  const { data: pub } = supabaseClient.storage.from('avatars').getPublicUrl(path);
  const avatarUrl = pub.publicUrl + '?t=' + Date.now();

  await supabaseClient.auth.updateUser({ data: { avatar_url: avatarUrl } });
  applyAvatar(avatarUrl);
  avatarUploadBtn.textContent = original;
  showToast ? showToast('Profile photo updated') : null;
});
