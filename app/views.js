// DompetKeluarga — halaman-halaman situs (satu fungsi render per rute).
// Setiap halaman dihitung dari state (bulan aktif, transaksi, anggaran, tujuan)
// sehingga semua angka, grafik dan kontrol selalu konsisten.

import { CATEGORIES, INCOME_CATEGORIES, MONTHS, MONTH_SUMMARIES, TIPS } from './data.js';
import { hbarChart, donutChart, monthBars, fmtShort, fmtFull } from './charts.js';

export function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function monthLabel(key) {
  const m = MONTHS.find((x) => x.key === key);
  return m ? m.label : key;
}

export function monthTx(state, key) {
  return state.transactions.filter((t) => t.date.startsWith(key || state.month));
}

export function totalsFor(state, key) {
  const tx = monthTx(state, key);
  let income = 0;
  let expense = 0;
  for (const t of tx) {
    if (t.type === 'in') income += t.amount;
    else expense += t.amount;
  }
  if (tx.length === 0 && MONTH_SUMMARIES[key]) {
    income = MONTH_SUMMARIES[key].income;
    expense = MONTH_SUMMARIES[key].expense;
  }
  return { income, expense, balance: income - expense };
}

export function catTotals(state, key) {
  const tx = monthTx(state, key);
  const out = {};
  for (const c of CATEGORIES) out[c.key] = 0;
  for (const t of tx) {
    if (t.type === 'out' && out[t.category] !== undefined) out[t.category] += t.amount;
  }
  return out;
}

export function monthSwitcher(state) {
  const idx = MONTHS.findIndex((m) => m.key === state.month);
  const prev = idx > 0 ? MONTHS[idx - 1].key : null;
  const next = idx < MONTHS.length - 1 ? MONTHS[idx + 1].key : null;
  return `<div class="month-switch">
    <button data-action="set-month" data-month="${prev ?? ''}" ${prev ? '' : 'disabled'} aria-label="Bulan sebelumnya">‹</button>
    <strong>${monthLabel(state.month)}</strong>
    <button data-action="set-month" data-month="${next ?? ''}" ${next ? '' : 'disabled'} aria-label="Bulan berikutnya">›</button>
  </div>`;
}

function statCards(state) {
  const { income, expense, balance } = totalsFor(state);
  const rate = income > 0 ? Math.round((balance / income) * 100) : 0;
  return `<section class="cards">
    <div class="card stat in"><span>Pemasukan</span><b>${fmtShort(income)}</b><small>${monthLabel(state.month)}</small></div>
    <div class="card stat out"><span>Pengeluaran</span><b>${fmtShort(expense)}</b><small>${monthLabel(state.month)}</small></div>
    <div class="card stat bal"><span>Sisa bulan ini</span><b>${fmtShort(balance)}</b><small>bisa ditabung</small></div>
    <div class="card stat save"><span>Tingkat tabungan</span><b>${rate}%</b><small>target 20%</small></div>
  </section>`;
}

