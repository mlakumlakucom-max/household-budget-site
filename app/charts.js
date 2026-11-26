// DompetKeluarga — grafik SVG buatan sendiri (tanpa pustaka luar).
// Semua grafik digambar sebagai SVG murni dari angka yang dihitung di views.js.

export function fmtShort(n) {
  if (n >= 1000000) return 'Rp' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (n >= 1000) return 'Rp' + Math.round(n / 1000) + ' rb';
  return 'Rp' + n.toLocaleString('id-ID');
}

export function fmtFull(n) {
  return 'Rp' + n.toLocaleString('id-ID');
}

// Bilah horizontal: [{label, value, color, sub}] — nilai terbesar = 100%.
export function hbarChart(rows) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const bars = rows
    .map(
      (r) => `
    <div class="hbar-row">
      <div class="hbar-label"><span class="dot" style="background:${r.color}"></span>${r.label}</div>
      <div class="hbar-track"><div class="hbar-fill" style="width:${Math.round((r.value / max) * 100)}%;background:${r.color}"></div></div>
      <div class="hbar-value">${fmtShort(r.value)}</div>
    </div>`,
    )
    .join('');
  return `<div class="hbar">${bars}</div>`;
}

// Donat: [{label, value, color}] — potongan SVG path.
export function donutChart(rows, size = 180) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  let angle = -Math.PI / 2;
  const paths = rows
    .map((row) => {
      const frac = row.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      if (frac <= 0) return '';
      if (frac >= 0.999) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${row.color}" stroke-width="26"/>`;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${row.color}" stroke-width="26"/>`;
    })
    .join('');
  const legend = rows
    .map(
      (row) => `<div class="legend-row"><span class="dot" style="background:${row.color}"></span>${row.label}<b>${Math.round((row.value / total) * 100)}%</b></div>`,
    )
    .join('');
  return `<div class="donut-wrap">
    <svg class="donut" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pembagian pengeluaran per kategori">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#efe8d8" stroke-width="26"/>
      ${paths}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${fmtShort(total)}</text>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-sub">pengeluaran</text>
    </svg>
    <div class="legend">${legend}</div>
  </div>`;
}

// Batang vertikal berkelompok: bulan x (pemasukan, pengeluaran).
export function monthBars(months) {
  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));
  const W = 640;
  const H = 220;
  const base = H - 28;
  const gap = W / months.length;
  const barW = Math.min(34, gap / 3.4);
  const bars = months
    .map((m, i) => {
      const x = gap * i + gap / 2;
      const hIn = Math.max(2, (m.income / max) * (H - 60));
      const hOut = Math.max(2, (m.expense / max) * (H - 60));
      return `
      <rect x="${(x - barW - 3).toFixed(1)}" y="${(base - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#2e7d5b"/>
      <rect x="${(x + 3).toFixed(1)}" y="${(base - hOut).toFixed(1)}" width="${barW}" height="${hOut.toFixed(1)}" rx="3" fill="#c96f3f"/>
      <text x="${x.toFixed(1)}" y="${H - 8}" text-anchor="middle" class="axis">${m.label}</text>`;
    })
    .join('');
  return `<svg class="monthbars" viewBox="0 0 ${W} ${H}" role="img" aria-label="Pemasukan dan pengeluaran 6 bulan terakhir">
    <line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="#d8cfba" stroke-width="1"/>
    ${bars}
  </svg>
  <div class="chart-key"><span><i style="background:#2e7d5b"></i>Pemasukan</span><span><i style="background:#c96f3f"></i>Pengeluaran</span></div>`;
}
