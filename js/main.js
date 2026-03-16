// ── NAV ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  addEventListener(
    'scroll',
    () => nav.classList.toggle('stuck', scrollY > 30),
    { passive: true }
  );
}

// ── REVEAL ───────────────────────────────────────────────────
const obs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const d = +(el.dataset.d || 0);
      setTimeout(() => el.classList.add('on'), d);
      obs.unobserve(el);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
);
document.querySelectorAll('.rv,.rv-pop').forEach(el => obs.observe(el));

// ── COUNTERS ─────────────────────────────────────────────────
const cObs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const to = +el.dataset.to;
      const t0 = performance.now();
      const dur = 1200;
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(ease(p) * to);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = to;
      };
      requestAnimationFrame(tick);
      cObs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.cnt').forEach(el => cObs.observe(el));

// ── HERO DASHBOARD (desktop vs mobile at load, animated) ──────
const dashMockEl = document.getElementById('dashMock');
const isDesktopDash = window.matchMedia('(min-width: 1025px)').matches;
if (dashMockEl) {
  dashMockEl.classList.remove('dash-mock--mobile', 'dash-mock--desktop');
  dashMockEl.classList.add(isDesktopDash ? 'dash-mock--desktop' : 'dash-mock--mobile');
  document.body.classList.remove('hero-dash-mobile', 'hero-dash-desktop');
  document.body.classList.add(isDesktopDash ? 'hero-dash-desktop' : 'hero-dash-mobile');
  requestAnimationFrame(() => {
    dashMockEl.classList.add('ready');
  });
}

const txns = [
  { ico: '🇵🇪', bg: '#E8F5F1', name: 'Pay-in — Lima', meta: 'Bank transfer · PEN', amt: '+S/ 1,240', pos: true },
  { ico: '🇨🇱', bg: '#E8EEFA', name: 'Pay-in — Santiago', meta: 'ETpay · CLP', amt: '+$42,000', pos: true },
  { ico: '🇨🇴', bg: '#FFF3E8', name: 'Payout — Bogotá', meta: 'Mass payout · COP', amt: '-$185,000', pos: false },
  { ico: '🇲🇽', bg: '#F0EEFF', name: 'Pay-in — CDMX', meta: 'SPEI · MXN', amt: '+$2,400', pos: true },
];

const bars = [35, 55, 42, 68, 52, 78, 91, 65, 80, 74, 88, 95];
const barsEl = document.getElementById('chartBars');
if (barsEl) {
  bars.forEach((h, i) => {
    const b = document.createElement('div');
    b.className = 'bar' + (i >= bars.length - 3 ? ' active' : '');
    b.style.height = '0';
    barsEl.appendChild(b);
    const startMs = 700 + i * 70;
    setTimeout(() => {
      b.style.transition = 'height .6s cubic-bezier(.16,1,.3,1)';
      b.style.height = h + '%';
    }, startMs);
  });
}

const volEl = document.getElementById('volCounter');
const txnEl = document.getElementById('txnCounter');
if (volEl && txnEl) {
  setTimeout(() => {
    const t0 = performance.now();
    (function animVol(now) {
      const p = Math.min((now - t0) / 1800, 1);
      const e = 1 - Math.pow(1 - p, 3);
      volEl.textContent = '$' + Math.round(e * 847200).toLocaleString();
      txnEl.textContent = Math.round(e * 3241).toLocaleString();
      if (p < 1) requestAnimationFrame(animVol);
    })(t0);
  }, 350);
}

const txnsEl = document.getElementById('dmTxns');
if (txnsEl) {
  txns.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = 'dm-txn';
    d.innerHTML = `<div class="txn-ico" style="background:${t.bg}">${t.ico}</div><div class="txn-info"><div class="txn-name">${t.name}</div><div class="txn-meta">${t.meta}</div></div><div style="text-align:right"><div class="txn-amt ${t.pos ? 'pos' : ''}">${t.amt}</div><div class="txn-st">Completed</div></div>`;
    txnsEl.appendChild(d);
    setTimeout(() => d.classList.add('in'), 1100 + i * 220);
  });
}

// ── PRODUCT TABS ─────────────────────────────────────────────
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document
      .querySelectorAll('.ptab')
      .forEach(t => t.classList.remove('active'));
    document
      .querySelectorAll('.prod-panel')
      .forEach(p => p.classList.remove('show'));
    tab.classList.add('active');
    document
      .getElementById('panel-' + tab.dataset.panel)
      .classList.add('show');
    if (tab.dataset.panel === 'payouts') initPayouts();
  });
});

// ── PAYINS TRANSFER FLOW (3 STEPS) ───────────────────────────
const payinMock = document.getElementById('payinMock');
const pmBtn = document.getElementById('payinBtn');
const pmContent = document.getElementById('pmContent');

let currentStep = 1;

