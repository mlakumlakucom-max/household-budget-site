// DompetKeluarga — router hash, state, dan semua interaksi.
// State: bulan aktif, transaksi, anggaran, tujuan. Perubahan pengguna tersimpan
// di localStorage peramban (dibungkus try/catch) dan langsung mengubah semua halaman.

import { HOUSEHOLD, TRANSACTIONS, DEFAULT_BUDGETS, GOALS, CATEGORIES, INCOME_CATEGORIES } from './data.js';
import { VIEWS } from './views.js';

const STORE_KEY = 'dompetkeluarga-v1';

function loadState() {
  const base = {
    month: HOUSEHOLD.month,
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    budgets: { ...DEFAULT_BUDGETS },
    goals: GOALS.map((g) => ({ ...g })),
    filter: { type: 'all', cat: 'all' },
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved && Array.isArray(saved.transactions)) {
      base.transactions = saved.transactions;
      base.budgets = { ...DEFAULT_BUDGETS, ...(saved.budgets || {}) };
      base.goals = Array.isArray(saved.goals) && saved.goals.length ? saved.goals : base.goals;
      if (saved.month) base.month = saved.month;
    }
  } catch {
    // localStorage tidak tersedia: pakai data contoh saja.
  }
  return base;
}

function saveState(state) {
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ month: state.month, transactions: state.transactions, budgets: state.budgets, goals: state.goals }),
    );
  } catch {
    // Abaikan: situs tetap jalan tanpa penyimpanan.
  }
}

const state = loadState();
const app = document.getElementById('app');

function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const view = VIEWS[hash] || null;
  if (!view) {
    app.innerHTML = `<section class="card"><h1>Halaman tidak ditemukan</h1><p>Rute "${hash}" tidak ada. Kembali ke <a href="#/">Beranda</a>.</p></section>`;
  } else {
    app.innerHTML = view(state);
  }
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + hash);
  });
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  route();
}

// Kategori pada formulir transaksi mengikuti jenis (pengeluaran/pemasukan).
function syncTxCategories() {
  const typeSel = document.getElementById('tx-type');
  const catSel = document.getElementById('tx-cat');
  if (!typeSel || !catSel) return;
  const list = typeSel.value === 'in' ? INCOME_CATEGORIES : CATEGORIES;
  catSel.innerHTML = list.map((c) => `<option value="${c.key}">${c.label}</option>`).join('');
}

document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'set-month' && btn.dataset.month) {
    state.month = btn.dataset.month;
    rerender();
  }
  if (action === 'del-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== btn.dataset.id);
    rerender();
  }
  if (action === 'save-budget') {
    const input = document.querySelector(`input[data-budget="${btn.dataset.cat}"]`);
    const value = Math.max(0, Math.round(Number(input.value) || 0));
    state.budgets[btn.dataset.cat] = value;
    rerender();
  }
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.matches('[data-action="filter-type"]')) {
    state.filter.type = el.value;
    route();
  }
  if (el.matches('[data-action="filter-cat"]')) {
    state.filter.cat = el.value;
    route();
  }
  if (el.id === 'tx-type') syncTxCategories();
});

document.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const form = ev.target;
  if (form.id === 'tx-form') {
    const data = new FormData(form);
    const amount = Math.round(Number(data.get('amount')) || 0);
    if (amount <= 0) return;
    state.transactions.push({
      id: 'u' + Date.now().toString(36),
      date: String(data.get('date') || state.month + '-01'),
      type: String(data.get('type')),
      category: String(data.get('category')),
      note: String(data.get('note') || '').trim() || 'Tanpa catatan',
      amount,
    });
    rerender();
  }
  if (form.id === 'goal-form') {
    const data = new FormData(form);
    const target = Math.round(Number(data.get('target')) || 0);
    if (target <= 0) return;
    state.goals.push({
      id: 'g' + Date.now().toString(36),
      name: String(data.get('name') || '').trim() || 'Tujuan baru',
      target,
      saved: Math.max(0, Math.round(Number(data.get('saved')) || 0)),
      note: 'Dibuat sendiri',
    });
    rerender();
  }
  const goalId = form.dataset.goal;
  if (goalId) {
    const data = new FormData(form);
    const amount = Math.round(Number(data.get('amount')) || 0);
    if (amount <= 0) return;
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal) goal.saved += amount;
    rerender();
  }
});

window.addEventListener('hashchange', route);
route();
