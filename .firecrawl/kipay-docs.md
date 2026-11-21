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

DOKUMENTASI KIPAY

# Dari API key ke pembayaran pertama, _tanpa menebak langkah berikutnya._

Buat transaksi sandbox, tampilkan QRIS, lalu jaga status order tetap sinkron melalui webhook. Setiap langkah menjelaskan apa yang dikirim, response yang diterima, dan tindakan berikutnya.

[Mulai quickstart](https://kipay.biz.id/docs/quickstart) [Lihat API Reference](https://kipay.biz.id/docs/api)

Sekitar 10 menit Sandbox terisolasi Webhook real-time

Anda akan membangun01 / FIRST PAYMENT

Buat transaksi_2_ Tampilkan QRIS_3_ Terima konfirmasi_4_ Penuhi order

Status akhir **transaction.paid** Order aman untuk dipenuhi

ALUR YANG MUDAH DIIKUTI

## Satu request. Satu lifecycle yang jelas.

KiPay menjaga hubungan antara transaksi, QR, konfirmasi jaringan, dan status order. Gunakan diagram ini sebagai gambaran utama saat membaca dokumentasi.

REQUEST HINGGA PAIDSiapa mengetahui apa, dan kapan order aman dipenuhi.

Urutan pembayaran KiPay dari request sampai order terpenuhiEmpat lane menunjukkan backend, KiPay API, checkout, dan jaringan QRIS. Request sinkron membuat transaksi dan QR. Konfirmasi jaringan mengubah status. Webhook kembali ke backend, lalu backend memverifikasi status sebelum memenuhi order.BACKENDsumber kebenaranKIPAY APIstatus transaksiCHECKOUTaksi pelangganQRISkonfirmasi jaringan01Buat transaksiPOST /transactions02Transaksi pendingtrx\_id + qr\_payload + expires\_at03Render QR dari transaksi yang samaGET /qr.pngimage/png04Pelanggan membayarintent pembayaran QRIS05Konfirmasi jaringan mengubah statuspending menjadi paid06Webhook memberi sinyaltransaction.paidPenuhi setelah verifikasiGET transaksi berstatus paid

**Prinsip operasional** Checkout memulai pembayaran. Backend memutuskan kapan order dipenuhi.

PILIH TITIK MULAI

## Masuk lewat konteks kerja Anda.

Anda tidak perlu membaca seluruh dokumentasi sebelum mengirim request pertama.

[QUICKSTART **Terima pembayaran pertama.** \\
Ikuti satu alur lengkap dari project sandbox hingga menerima webhook paid.\\
**Mulai integrasi**](https://kipay.biz.id/docs/quickstart) [API REFERENCE **Cari kontrak endpoint.** \\
Lihat parameter, payload, response, dan error untuk setiap operasi.\\
**Buka referensi**](https://kipay.biz.id/docs/api) [GO LIVE **Bergerak dari pengujian ke production.** \\
Validasi webhook, penanganan error, dan lifecycle sebelum menerima dana nyata.\\
**Lihat checklist**](https://kipay.biz.id/docs/guides/testing)

REQUEST PERTAMA

## Buat transaksi sandbox dengan satu request yang dapat diulang dengan aman.

Gunakan API key dari project sandbox. KiPay mengembalikan trx\_id, QR payload, expires\_at, dan status awal dalam satu response.

1. 01
**Ambil API key sandbox**

Buka project sandbox dan salin credential khusus server.

2. 02
**Kirim nominal dan referensi**

Referensi membantu menghubungkan transaksi KiPay dengan order Anda.

3. 03
**Simpan trx\_id**

Gunakan ID ini untuk membaca status dan mengambil gambar QR.


[Buka quickstart lengkap](https://kipay.biz.id/docs/quickstart)

create-transaction.sh

Salin

```
curl --request POST \
  --url https://api.kipay.biz.id/api/pay/apg_your_project_key/transactions \
  --header "Content-Type: application/json" \
  --data '{
    "amount": 285000,
    "note": "order_nusa_2048"
  }'
```

201 Created`status: "pending"`transaction\_id: trx\_7N4Q2M

DOCS STATUS

API v1.0 tersedia untuk sandbox. Checklist production dan webhook signing sedang disiapkan untuk dokumentasi publik.

[Lihat perubahan terbaru](https://kipay.biz.id/docs/changelog)