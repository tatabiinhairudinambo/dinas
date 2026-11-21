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

[Dokumentasi](https://kipay.biz.id/docs)/Panduan

PANDUAN

# Jaga status checkout dan order tetap sinkron

Webhook menggerakkan backend. Polling membantu checkout menampilkan perubahan tanpa menjadikan browser sebagai sumber kebenaran.

7 menit Diperbarui 29 Agustus 2026

POLLING DAN WEBHOOKPolling memperbarui layar. Webhook menjaga keputusan backend tetap benar.

Polling dan webhook sebagai dua clockTimeline browser melakukan polling untuk memperbarui tampilan. Timeline backend menerima webhook ketika jaringan mengonfirmasi pembayaran, memverifikasi status, dan memenuhi order satu kali.SATU TRANSAKSI, DUA TANGGUNG JAWABClock browsermemperbarui tampilan pelangganpendingpendingpendingpendingpaidGET status berkala selama checkout terbukaClock backendmengendalikan pekerjaan finaltransaksi disimpanwebhook diterimaAPI terverifikasiPENUHI SEKALIstatus paid yang samaAturan keputusanHanya verifikasi backend yang mengizinkan pemenuhan order.webhook adalah sinyal, bukan bukti

01

## Endpoint

**GET**`/api/pay/{apiKey}/transactions/{trxId}`

Endpoint ini mengembalikan detail transaksi terbaru. Hosted payment page KiPay saat ini melakukan polling setiap 3 detik hingga status tidak lagi pending.

02

## Polling untuk pengalaman checkout

**poll-status.ts**

TypeScriptSalin

```
const interval = window.setInterval(async () => {
  const response = await fetch(statusUrl);
  const transaction = await response.json();

  renderStatus(transaction.status);
  if (transaction.status !== 'pending') {
    window.clearInterval(interval);
  }
}, 3000);
```

**Polling bukan sinyal untuk memenuhi order**

Browser dapat ditutup, dimanipulasi, atau kehilangan koneksi. Backend tetap harus menunggu webhook dan memverifikasi status secara server-to-server sebelum memenuhi order.

03

## Verifikasi dari backend

**verify-payment.ts**

TypeScriptSalin

```
const transaction = await kipay.getTransaction(transactionId);

if (transaction.status === 'paid') {
  await fulfillOrderOnce(orderId, transaction.trx_id);
}
```

04

## Tangani 404 tanpa membocorkan data

Response 404 digunakan ketika project tidak ditemukan atau transaksi bukan milik project tersebut. Tampilkan pesan umum kepada pelanggan, dan simpan detail diagnosis hanya di log backend yang aman.

PADA HALAMAN INI

[Endpoint](https://kipay.biz.id/docs/guides/check-status#endpoint) [Polling untuk pengalaman checkout](https://kipay.biz.id/docs/guides/check-status#polling) [Verifikasi dari backend](https://kipay.biz.id/docs/guides/check-status#backend) [Tangani 404 tanpa membocorkan data](https://kipay.biz.id/docs/guides/check-status#not-found)

[Dokumentasi](https://kipay.biz.id/docs) [SELANJUTNYATerima webhook dengan aman](https://kipay.biz.id/docs/guides/webhooks)