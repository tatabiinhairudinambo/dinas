export const NEED = { SKD: 110, TWK: 30, TIU: 35, TKP: 45 };
export const OFF = { SKD: 0, TWK: 0, TIU: 30, TKP: 65 };
export const TH = { TWK: 65, TIU: 80, TKP: 166 };
export const LETTERS = ['A', 'B', 'C', 'D', 'E'];
export const DEFAULT_BANNER = '📢 Selamat datang! Try Out SKD terbaru sudah tersedia.';

export const qType = (pkg, i) =>
  pkg.type === 'SKD' ? (i < 30 ? 'TWK' : i < 65 ? 'TIU' : 'TKP') : pkg.type;

export const numOf = (pkg, i) => (OFF[pkg.type] || 0) + i + 1;

export const fmtRp = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

export const todayID = () =>
  new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export function genQuestions(type) {
  return Array.from({ length: NEED[type] }, (_, i) => ({
    t: `Contoh soal ${type} ke-${i + 1}. (Edit lewat Bank Soal operator)`,
    o: LETTERS.map((x) => 'Opsi ' + x),
    a: i % 5,
    w: [5, 4, 3, 2, 1],
    pem: 'Pembahasan contoh.',
    oi: [],
  }));
}

function seedPackages() {
  const names = {
    SKD: 'Try Out SKD Lengkap 110 Soal',
    TWK: 'Latihan TWK Dasar',
    TIU: 'Latihan TIU Intensif',
    TKP: 'Latihan TKP Intensif',
  };
  return ['SKD', 'TWK', 'TIU', 'TKP'].map((t, idx) => ({
    id: idx + 1,
    name: names[t],
    type: t,
    price: t === 'SKD' ? 25000 : 10000,
    promo: 0,
    desc: '',
    pub: 1,
    hidden: 0,
    rel: '',
    qs: genQuestions(t),
  }));
}

export function defaultState() {
  return {
    seed4: 1,
    users: [],
    me: null,
    packages: seedPackages(),
    owned: {},
    banner: DEFAULT_BANNER,
    bannerImg: '',
    logo: '',
    logoDark: '',
    loginLogo: '',
    loginLogoDark: '',
    promos: [],
    logs: [],
    pay: {},
    res: {},
    hist: {},
    newPk: [],
    exam: null,
    seq: 5,
  };
}

export function normalize(raw) {
  const s = raw && typeof raw === 'object' ? raw : defaultState();
  const d = defaultState();
  const out = { ...d, ...s };
  if (!Array.isArray(out.users)) out.users = [];
  if (!Array.isArray(out.packages)) out.packages = [];
  if (!Array.isArray(out.promos)) out.promos = [];
  if (!Array.isArray(out.logs)) out.logs = [];
  if (!Array.isArray(out.newPk)) out.newPk = [];
  if (!out.owned || typeof out.owned !== 'object') out.owned = {};
  if (!out.res || typeof out.res !== 'object') out.res = {};
  if (!out.hist || typeof out.hist !== 'object') out.hist = {};
  if (!out.pay || typeof out.pay !== 'object') out.pay = {};
  out.seed4 = 1;
  const names = {
    SKD: 'Try Out SKD Lengkap 110 Soal',
    TWK: 'Latihan TWK Dasar',
    TIU: 'Latihan TIU Intensif',
    TKP: 'Latihan TKP Intensif',
  };
  ['SKD', 'TWK', 'TIU', 'TKP'].forEach((t) => {
    if (!out.packages.some((p) => p.type === t)) {
      out.packages.push({
        id: out.seq++,
        name: names[t],
        type: t,
        price: t === 'SKD' ? 25000 : 10000,
        promo: 0,
        desc: '',
        pub: 1,
        hidden: 0,
        rel: '',
        qs: genQuestions(t),
      });
    }
  });
  out.packages.forEach((p) => {
    if (p.promoCut == null) p.promoCut = p.promoPrice > 0 ? Math.max(0, (p.promo || p.price) - p.promoPrice) : 0;
    p.promoPrice = p.promoCut > 0 ? Math.max(0, (p.promo || p.price) - p.promoCut) : 0;
    if (p.pub && !p.rel) p.rel = todayID();
    if (!Array.isArray(p.qs)) p.qs = genQuestions(p.type);
  });
  if (out.me) {
    const u = out.users.find((x) => x.e === out.me.e);
    if (!u) out.users.push(out.me);
    else Object.assign(u, out.me);
  }
  return out;
}

export function validatePackage(pkg) {
  const errs = [];
  pkg.qs.forEach((q, i) => {
    const n = numOf(pkg, i);
    const t = qType(pkg, i);
    if (!String(q.t || '').trim()) errs.push(`Nomor ${n}: teks soal kosong`);
    (q.o || []).forEach((o, j) => {
      if (!String(o || '').trim()) errs.push(`Nomor ${n}: opsi ${LETTERS[j]} kosong`);
    });
    if (t !== 'TKP' && q.a == null) errs.push(`Nomor ${n}: kunci jawaban belum dipilih`);
    if (t === 'TKP' && (q.w || []).some((x) => x == null)) errs.push(`Nomor ${n}: bobot poin TKP (5-1) belum lengkap`);
  });
  return errs;
}

export function scoreExam(pkg, exam) {
  const sc = { TWK: 0, TIU: 0, TKP: 0 };
  let b = 0,
    s = 0,
    k = 0;
  const det = [];
  pkg.qs.forEach((q, i) => {
    const t = qType(pkg, i);
    const a = exam.ans[i];
    if (a == null) {
      k++;
      det.push({ i, st: 'kosong' });
      return;
    }
    if (t === 'TKP') {
      sc.TKP += (q.w || [])[a] || 0;
      b++;
      det.push({ i, st: 'jawab', a });
    } else if (a === q.a) {
      if (t === 'TWK') sc.TWK += 5;
      if (t === 'TIU') sc.TIU += 5;
      b++;
      det.push({ i, st: 'benar', a });
    } else {
      s++;
      det.push({ i, st: 'salah', a });
    }
  });
  const inc = pkg.type === 'SKD' ? ['TWK', 'TIU', 'TKP'] : [pkg.type];
  const ok = inc.every((t) => sc[t] >= TH[t]);
  return { sc, inc, ok, b, s, k, det, tot: inc.reduce((a, t) => a + sc[t], 0), ts: Date.now() };
}

export function canStart(pkg, state) {
  return Boolean(pkg && pkg.pub && !pkg.hidden && state.owned[pkg.id]);
}