function renderStep(step) {
  if (!pmContent) return;

  document
    .querySelectorAll('.pm-step')
    .forEach(el => el.classList.remove('active'));
  const active = document.querySelector(
    `.pm-step[data-step="${step}"]`
  );
  if (active) active.classList.add('active');

  if (step === 1) {
    pmContent.innerHTML = `
      <div class="pm-methods">
        <div class="pm-method sel" data-bank="bancochile">
          <span class="mico">🏦</span>
          <div class="minfo">
            <div class="mname">Banco de Chile</div>
            <div class="msub">Cuenta corriente · **** 4521</div>
          </div>
          <div class="mcheck"></div>
        </div>
        <div class="pm-method" data-bank="santander">
          <span class="mico">🏦</span>
          <div class="minfo">
            <div class="mname">Santander Chile</div>
            <div class="msub">Cuenta vista · **** 7803</div>
          </div>
          <div class="mcheck"></div>
        </div>
        <div class="pm-method" data-bank="scotiabank">
          <span class="mico">🏦</span>
          <div class="minfo">
            <div class="mname">Scotiabank Chile</div>
            <div class="msub">Cuenta corriente · **** 2198</div>
          </div>
          <div class="mcheck"></div>
        </div>
      </div>
    `;
    attachBankSelection();
    if (pmBtn) pmBtn.textContent = 'Continuar con banco';
  } else if (step === 2) {
    pmContent.innerHTML = `
      <div class="pm-2fa">
        <p class="pm-2fa-title">Autoriza el pago en Banco de Chile</p>
        <p class="pm-2fa-sub">Hemos enviado un código 2FA a tu app del banco.</p>
        <div class="pm-2fa-inputs" id="pm2faInputs">
          <input type="text" maxlength="1" inputmode="numeric" data-idx="0">
          <input type="text" maxlength="1" inputmode="numeric" data-idx="1">
          <input type="text" maxlength="1" inputmode="numeric" data-idx="2">
          <input type="text" maxlength="1" inputmode="numeric" data-idx="3">
          <input type="text" maxlength="1" inputmode="numeric" data-idx="4">
          <input type="text" maxlength="1" inputmode="numeric" data-idx="5">
        </div>
        <p class="pm-2fa-hint">Tu código se valida automáticamente cuando lo completas.</p>
      </div>
    `;
    if (pmBtn) pmBtn.textContent = 'Confirmar código';
    startOtpTypingEffect();
  } else if (step === 3) {
    pmContent.innerHTML = `
      <div class="pm-success">
        <div class="pm-success-icon">✓</div>
        <p class="pm-success-title">Pago confirmado</p>
        <p class="pm-success-sub">Tu transferencia se ha recibido correctamente. Estamos redirigiéndote al comercio...</p>
        <div class="pm-success-redirect">
          <span>redirecting to merchant.com</span>
          <div class="pm-success-bar"><div class="pm-success-bar-inner"></div></div>
        </div>
      </div>
    `;
    if (pmBtn) {
      pmBtn.textContent = 'Volver al comercio';
    }
  }
}

function attachBankSelection() {
  document.querySelectorAll('.pm-method').forEach(m => {
    m.addEventListener('click', () => {
      document
        .querySelectorAll('.pm-method')
        .forEach(x => x.classList.remove('sel'));
      m.classList.add('sel');
    });
  });
}

function startOtpTypingEffect() {
  const container = document.getElementById('pm2faInputs');
  if (!container) return;
  const inputs = container.querySelectorAll('input');
  if (inputs.length !== 6) return;
  const otp = '427196';
  let i = 0;
  function typeNext() {
    if (i >= 6) return;
    inputs[i].value = otp[i];
    inputs[i].classList.add('otp-typed');
    inputs[i].focus();
    i++;
    if (i < 6) setTimeout(typeNext, 420);
  }
  setTimeout(typeNext, 500);
}

if (payinMock && pmContent) {
  renderStep(1);
  if (pmBtn) pmBtn.style.display = 'none';
  let autoPlayDone = false;
  const payinObs = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting || autoPlayDone) return;
      autoPlayDone = true;
      currentStep = 1;
      renderStep(1);
      setTimeout(() => {
        currentStep = 2;
        renderStep(2);
      }, 2600);
      setTimeout(() => {
        currentStep = 3;
        renderStep(3);
      }, 5800);
    },
    { threshold: 0.35, rootMargin: '0px' }
  );
  payinObs.observe(payinMock);
}

// ── PAYOUTS ANIMATION ────────────────────────────────────────
function initPayouts() {
  const rows = document.querySelectorAll('.po-recip');
  rows.forEach((r, i) => {
    const prog = r.querySelector('.prog');
    if (!prog) return;
    setTimeout(() => {
      prog.style.width = ['78%', '65%', '92%', '38%'][i];
    }, 300 + i * 350);
  });
}

