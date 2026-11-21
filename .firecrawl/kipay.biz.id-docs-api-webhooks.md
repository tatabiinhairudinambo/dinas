[![](https://kipay.biz.id/kipay-mark-compact.svg)**KiPay** docs](https://kipay.biz.id/) [Dokumentasi](https://kipay.biz.id/docs) [API Reference](https://kipay.biz.id/docs/api) [Changelog](https://kipay.biz.id/docs/changelog) [Dashboard](https://kipay.biz.id/login)

Cari dokumentasi `Ctrl K` [Buat akun](https://kipay.biz.id/login)

Cari dokumentasi

Mulai

[Dokumentasi KiPay](https://kipay.biz.id/docs) [Pembayaran pertama](https://kipay.biz.id/docs/quickstart) [Lifecycle transaksi](https://kipay.biz.id/docs/concepts/transaction-lifecycle) [Sandbox dan production](https://kipay.biz.id/docs/concepts/sandbox)

Panduan

[Buat transaksi](https://kipay.biz.id/docs/guides/create-payment) [Tampilkan QR](https://kipay.biz.id/docs/guides/display-qr) [Cek status](https://kipay.biz.id/docs/guides/check-status) [Terima webhook](https://kipay.biz.id/docs/guides/webhooks) [Pengujian](https://kipay.biz.id/docs/guides/testing)

API Reference

[Ringkasan API](https://kipay.biz.id/docs/api) [POST Buat transaksi](https://kipay.biz.id/docs/api/transactions/create) [GET Cek status](https://kipay.biz.id/docs/api/transactions/retrieve) [GET Ambil QR](https://kipay.biz.id/docs/api/transactions/qr) [POST Simulasi](https://kipay.biz.id/docs/api/transactions/simulate) [Webhook payload](https://kipay.biz.id/docs/api/webhooks) [Error](https://kipay.biz.id/docs/api/errors)

Referensi

[Keamanan](https://kipay.biz.id/docs/security) [Changelog](https://kipay.biz.id/docs/changelog)

API beroperasi normalVersi 1.0

[Dokumentasi](https://kipay.biz.id/docs)/API Reference

API REFERENCE

# Event webhook

Payload yang dikirim KiPay ke webhook URL project ketika status transaksi berubah atau tes koneksi dijalankan.

Referensi Diperbarui 29 Agustus 2026

PENGIRIMAN IDEMPOTENTPengiriman berulang tetap menghasilkan satu pemenuhan order.

Pengiriman webhook yang idempotentPengiriman pertama dan duplikat masuk ke dedupe gate yang menggunakan trx\_id. Handler memberi response dengan cepat. Satu verifikasi di background menghasilkan satu pemenuhan order. Duplikat tidak menghasilkan pemenuhan kedua.BANYAK PENGIRIMAN, SATU DAMPAKPENGIRIMAN 01transaction.paidtrx\_id: VG57V5PENGIRIMAN 02event yang samatrx\_id: VG57V5DEDUPEberdasarkan trx\_idcatat sekalipertama diterimasudah diprosesPENUHI SEKALIsetelah verifikasi APIBalas cepat. Verifikasi dan penuhi order di background.

01

## Header request

| Header | Keterangan |
| --- | --- |
| Content-Type | application/json |
| User-Agent | KiPay-Webhook/1.0 |
| X-Webhook-Event | Sama dengan field event pada payload |
| X-Webhook-Delivery | ID delivery unik dan stabil — sama persis pada percobaan ulang untuk event yang sama |
| X-Webhook-Timestamp | Waktu pengiriman (ISO 8601), ikut ditandatangani |
| X-Webhook-Signature | sha256=<hex> — HMAC-SHA256("{timestamp}.{deliveryId}.{rawBody}", webhook\_secret). Lihat panduan "Terima webhook" untuk cara verifikasi. |

02

## Payload

net\_amount hanya muncul di sini dan di dashboard merchant — tidak ada di response API checkout publik (lihat POST /transactions).

**transaction-paid.json**

JSONSalin

```
{
  "event": "transaction.paid",
  "sent_at": "2026-08-26T06:35:14Z",
  "transaction": {
    "trx_id": "SBX-20260825-VG57V5",
    "mode": "sandbox",
    "requested_amount": 285000,
    "unique_code": 215,
    "amount": 285215,
    "fee_amount": 2925,
    "net_amount": 282290,
    "fee_bearer": "merchant",
    "status": "paid",
    "provider": "shopeepay",
    "note": "order_nusa_2048",
    "matched_at": "2026-08-26 06:35:14",
    "created_at": "2026-08-26 06:35:08",
    "expires_at": "2026-08-26 06:50:08"
  }
}
```

03

## Jenis event

| Event | Makna |
| --- | --- |
| transaction.paid | Transaksi berubah menjadi paid |
| transaction.expired | Transaksi melewati expires\_at |
| webhook.test | Tes koneksi dari project |

04

## Kontrak keamanan

**Setiap payload ditandatangani — selalu verifikasi**

Hitung ulang HMAC-SHA256 atas "{timestamp}.{deliveryId}.{rawBody}" memakai webhook secret project, bandingkan dengan X-Webhook-Signature memakai constant-time comparison, dan tolak timestamp yang sudah terlalu lama (replay window disarankan 5 menit). SDK kipay-node menyediakan verifyWebhookSignature() untuk ini. Signature yang valid membuktikan payload asli dari KiPay — tetap baca ulang status transaksi lewat API sebelum memenuhi order.

05

## Retry saat gagal

Kalau endpoint Anda tidak merespons 2xx (atau timeout), KiPay mencoba ulang hingga 6 kali dengan jeda meningkat (~10 detik sampai ~160 detik), lalu berhenti. X-Webhook-Delivery tetap sama di setiap percobaan ulang untuk event yang sama.

PADA HALAMAN INI

[Header request](https://kipay.biz.id/docs/api/webhooks#headers) [Payload](https://kipay.biz.id/docs/api/webhooks#payload) [Jenis event](https://kipay.biz.id/docs/api/webhooks#events) [Kontrak keamanan](https://kipay.biz.id/docs/api/webhooks#security) [Retry saat gagal](https://kipay.biz.id/docs/api/webhooks#retry)

[Dokumentasi](https://kipay.biz.id/docs) [SELANJUTNYAModel error](https://kipay.biz.id/docs/api/errors)