function recentTable(state, limit = 6) {
  const tx = [...monthTx(state)].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
  const rows = tx
    .map((t) => {
      const cat = [...CATEGORIES, ...INCOME_CATEGORIES].find((c) => c.key === t.category);
      const sign = t.type === 'in' ? '+' : '−';
      return `<tr><td>${t.date.slice(8)} Nov</td><td>${esc(t.note)}</td><td>${cat ? cat.label : t.category}</td><td class="${t.type}">${sign} ${fmtFull(t.amount)}</td></tr>`;
    })
    .join('');
  return `<table class="tx-table"><thead><tr><th>Tgl</th><th>Catatan</th><th>Kategori</th><th>Jumlah</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function viewDashboard(state) {
  const spent = catTotals(state);
  const rows = CATEGORIES.map((c) => ({ label: `${c.icon} ${c.label}`, value: spent[c.key], color: c.color })).filter((r) => r.value > 0);
  const goals = state.goals
    .map((g) => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `<div class="goal-mini"><div><b>${esc(g.name)}</b><span>${fmtShort(g.saved)} dari ${fmtShort(g.target)}</span></div><div class="progress"><i style="width:${pct}%;background:#2e7d5b"></i></div><em>${pct}%</em></div>`;
    })
    .join('');
  return `
  <section class="hero">
    <div>
      <h1>Anggaran keluarga, akhirnya rapi.</h1>
      <p>DompetKeluarga mencatat pemasukan, pengeluaran, dan tabungan ${esc('Keluarga Pratama')} dalam satu tempat — tanpa spreadsheet, tanpa aplikasi berbayar.</p>
      <div class="hero-actions"><a class="btn primary" href="#/transaksi">+ Catat transaksi</a><a class="btn" href="#/anggaran">Lihat anggaran</a></div>
    </div>
    ${monthSwitcher(state)}
  </section>
  ${statCards(state)}
  <section class="grid-2">
    <div class="card"><h2>Pengeluaran per kategori</h2>${donutChart(rows)}</div>
    <div class="card"><h2>Ke mana uang pergi?</h2>${hbarChart(rows)}</div>
  </section>
  <section class="grid-2">
    <div class="card"><h2>Transaksi terbaru</h2>${recentTable(state)}<a class="more" href="#/transaksi">Lihat semua transaksi →</a></div>
    <div class="card"><h2>Tujuan tabungan</h2>${goals}<a class="more" href="#/tujuan">Kelola tujuan →</a></div>
  </section>`;
}

export function viewTransactions(state) {
  const f = state.filter || { type: 'all', cat: 'all' };
  let tx = [...monthTx(state)].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (f.type !== 'all') tx = tx.filter((t) => t.type === f.type);
  if (f.cat !== 'all') tx = tx.filter((t) => t.category === f.cat);
  const catOptions = [...CATEGORIES, ...INCOME_CATEGORIES]
    .map((c) => `<option value="${c.key}" ${f.cat === c.key ? 'selected' : ''}>${c.label}</option>`)
    .join('');
  const rows = tx
    .map((t) => {
      const cat = [...CATEGORIES, ...INCOME_CATEGORIES].find((c) => c.key === t.category);
      const sign = t.type === 'in' ? '+' : '−';
      return `<tr><td>${t.date}</td><td>${esc(t.note)}</td><td>${cat ? cat.label : t.category}</td><td class="${t.type}">${sign} ${fmtFull(t.amount)}</td><td><button class="del" data-action="del-tx" data-id="${t.id}" aria-label="Hapus transaksi">✕</button></td></tr>`;
    })
    .join('');
  return `
  <section class="page-head"><div><h1>Transaksi</h1><p>Semua pemasukan dan pengeluaran ${monthLabel(state.month)} — ${tx.length} transaksi.</p></div>${monthSwitcher(state)}</section>
  <section class="grid-2">
    <div class="card">
      <h2>Tambah transaksi</h2>
      <form id="tx-form" class="form">
        <label>Tanggal<input type="date" name="date" value="${state.month}-27" required></label>
        <label>Jenis<select name="type" id="tx-type"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>
        <label>Kategori<select name="category" id="tx-cat">${CATEGORIES.map((c) => `<option value="${c.key}">${c.label}</option>`).join('')}</select></label>
        <label>Catatan<input type="text" name="note" placeholder="cth: Belanja sayur" maxlength="80" required></label>
        <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="500" placeholder="150000" required></label>
        <button class="btn primary" type="submit">Simpan transaksi</button>
      </form>
    </div>
    <div class="card">
      <h2>Filter</h2>
      <div class="filters">
        <label>Jenis <select data-action="filter-type"><option value="all" ${f.type === 'all' ? 'selected' : ''}>Semua</option><option value="in" ${f.type === 'in' ? 'selected' : ''}>Pemasukan</option><option value="out" ${f.type === 'out' ? 'selected' : ''}>Pengeluaran</option></select></label>
        <label>Kategori <select data-action="filter-cat"><option value="all">Semua kategori</option>${catOptions}</select></label>
      </div>
      <p class="hint">Transaksi yang kamu tambah tersimpan di peramban ini dan langsung mengubah total di Beranda, Anggaran, dan Laporan.</p>
    </div>
  </section>
  <section class="card"><h2>Daftar transaksi</h2>
    <table class="tx-table"><thead><tr><th>Tanggal</th><th>Catatan</th><th>Kategori</th><th>Jumlah</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="5">Tidak ada transaksi untuk filter ini.</td></tr>'}</tbody></table>
  </section>`;
}

export function viewBudget(state) {
  const spent = catTotals(state);
  const totalBudget = Object.values(state.budgets).reduce((s, v) => s + v, 0);
  const totalSpent = Object.values(spent).reduce((s, v) => s + v, 0);
  const cards = CATEGORIES.map((c) => {
    const limit = state.budgets[c.key];
    const used = spent[c.key];
    const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
    const left = limit - used;
    const cls = pct >= 95 ? 'danger' : pct >= 80 ? 'warn' : 'ok';
    return `<div class="card budget-card">
      <div class="budget-top"><span class="dot" style="background:${c.color}"></span><b>${c.icon} ${c.label}</b><em class="${cls}">${pct}%</em></div>
      <div class="progress big"><i class="${cls}" style="width:${pct}%;background:${c.color}"></i></div>
      <p>${fmtShort(used)} dari ${fmtShort(limit)} · sisa ${fmtShort(Math.max(0, left))}</p>
      <label>Ubah anggaran <input type="number" data-budget="${c.key}" value="${limit}" min="0" step="50000"> <button class="btn small" data-action="save-budget" data-cat="${c.key}">Simpan</button></label>
    </div>`;
  }).join('');
  return `
  <section class="page-head"><div><h1>Anggaran ${monthLabel(state.month)}</h1><p>Total terpakai ${fmtShort(totalSpent)} dari anggaran ${fmtShort(totalBudget)} — semua kategori masih di bawah batas bulan ini.</p></div>${monthSwitcher(state)}</section>
  <section class="grid-3">${cards}</section>`;
}

export function viewGoals(state) {
  const cards = state.goals
    .map((g) => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      const left = g.target - g.saved;
      return `<div class="card goal-card">
        <h2>🎯 ${esc(g.name)}</h2>
        <p class="muted">${esc(g.note)}</p>
        <div class="progress big"><i style="width:${pct}%;background:#b5892e"></i></div>
        <p><b>${fmtShort(g.saved)}</b> dari ${fmtShort(g.target)} · kurang ${fmtShort(Math.max(0, left))} · <b>${pct}%</b></p>
        <form class="inline-form" data-goal="${g.id}"><input type="number" name="amount" min="10000" step="10000" placeholder="Tambah Rp…" required><button class="btn small" type="submit">+ Tambah dana</button></form>
      </div>`;
    })
    .join('');
  return `
  <section class="page-head"><div><h1>Tujuan Tabungan</h1><p>Tiga tujuan keluarga — setiap rupiah yang ditabung terlihat jejaknya.</p></div></section>
  <section class="grid-3">${cards}</section>
  <section class="card">
    <h2>Buat tujuan baru</h2>
    <form id="goal-form" class="form inline">
      <label>Nama tujuan<input type="text" name="name" placeholder="cth: Renovasi dapur" maxlength="40" required></label>
      <label>Target (Rp)<input type="number" name="target" min="100000" step="50000" placeholder="5000000" required></label>
      <label>Sudah terkumpul (Rp)<input type="number" name="saved" min="0" step="50000" value="0"></label>
      <button class="btn primary" type="submit">Buat tujuan</button>
    </form>
  </section>`;
}

export function viewReport(state) {
  const months = MONTHS.map((m) => {
    const t = totalsFor(state, m.key);
    return { label: m.label, income: t.income, expense: t.expense };
  });
  const spent = catTotals(state);
  const totalOut = Object.values(spent).reduce((s, v) => s + v, 0) || 1;
  const catRows = CATEGORIES.map((c) => {
    const v = spent[c.key];
    return `<tr><td><span class="dot" style="background:${c.color}"></span> ${c.label}</td><td>${fmtFull(v)}</td><td>${Math.round((v / totalOut) * 100)}%</td><td>${fmtFull(state.budgets[c.key] - v >= 0 ? state.budgets[c.key] - v : 0)} di bawah anggaran</td></tr>`;
  }).join('');
  const tips = TIPS.map((t) => `<div class="card tip"><h3>💡 ${esc(t.title)}</h3><p>${esc(t.body)}</p></div>`).join('');
  const { income, expense, balance } = totalsFor(state);
  return `
  <section class="page-head"><div><h1>Laporan ${monthLabel(state.month)}</h1><p>Pemasukan ${fmtShort(income)} · pengeluaran ${fmtShort(expense)} · sisa ${fmtShort(balance)}.</p></div>${monthSwitcher(state)}</section>
  <section class="card"><h2>Enam bulan terakhir</h2>${monthBars(months)}</section>
  <section class="card"><h2>Rincian pengeluaran ${monthLabel(state.month)}</h2>
    <table class="tx-table"><thead><tr><th>Kategori</th><th>Terpakai</th><th>Bagian</th><th>Anggaran</th></tr></thead><tbody>${catRows}</tbody></table>
  </section>
  <section><h2 class="section-title">Yang bisa dilakukan bulan depan</h2><div class="grid-3">${tips}</div></section>`;
}

export const VIEWS = {
  '/': viewDashboard,
  '/transaksi': viewTransactions,
  '/anggaran': viewBudget,
  '/tujuan': viewGoals,
  '/laporan': viewReport,
};
