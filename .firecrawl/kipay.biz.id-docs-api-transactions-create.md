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

# Buat transaksi

Membuat transaksi baru, menghitung kode unik dan fee, lalu menghasilkan QR payload.

Referensi Diperbarui 29 Agustus 2026

API CONSOLE

## Kirim request langsung dan baca response dengan jelas

Masukkan API key sandbox, periksa parameter, lalu jalankan endpoint dari halaman ini. Credential hanya diteruskan untuk request tersebut dan tidak disimpan.

**POST** https://api.kipay.biz.id`/api/pay/{apiKey}/transactions`

Kirim request

**Buat transaksi**

Contoh response

**Request** Sandbox

Authentication

apiKey required

API key diteruskan satu kali melalui server KiPay dan tidak disimpan oleh konsol.

Headers

Accept`application/json`Content-Type`application/json`

Request body

amount integernote optional

Kirim request

**Response** application/json

**CONTOH** Preview bodyBelum dikirim

```
1{2  "trx_id": "SBX-20260825-VG57V5",3  "mode": "sandbox",4  "requested_amount": 285000,5  "unique_code": 215,6  "amount": 285215,7  "status": "pending",8  "expires_at": "2026-08-26 06:50:08"9}
```

Contoh kode

```
curl --request POST \
  --url https://api.kipay.biz.id/api/pay/$KIPAY_API_KEY/transactions \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"amount":285000,"note":"order_nusa_2048"}'
```

Salin cURL

01

## Request

**POST**`/api/pay/{apiKey}/transactions`

| Parameter | Lokasi | Wajib | Keterangan |
| --- | --- | --- | --- |
| apiKey | path | Ya | API key project |
| amount | body | Ya | Integer minimal 1 sebelum unique\_code |
| note | body | Tidak | String atau null |

**request.sh**

cURLSalin

```
curl --request POST \
  --url https://api.kipay.biz.id/api/pay/apg_your_project_key/transactions \
  --header "Content-Type: application/json" \
  --data '{ "amount": 285000, "note": "order_nusa_2048" }'
```

02

## 201 Created

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
  "status": "pending",
  "provider": null,
  "note": "order_nusa_2048",
  "qr_payload": "0002010102122661...",
  "qr_url": "https://api.kipay.biz.id/api/pay/apg_your_project_key/transactions/SBX-20260825-VG57V5/qr.png",
  "matched_at": null,
  "created_at": "2026-08-26 06:35:08",
  "expires_at": "2026-08-26 06:50:08"
}
```

03

## Error

| Status | Kondisi |
| --- | --- |
| 400 | amount tidak valid atau QRIS statis merchant belum diatur |
| 404 | Project tidak ditemukan atau dinonaktifkan |
| 409 | unique\_code yang tidak bentrok gagal dibuat |

PADA HALAMAN INI

[Request](https://kipay.biz.id/docs/api/transactions/create#endpoint) [201 Created](https://kipay.biz.id/docs/api/transactions/create#success) [Error](https://kipay.biz.id/docs/api/transactions/create#errors)

[Dokumentasi](https://kipay.biz.id/docs) [SELANJUTNYAGET Cek status](https://kipay.biz.id/docs/api/transactions/retrieve)