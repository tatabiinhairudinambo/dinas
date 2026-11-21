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

# Simulasikan pembayaran sandbox

Mengubah transaksi sandbox dari pending menjadi paid tanpa pembayaran nyata.

Referensi Diperbarui 29 Agustus 2026

API CONSOLE

## Kirim request langsung dan baca response dengan jelas

Masukkan API key sandbox, periksa parameter, lalu jalankan endpoint dari halaman ini. Credential hanya diteruskan untuk request tersebut dan tidak disimpan.

**POST** https://api.kipay.biz.id`/api/pay/{apiKey}/transactions/SBX-20260825-VG57V5/simulate`

Kirim request

**Simulasikan pembayaran sandbox**

Contoh response

**Request** Sandbox

Authentication

apiKey required

API key diteruskan satu kali melalui server KiPay dan tidak disimpan oleh konsol.

Headers

Accept`application/json`Content-Type`application/json`

Path parameters

trxId required

Request body

providershopeepaygopay

Kirim request

**Response** application/json

**CONTOH** Preview bodyBelum dikirim

```
1{2  "trx_id": "SBX-20260825-VG57V5",3  "mode": "sandbox",4  "amount": 285215,5  "status": "paid",6  "provider": "shopeepay",7  "matched_at": "2026-08-26 06:35:14"8}
```

Contoh kode

```
curl --request POST \
  --url https://api.kipay.biz.id/api/pay/$KIPAY_API_KEY/transactions/SBX-20260825-VG57V5/simulate \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"provider":"shopeepay"}'
```

Salin cURL

PERBANDINGAN ENVIRONMENTKontrak sama, sumber konfirmasi berbeda.

Perbandingan sandbox dan productionSandbox dan production memakai struktur request, resource transaksi, renderer QR, dan webhook handler yang sama. Hanya sandbox yang memiliki endpoint simulate. Production menerima konfirmasi dari jaringan QRIS.SAMAKAN KONTRAK SEBELUM GO LIVESANDBOXPRODUCTIONkonfirmasi terkendalikonfirmasi jaringan nyatastruktur requestkontrak samafield transaksikontrak samarender QRkontrak samawebhook handlerkontrak samaPOST /simulate mengubah statusjaringan QRIS mengubah status

01

## Request

**POST**`/api/pay/{apiKey}/transactions/{trxId}/simulate`

| Field | Tipe | Wajib | Nilai |
| --- | --- | --- | --- |
| provider | string | Tidak | shopeepay atau gopay |

**request.sh**

cURLSalin

```
curl --request POST \
  --url https://api.kipay.biz.id/api/pay/apg_your_project_key/transactions/SBX-20260825-VG57V5/simulate \
  --header "Content-Type: application/json" \
  --data '{ "provider": "shopeepay" }'
```

02

## 200 OK

**response.json**

JSONSalin

```
{
  "trx_id": "SBX-20260825-VG57V5",
  "mode": "sandbox",
  "requested_amount": 285000,
  "unique_code": 215,
  "amount": 285215,
  "fee_amount": 2925,
  "fee_bearer": "merchant",
  "status": "paid",
  "provider": "shopeepay",
  "note": "order_nusa_2048",
  "qr_payload": "0002010102122661...",
  "qr_url": "https://api.kipay.biz.id/api/pay/apg_your_project_key/transactions/SBX-20260825-VG57V5/qr.png",
  "matched_at": "2026-08-26 06:35:14",
  "created_at": "2026-08-26 06:35:08",
  "expires_at": "2026-08-26 06:50:08"
}
```

03

## Error

| Status | Kondisi |
| --- | --- |
| 400 | Project production, transaksi tidak berstatus pending, atau transaksi tidak ditemukan |
| 404 | Project tidak ditemukan |

**Khusus sandbox**

Production selalu menolak endpoint ini. Jangan masukkan simulasi ke workflow production.

PADA HALAMAN INI

[Request](https://kipay.biz.id/docs/api/transactions/simulate#endpoint) [200 OK](https://kipay.biz.id/docs/api/transactions/simulate#success) [Error](https://kipay.biz.id/docs/api/transactions/simulate#errors)

[Dokumentasi](https://kipay.biz.id/docs) [SELANJUTNYAWebhook payload](https://kipay.biz.id/docs/api/webhooks)