// ── MAP FEED ─────────────────────────────────────────────────
const feedData = [
  {
    flag: '🇵🇪',
    text: 'Pay-in via Yape · Lima',
    amount: '+S/ 340',
    tag: 'Instant',
  },
  {
    flag: '🇨🇱',
    text: 'Payout via ETpay · Santiago',
    amount: '-$12,000',
    tag: 'Completed',
  },
  {
    flag: '🇧🇷',
    text: 'Pay-in via PIX · São Paulo',
    amount: '+R$ 890',
    tag: 'Instant',
  },
  {
    flag: '🇲🇽',
    text: 'Pay-in via SPEI · CDMX',
    amount: '+$1,800',
    tag: 'Instant',
  },
  {
    flag: '🇨🇴',
    text: 'Payout to Bancolombia',
    amount: '-$45,000',
    tag: 'Completed',
  },
];

const feedEl = document.getElementById('mapFeed');
let fi = 0;

function addFeedItem() {
  if (!feedEl) return;
  const item = feedData[fi % feedData.length];
  const el = document.createElement('div');
  el.className = 'mf-item';
  el.style.animationDelay = '0s';
  el.style.transform = 'translateY(4px)';
  el.innerHTML = `<span class="flag">${item.flag}</span><span>${item.text}</span><span class="amount">${item.amount}</span><span class="tag">${item.tag}</span>`;
  feedEl.prepend(el);
  while (feedEl.children.length > 3) feedEl.removeChild(feedEl.lastChild);
  fi++;
}

if (feedEl) {
  const feedObs = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        addFeedItem();
        setInterval(addFeedItem, 2200);
        feedObs.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  feedObs.observe(feedEl);
}

// ── MODAL START INTEGRATING ───────────────────────────────────
const STORAGE_KEY = 'monnet_leads';

const modal = document.getElementById('integrateModal');
const openBtn = document.getElementById('openIntegrateModal');
const closeBtn = document.getElementById('closeIntegrateModal');
const cancelBtn = document.getElementById('cancelIntegrateModal');
const backdrop = document.getElementById('integrateModalBackdrop');
const form = document.getElementById('integrateForm');
const successEl = document.getElementById('integrateSuccess');
const solPayins = document.getElementById('solPayins');
const solPayouts = document.getElementById('solPayouts');
const payinsMethods = document.getElementById('payinsMethods');
const payoutsMethods = document.getElementById('payoutsMethods');

function openModal() {
  if (!modal) return;
  modal.hidden = false;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
  closeBtn?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.hidden = true;
  document.body.style.overflow = '';
  if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
}

openBtn?.addEventListener('click', openModal);
closeBtn?.addEventListener('click', closeModal);
cancelBtn?.addEventListener('click', closeModal);
backdrop?.addEventListener('click', closeModal);

modal?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function toggleMethods(checkbox, methodsEl) {
  if (!methodsEl) return;
  const on = checkbox?.checked;
  methodsEl.hidden = !on;
  methodsEl.setAttribute('aria-hidden', String(!on));
}

solPayins?.addEventListener('change', () => toggleMethods(solPayins, payinsMethods));
solPayouts?.addEventListener('change', () => toggleMethods(solPayouts, payoutsMethods));

// "Todos" desmarca el resto en su grupo
function bindAllCheckbox(container, allClass) {
  const allCb = container?.querySelector(`.${allClass}`);
  const others = container?.querySelectorAll(`input[type="checkbox"]:not(.${allClass})`);
  allCb?.addEventListener('change', () => {
    if (allCb.checked) others?.forEach(o => { o.checked = false; });
  });
  others?.forEach(o => o.addEventListener('change', () => {
    if (Array.from(others).every(c => c.checked)) allCb.checked = false;
    if (allCb.checked) { allCb.checked = false; }
  }));
}
bindAllCheckbox(payinsMethods, 'payins-all');
bindAllCheckbox(payoutsMethods, 'payouts-all');

function getChecked(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const solutions = getChecked('solutions');
  const payinsMethodsVal = solutions.includes('payins') ? getChecked('payins_methods') : [];
  const payoutsMethodsVal = solutions.includes('payouts') ? getChecked('payouts_methods') : [];

  const payload = {
    name: (form.elements['name']?.value ?? '').trim(),
    email: (form.elements['email']?.value ?? '').trim(),
    company: (form.elements['company']?.value ?? '').trim(),
    phone: (form.elements['phone']?.value ?? '').trim(),
    trxPerMonth: form.elements['trxPerMonth']?.value ?? '',
    avgTicket: form.elements['avgTicket']?.value ?? '',
    industry: form.elements['industry']?.value ?? '',
    solutions,
    payins_methods: payinsMethodsVal,
    payouts_methods: payoutsMethodsVal,
    submittedAt: new Date().toISOString(),
  };

  let list = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (_) {}
  list.push(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  form.hidden = true;
  if (successEl) {
    successEl.hidden = false;
    setTimeout(() => {
      closeModal();
      form.reset();
      form.hidden = false;
      successEl.hidden = true;
      toggleMethods(solPayins, payinsMethods);
      toggleMethods(solPayouts, payoutsMethods);
    }, 1600);
  } else {
    closeModal();
    form.reset();
  }
});

