/**
 * Client KiPay (https://kipay.biz.id/docs).
 *
 * API key di pass lewat path (`/api/pay/{apiKey}/...`) dan memang tampil di
 * URL QR — dipakai dari browser sesuai pola docs (checkout + polling status).
 * Fulfillment order tetap di sisi klien: polling GET status bersumber dari
 * API KiPay, bukan dari tombol lokal. Webhook server-side menyusul kalau
 * nanti ada backend penyimpanan.
 */

const API = 'https://api.kipay.biz.id/api/pay';

export function kipayKey() {
  return (process.env.NEXT_PUBLIC_KIPAY_API_KEY || '').trim();
}

export function kipayActive() {
  return kipayKey().length > 0;
}

/** POST /transactions → { trx_id, qr_url, expires_at, status, ... } */
export async function kipayCreate(amount, note) {
  const res = await fetch(`${API}/${kipayKey()}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ amount: Math.max(1, Math.round(amount)), note: note || null }),
  });
  if (!res.ok) throw new Error(`kipay create ${res.status}`);
  return res.json();
}

/** GET /transactions/{trxId} → detail transaksi terbaru */
export async function kipayStatus(trxId) {
  const res = await fetch(`${API}/${kipayKey()}/transactions/${encodeURIComponent(trxId)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`kipay status ${res.status}`);
  return res.json();
}

/** POST /transactions/{trxId}/simulate — hanya sandbox. */
export async function kipaySimulate(trxId, provider = 'shopeepay') {
  const res = await fetch(`${API}/${kipayKey()}/transactions/${encodeURIComponent(trxId)}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ provider }),
  });
  if (!res.ok) throw new Error(`kipay simulate ${res.status}`);
  return res.json();
}

/** trx_id sandbox berawalan SBX- (lihat docs sandbox vs production). */
export function kipayIsSandbox(trx) {
  return String(trx?.trx_id || '').startsWith('SBX-') || trx?.mode === 'sandbox';
}
