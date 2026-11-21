/* eslint-disable */
/* ===========================================================================
   JEMBATAN REACT <-> MESIN LEGACY
   ---------------------------------------------------------------------------
   Dimuat SESUDAH /legacy/app.js oleh src/lib/legacyBridge.js.

   File ini sengaja classic script: hanya di sini binding global milik engine
   (S, V, save, go, render, login, reg, AM) masih bisa dijangkau. Tugasnya:

   1. Membuka akses state terkontrol untuk React: window.__legacy
   2. Membelokkan login/daftar ke Supabase kalau sync aktif, dengan fallback
      ke validasi lokal (offline / Supabase tidak dikonfigurasi)

   Tanpa env Supabase, semua wrapper langsung memanggil fungsi aslinya.
   =========================================================================== */
(function () {
  'use strict';

  if (typeof S === 'undefined' || typeof render !== 'function') {
    console.warn('[bridge] engine legacy belum siap, jembatan dilewati');
    return;
  }

  var pick = function (sel) {
    var el = document.querySelector(sel);
    return el ? el.value : '';
  };
  var syncOf = function () {
    return window.HermesSync && window.HermesSync.enabled ? window.HermesSync : null;
  };

  window.__legacy = {
    getS: function () {
      return S;
    },
    getV: function () {
      return V;
    },
    save: function () {
      return save();
    },
    go: function (v) {
      return go(v);
    },
    render: function () {
      return render();
    },
    /** Ganti seluruh state (dipakai setelah menarik snapshot dari Supabase). */
    replaceState: function (next) {
      Object.keys(S).forEach(function (k) {
        delete S[k];
      });
      Object.assign(S, next || {});
      save();
      render();
    },
  };

  /* ---------------------------------------------- logo pembayaran bawaan -- */
  // Halaman bayar membaca S.pay[k]; kalau kosong yang tampil hanya teks nama
  // bank. Logo bawaan dipasang sekali dan ditandai S.payDefault, supaya
  // operator yang sengaja menghapus logo tidak "dipulihkan" tiap kali buka app.
  var PAY_LOGO = {
    QRIS: '/pay/qris.svg',
    BCA: '/pay/bca.svg',
    BRI: '/pay/bri.svg',
    MANDIRI: '/pay/mandiri.svg',
  };
  (function seedPayLogos() {
    if (S.payDefault === 1) return;
    if (!S.pay || typeof S.pay !== 'object') S.pay = {};
    Object.keys(PAY_LOGO).forEach(function (k) {
      if (!S.pay[k]) S.pay[k] = PAY_LOGO[k];
    });
    S.payDefault = 1;
    save();
  })();

  /* ------------------------------------------------------------- login -- */
  var legacyLogin = login;
  var loginBusy = false;

  login = function () {
    // Layar selain "Masuk" (mis. verifikasi kode) tidak punya kolom email;
    // jangan lanjut ke validasi legacy yang membaca $('#e') dan melempar.
    if (!document.querySelector('#e')) return;
    var bridge = syncOf();
    if (!bridge || loginBusy) return legacyLogin();

    var email = pick('#e');
    var pass = pick('#p');
    loginBusy = true;
    bridge
      .login(email, pass)
      .then(
        function (res) {
          if (res && res.ok) return;
          if (res && res.reason === 'unverified') {
            MSG = email;
            // Jangan kirim ulang otomatis: setiap percobaan login akan memakan
            // kuota email proyek Supabase (rate limit berlaku per proyek, bukan
            // per alamat). Kode lama biasanya masih berlaku ±1 jam.
            otpReset('Email belum diverifikasi. Masukkan kode terakhir dari inbox, atau tekan "Kirim ulang".');
            OTP.resendAt = 0;
            AM = 'sent';
            render();
            return;
          }
          // Supabase aktif: tidak ada fallback login lokal
          // (kunci lokal dihapus — login offline = sesi Supabase yang di-cache).
          MSG = (res && res.message) || 'Email atau kunci salah';
          render();
        },
        function (err) {
          console.warn('[bridge] login Supabase gagal:', err);
          MSG = 'Email atau kunci salah';
          render();
        },
      )
      .then(function () {
        loginBusy = false;
      });
    return undefined;
  };

  /* Fase 2: Operator mode hanya untuk user editor Supabase
     (cek ke server via catalog_editors). Mode lokal/dev tetap bebas. */
  var _opF = opLoginForm;
  opLoginForm = function () {
    var bridge = syncOf();
    if (bridge && bridge.catalog && !bridge.catalog.isEditor()) {
      modal(
        '<b style="font-size:18px">Akses Operator</b>' +
          '<p class=mu>Panel operator hanya untuk akun editor Supabase (tercatat di <code>public.catalog_editors</code>).</p>' +
          '<button class=pm onclick=closeM()>Mengerti</button>',
      );
      return;
    }
    return _opF();
  };

  /* ------------------------------------------------------------ daftar -- */
  var legacyReg = reg;

  reg = function () {
    // Rapikan spasi dan tolak alamat yang bentuknya jelas bukan email. Di mode
    // lokal tidak ada server yang memvalidasi, jadi "bukan-email" dulu lolos
    // sampai layar kode verifikasi.
    var emailField = document.querySelector('#e');
    if (emailField) {
      var trimmed = emailField.value.trim();
      if (trimmed !== emailField.value) emailField.value = trimmed;
    }
    var email = pick('#e');
    if (email && !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email)) {
      MSG = 'Format email belum benar. Contoh: nama@email.com';
      AM = 'daftar';
      render();
      return;
    }
    var pass = pick('#p');
    // Sisa pendaftaran yang belum terverifikasi boleh dicoba ulang (akun v:0
    // memang tidak bisa dipakai masuk), supaya email tidak "terkunci".
    var stale = (S.users || []).filter(function (u) {
      return u && u.e === email && !u.v;
    });
    if (stale.length) {
      S.users = S.users.filter(function (u) {
        return stale.indexOf(u) === -1;
      });
      save();
    }
    legacyReg();
    var bridge = syncOf();
    if (!bridge || AM !== 'sent') return;

    otpReset('Mengirim kode ke email…');
    OTP.busy = true;
    render();
    bridge.signUp(email, pass).then(
      function (res) {
        if (!res || !res.ok) {
          // Batalkan akun lokal yang barusan dibuat supaya bisa daftar ulang.
          var S = window.__legacy && window.__legacy.getS();
          if (S && S.users) {
            S.users = S.users.filter(function (u) {
              return !(u && u.e === email && !u.v);
            });
            save();
          }
          AM = 'daftar';
          MSG = (res && res.message) || 'Pendaftaran gagal. Coba lagi.';
          render();
          return;
        }
        if (res.needsOtp) {
          otpReset('Kode 6 digit sudah dikirim. Cek inbox atau folder spam.');
          render();
          return;
        }
        // Proyek Supabase tanpa konfirmasi email: sesi langsung terbit.
        // Tanpa cabang ini layar OTP menggantung menunggu kode yang tak dikirim.
        OTP.busy = false;
        var user = (S.users || []).filter(function (u) {
          return u && u.e === email;
        })[0];
        if (user) {
          user.v = 1;
          S.me = user;
          save();
          AM = 'login';
          MSG = '';
          go('home');
        } else {
          render();
        }
      },
      function (err) {
        console.warn('[bridge] daftar Supabase gagal:', err);
        OTP.busy = false;
        OTP.note = '';
        OTP.error = 'Gagal menghubungi server. Coba lagi.';
        render();
      },
    );
  };

  /* -------------------------------------------------- verifikasi email -- */
  var OTP = { busy: false, resendAt: 0, error: '', note: '', value: '' };

  function otpReset(note) {
    OTP.busy = false;
    OTP.error = '';
    OTP.note = note || '';
    OTP.value = '';
    OTP.resendAt = Date.now() + 60000;
  }

  window.otpSubmit = function () {
    var bridge = syncOf();
    if (!bridge || OTP.busy) return;
    var code = pick('#otp-code').replace(/\D/g, '');
    OTP.value = code;
    if (code.length !== 6) {
      OTP.error = 'Kode harus 6 digit.';
      render();
      return;
    }
    OTP.busy = true;
    OTP.error = '';
    OTP.note = 'Memeriksa kode…';
    render();
    bridge.verifyOtp(MSG, code).then(
      function (res) {
        OTP.busy = false;
        if (res && res.ok) {
          // Layar auth berikutnya (setelah keluar) kembali ke form masuk.
          AM = 'login';
          MSG = '';
          OTP.value = '';
          OTP.note = '';
          // Biasanya sync sudah menggambar beranda lewat go('home'). Kalau tidak
          // (mis. snapshot remote menimpa record lokal), layar kode akan
          // menggantung — render ulang hanya kalau form OTP masih terpasang.
          if (document.querySelector('#otp-code')) render();
          return;
        }
        OTP.note = '';
        OTP.error = (res && res.message) || 'Kode tidak valid atau kedaluwarsa.';
        render();
      },
      function (err) {
        OTP.busy = false;
        OTP.note = '';
        OTP.error = 'Verifikasi gagal: ' + (err && err.message ? err.message : 'coba lagi');
        render();
      },
    );
  };

  window.otpResend = function () {
    var bridge = syncOf();
    if (!bridge || OTP.busy) return;
    var wait = Math.ceil((OTP.resendAt - Date.now()) / 1000);
    if (wait > 0) {
      OTP.error = '';
      OTP.note = 'Tunggu ' + wait + ' detik sebelum kirim ulang.';
      render();
      return;
    }
    OTP.busy = true;
    OTP.error = '';
    OTP.note = 'Mengirim ulang…';
    render();
    bridge.resendOtp(MSG).then(
      function (res) {
        OTP.busy = false;
        OTP.resendAt = Date.now() + 60000;
        if (res && res.ok) {
          OTP.note = 'Kode baru sudah dikirim.';
        } else {
          OTP.note = '';
          OTP.error = (res && res.message) || 'Gagal mengirim ulang.';
        }
        render();
      },
      function (err) {
        OTP.busy = false;
        OTP.note = '';
        OTP.error = 'Gagal mengirim ulang: ' + (err && err.message ? err.message : 'coba lagi');
        render();
      },
    );
  };

  /* Layar "Cek Email" legacy diganti form kode 6 digit sungguhan. */
  function otpScreen() {
    var tone = OTP.error ? 'er' : 'ok';
    return (
      '<div class=box><h2 style="color:var(--ac)">Verifikasi Email</h2>' +
      '<p class=mu style="font-size:13px;line-height:1.6;margin:0">Kode 6 digit dikirim ke <b>' +
      esc(MSG) +
      '</b>. Cek inbox atau folder spam.</p>' +
      '<input id=otp-code inputmode=numeric autocomplete=one-time-code maxlength=6 ' +
      'value="' +
      esc(OTP.value) +
      '" placeholder="Kode 6 digit" style="text-align:center;letter-spacing:6px;font-size:20px">' +
      '<div class="' +
      tone +
      '" style="min-height:16px;font-size:12.5px">' +
      esc(OTP.error || OTP.note || '') +
      '</div>' +
      '<button class=pm onclick=otpSubmit()' +
      (OTP.busy ? ' disabled' : '') +
      '>' +
      (OTP.busy ? 'Memproses…' : 'Verifikasi') +
      '</button>' +
      '<div class=mu style="text-align:center;font-size:12.5px;cursor:pointer" onclick=otpResend()>Kirim ulang kode</div>' +
      '<div class=mu style="text-align:center;font-size:12.5px;cursor:pointer" ' +
      "onclick=\"AM='login';MSG='';render()\">Kembali ke Masuk</div>" +
      '</div>'
    );
  }

  var legacyAuth = auth;
  auth = function () {
    if (!syncOf()) return legacyAuth();
    if (AM === 'sent') return otpScreen();
    if (AM === 'lupa') return resetScreen();
    return legacyAuth();
  };

  /* Tombol lama "Buka Link Konfirmasi (simulasi)" diarahkan ke verifikasi asli;
     tanpa Supabase (mode offline/legacy) perilaku simulasi dibiarkan apa adanya. */
  var legacyVerify = verify;
  verify = function () {
    if (!syncOf()) return legacyVerify();
    window.otpSubmit();
  };

  /* ------------------------------------------------ lupa kunci akun (reset) -- */
  var RESET = { step: 'email', email: '', code: '', busy: false, error: '', note: '', resendAt: 0 };

  function resetState(note) {
    RESET.step = 'email';
    RESET.email = '';
    RESET.code = '';
    RESET.busy = false;
    RESET.error = '';
    RESET.note = note || '';
    RESET.resendAt = 0;
  }

  function resetScreen() {
    var tone = RESET.error ? 'er' : 'ok';
    var msg =
      '<div class="' +
      tone +
      '" style="min-height:16px;font-size:12.5px">' +
      esc(RESET.error || RESET.note || '') +
      '</div>';
    var back =
      '<div class=mu style="text-align:center;font-size:12.5px;cursor:pointer" onclick=rsBack()>Kembali ke Masuk</div>';

    if (RESET.step === 'email') {
      return (
        '<div class=box><h2 style="color:var(--ac)">Lupa Kunci Akun</h2>' +
        '<p class=mu style="font-size:13px;line-height:1.6;margin:0">Masukkan email akun. Kami kirim ' +
        'kode 6 digit untuk membuat kunci baru.</p>' +
        '<input id=rs-email type=email autocomplete=email placeholder=Email value="' +
        esc(RESET.email) +
        '">' +
        msg +
        '<button class=pm onclick=rsSend()' +
        (RESET.busy ? ' disabled' : '') +
        '>' +
        (RESET.busy ? 'Mengirim…' : 'Kirim Kode') +
        '</button>' +
        back +
        '</div>'
      );
    }

    return (
      '<div class=box><h2 style="color:var(--ac)">Kunci Baru</h2>' +
      '<p class=mu style="font-size:13px;line-height:1.6;margin:0">Kode 6 digit dikirim ke <b>' +
      esc(RESET.email) +
      '</b>.</p>' +
      '<input id=rs-code inputmode=numeric autocomplete=one-time-code maxlength=6 value="' +
      esc(RESET.code) +
      '" placeholder="Kode 6 digit" style="text-align:center;letter-spacing:6px;font-size:20px">' +
      '<input id=rs-p1 type=password autocomplete=new-password placeholder="Kunci baru (min. 6 digit)">' +
      '<input id=rs-p2 type=password autocomplete=new-password placeholder="Konfirmasi kunci baru">' +
      msg +
      '<button class=pm onclick=rsSubmit()' +
      (RESET.busy ? ' disabled' : '') +
      '>' +
      (RESET.busy ? 'Menyimpan…' : 'Simpan Kunci Baru') +
      '</button>' +
      '<div class=mu style="text-align:center;font-size:12.5px;cursor:pointer" onclick=rsSend(1)>Kirim ulang kode</div>' +
      back +
      '</div>'
    );
  }

  var legacyLupa = lupa;
  lupa = function () {
    if (!syncOf()) return legacyLupa();
    resetState('');
    AM = 'lupa';
    MSG = '';
    render();
  };

  window.rsSend = function (resend) {
    var bridge = syncOf();
    if (!bridge || RESET.busy) return;
    var email = ((pick('#rs-email') || RESET.email) || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      RESET.error = 'Email tidak valid.';
      RESET.note = '';
      render();
      return;
    }
    if (resend) {
      var wait = Math.ceil((RESET.resendAt - Date.now()) / 1000);
      if (wait > 0) {
        RESET.error = '';
        RESET.note = 'Tunggu ' + wait + ' detik sebelum kirim ulang.';
        render();
        return;
      }
    }
    RESET.email = email;
    RESET.busy = true;
    RESET.error = '';
    RESET.note = 'Mengirim kode…';
    render();
    bridge.sendReset(email).then(
      function (res) {
        RESET.busy = false;
        RESET.resendAt = Date.now() + 60000;
        if (res && res.ok) {
          RESET.step = 'code';
          RESET.note = 'Kalau email terdaftar, kode sudah dikirim. Cek inbox/spam.';
          RESET.error = '';
        } else {
          RESET.note = '';
          RESET.error = (res && res.message) || 'Gagal mengirim kode.';
        }
        render();
      },
      function () {
        RESET.busy = false;
        RESET.note = '';
        RESET.error = 'Gagal menghubungi server. Coba lagi.';
        render();
      },
    );
  };

  window.rsSubmit = function () {
    var bridge = syncOf();
    if (!bridge || RESET.busy) return;
    var code = (pick('#rs-code') || '').replace(/\D/g, '');
    var p1 = pick('#rs-p1');
    var p2 = pick('#rs-p2');
    RESET.code = code;
    RESET.error = '';
    if (code.length !== 6) {
      RESET.note = '';
      RESET.error = 'Kode harus 6 digit.';
      render();
      return;
    }
    if ((p1 || '').length < 6) {
      RESET.note = '';
      RESET.error = 'Kunci baru minimal 6 digit.';
      render();
      return;
    }
    if (p1 !== p2) {
      RESET.note = '';
      RESET.error = 'Konfirmasi kunci tidak cocok.';
      render();
      return;
    }
    RESET.busy = true;
    RESET.note = 'Menyimpan kunci baru…';
    render();
    bridge.resetPassword(RESET.email, code, p1).then(
      function (res) {
        RESET.busy = false;
        if (res && res.ok) {
          resetState('');
          AM = 'login';
          MSG = '✔ Kunci berhasil diganti. Silakan masuk dengan kunci baru.';
          render();
          return;
        }
        RESET.note = '';
        RESET.error = (res && res.message) || 'Gagal mengganti kunci.';
        render();
      },
      function () {
        RESET.busy = false;
        RESET.note = '';
        RESET.error = 'Gagal menghubungi server. Coba lagi.';
        render();
      },
    );
  };

  window.rsBack = function () {
    resetState('');
    AM = 'login';
    MSG = '';
    render();
  };


  /* ------------------------------------------------------------ keluar -- */
  // Tombol "Keluar" di layar Profil menulis inline: S.me=null;save();go('auth').
  // Tidak ada fungsi untuk dibungkus, jadi keluar dari Supabase dideteksi oleh
  // storageAdapter (perubahan me -> null) lalu diteruskan ke sync.signOut().

  /* ===========================================================================
     FASE 3B — SERVER-AUTHORITATIVE
     ---------------------------------------------------------------------------
     Mode Supabase saja (window.HermesSync.enabled). Mode lokal: semua wrapper
     langsung memanggil fungsi aslinya — perilaku lama tidak berubah.

     Prinsip: kunci jawaban (q.a/q.w), kepemilikan (S.owned), dan nilai
     (S.res) bersumber dari server (entitlements/attempts.score). Klien hanya
     membaca hasil dan mengirim jawaban; tanpa env, perilaku lokal tetap utuh.
     =========================================================================== */

  /* ------------------------------------------------------- beli / bayar -- */
  // paid() legacy menulis S.owned[pid] langsung. Mode Supabase: buat invoice
  // (create_payment) saat siswa memilih metode (payGo), tandai lunas via
  // mark_payment_paid, lalu S.owned diperbarui dari entitlements server.
  var PAYV82 = { paymentId: null, method: null, busy: false };

  var _payGo = payGo;
  payGo = function (b) {
    var bridge = syncOf();
    if (!bridge || !S.me || S.owned[CUR] || PAYV82.busy) return _payGo(b);
    var p = P(CUR);
    if (!p) return _payGo(b);
    // Gerbang order: email harus sudah diverifikasi (sekali per akun).
    if (typeof bridge.isVerified === 'function' && !bridge.isVerified()) {
      openVerifyGate(p.id, b);
      return;
    }
    PAYV82.busy = true;
    var promoCode = PROMO && PROMO.code ? String(PROMO.code) : null;
    bridge
      .createPayment(p.id, b, promoCode)
      .then(function (res) {
        PAYV82.busy = false;
        if (res && res.ok) {
          PAYV82.paymentId = res.paymentId;
          PAYV82.method = b;
          return _payGo(b);
        }
        MSG = (res && res.message) || 'Gagal membuat pembayaran. Coba lagi.';
        render();
      })
      .catch(function () {
        PAYV82.busy = false;
        MSG = 'Gagal menghubungi server. Coba lagi.';
        render();
      });
  };

  /* ------------------------------------------- verifikasi sebelum order -- */
  // Pendaftaran tidak lagi memakai OTP (Confirm email OFF di Supabase).
  // Verifikasi email diminta saat user mau order, di dalam aplikasi.
  var VERGATE = { pid: null, method: null, busy: false, sentAt: 0, error: '', note: '' };

  function openVerifyGate(pid, method) {
    VERGATE.pid = pid;
    VERGATE.method = method;
    VERGATE.error = '';
    VERGATE.note = 'Kode 6 digit dikirim ke email akunmu.';
    renderGate();
    // Kirim otomatis sekali per sesi (bukan tiap percobaan — hemat kuota).
    if (!VERGATE.sentAt && !VERGATE.busy) sendGateCode();
  }

  function sendGateCode() {
    var bridge = syncOf();
    if (!bridge || VERGATE.busy) return;
    VERGATE.busy = true;
    VERGATE.error = '';
    VERGATE.note = 'Mengirim kode…';
    renderGate();
    bridge.sendVerify(S.me && S.me.e).then(
      function (res) {
        VERGATE.busy = false;
        if (res && res.ok) {
          VERGATE.sentAt = Date.now();
          VERGATE.note = 'Kode dikirim. Cek inbox atau folder spam.';
        } else {
          VERGATE.note = '';
          VERGATE.error = (res && res.message) || 'Gagal mengirim kode.';
        }
        renderGate();
      },
      function () {
        VERGATE.busy = false;
        VERGATE.note = '';
        VERGATE.error = 'Gagal menghubungi server. Coba lagi.';
        renderGate();
      },
    );
  }

  window.__gateSend = function () {
    var wait = Math.ceil((60000 - (Date.now() - VERGATE.sentAt)) / 1000);
    if (VERGATE.sentAt && wait > 0) {
      VERGATE.error = 'Tunggu ' + wait + ' detik sebelum kirim ulang.';
      renderGate();
      return;
    }
    sendGateCode();
  };

  window.__gateVerify = function () {
    var bridge = syncOf();
    if (!bridge || VERGATE.busy) return;
    var input = document.querySelector('#gate-code');
    var code = (input ? input.value : '').replace(/\D/g, '');
    if (code.length !== 6) {
      VERGATE.error = 'Kode harus 6 digit.';
      renderGate();
      return;
    }
    VERGATE.busy = true;
    VERGATE.error = '';
    VERGATE.note = 'Memeriksa kode…';
    renderGate();
    bridge.verifyOtp(S.me && S.me.e, code).then(
      function (res) {
        VERGATE.busy = false;
        if (res && res.ok) {
          // sync sudah menandai S.emailVerified; lanjutkan order semula.
          var pid = VERGATE.pid;
          var method = VERGATE.method;
          VERGATE.pid = null;
          VERGATE.method = null;
          VERGATE.note = '';
          VERGATE.error = '';
          closeM();
          render();
          if (pid != null) payGo(method);
          return;
        }
        VERGATE.note = '';
        VERGATE.error = (res && res.message) || 'Kode tidak valid.';
        renderGate();
      },
      function () {
        VERGATE.busy = false;
        VERGATE.note = '';
        VERGATE.error = 'Gagal menghubungi server. Coba lagi.';
        renderGate();
      },
    );
  };

  window.__gateClose = function () {
    VERGATE.pid = null;
    VERGATE.method = null;
    closeM();
  };

  function renderGate() {
    var email = (S.me && S.me.e) || '';
    var tone = VERGATE.error ? 'er' : 'mu';
    var btn = VERGATE.busy ? 'disabled' : '';
    modal(
      '<h2 style="color:var(--ac);margin:0 0 6px">Verifikasi Email</h2>' +
        '<p style="font-size:13px;line-height:1.6;margin:0">Sebelum membeli paket, verifikasi <b>' +
        esc(email) +
        '</b> dulu. Kode 6 digit dikirim ke email tersebut.</p>' +
        '<div class=' + tone + ' style="font-size:13px;min-height:20px;margin:10px 0">' +
        (VERGATE.error || VERGATE.note) +
        '</div>' +
        '<input id=gate-code inputmode=numeric autocomplete=one-time-code maxlength=6 placeholder="Kode 6 digit" style="width:100%;height:44px;text-align:center;letter-spacing:6px;font-size:18px;border:1.5px solid var(--bd);border-radius:8px;background:var(--cd);color:var(--tx)">' +
        '<button class=pm style="margin-top:12px" onclick="__gateVerify()" ' +
        btn +
        '>Verifikasi &amp; Lanjut Order</button>' +
        '<div style="display:flex;gap:8px;margin-top:8px">' +
        '<button style="flex:1;height:38px;background:var(--cd);color:var(--tx)" onclick="__gateSend()" ' +
        btn +
        '>Kirim Ulang</button>' +
        '<button style="flex:1;height:38px;background:var(--cd);color:var(--tx)" onclick="__gateClose()">Nanti Saja</button>' +
        '</div>',
    );
  }

  var _paid = paid;
  paid = function () {
    var bridge = syncOf();
    if (!bridge || !PAYV82.paymentId) return _paid();
    var p = P(CUR);
    if (!p) return _paid();
    bridge
      .markPaymentPaid(PAYV82.paymentId)
      .then(
        function (res) {
          if (res && res.ok) {
            PAYV82.paymentId = null;
            PAYV82.method = null;
            // S.owned sudah diperbarui dari entitlements oleh markPaymentPaid.
            if (!S.owned[p.id]) S.owned[p.id] = Date.now(); // jaringan lambat: fallback tampilan
            return _paid();
          }
          MSG = (res && res.message) || 'Konfirmasi pembayaran gagal.';
          render();
        },
        function () {
          MSG = 'Gagal menghubungi server. Coba lagi.';
          render();
        },
      );
  };

  /* ------------------------------------------------------ mulai ujian -- */
  // start() legacy membuat E dan S.exam. Mode Supabase: attempt dibuat server
  // (start_attempt) lalu E.attemptId dicatat; kalau server gagal → fallback
  // mulai lokal dengan pesan, agar siswa tidak terkunci.
  var _start = start;
  start = function (id, t) {
    var bridge = syncOf();
    if (!bridge || !S.me) return _start(id, t);
    var p = P(id);
    if (!p) return _start(id, t);
    bridge
      .startAttempt(id)
      .then(function (res) {
        if (res && res.ok) {
          window.__serverAttempt = res.attemptId;
          return _start(id, t);
        }
        MSG = (res && res.message) || 'Gagal memulai ujian (server). Mode lokal dipakai.';
        _start(id, t);
        render();
      })
      .catch(function () {
        window.__serverAttempt = null;
        _start(id, t);
      });
  };

  /* ----------------------------------------------------- selesaikan -- */
  // finish() legacy menghitung skor di browser (q.a/q.w ikut di snapshot).
  // Mode Supabase: jawaban dikirim ke submit_attempt; S.res[p.id] ditimpa
  // dengan score server (sumber kebenaran), lalu layar hasil digambar ulang.
  var _finish = finish;
  finish = function () {
    var bridge = syncOf();
    var attemptId = window.__serverAttempt;
    if (!bridge || !E || !attemptId) return _finish();
    var p = P(E.id);
    if (!p) return _finish();
    var answers = {};
    Object.keys(E.ans || {}).forEach(function (k) {
      if (E.ans[k] !== null && E.ans[k] !== undefined) answers[k] = E.ans[k];
    });
    _finish(); // tutup layar ujian + hitung lokal sebagai fallback tampilan
    window.__serverAttempt = null;
    bridge
      .submitAttempt(attemptId, answers)
      .then(function (res) {
        if (res && res.ok && res.score) {
          S.res[p.id] = res.score; // skor server = sumber kebenaran
          save();
        }
        render();
      })
      .catch(function () {
        /* nilai lokal hasil _finish() tetap tampil; sinkron berikutnya memperbaiki */
      });
  };

  /* Batalkan ujian: attempt server ikut diabaikan (biarkan 'active' —
     start_attempt berikutnya melanjutkan attempt yang sama). */
  var _doCancel = doCancel;
  doCancel = function () {
    window.__serverAttempt = null;
    return _doCancel();
  };

  /* ------------------------------------------------------------- klaim -- */
  // claimDo63() legacy menulis S.owned + S.claimed lokal. Mode Supabase:
  // klaim dicatat server lewat RPC (operator grant; siswa klaim mandiri
  // menyusul saat akun amal tersedia) — untuk sekarang: coba grant via
  // pushPackages path editor saja; tanpa RPC klaim siswa, pakai lokal + push.
  var _claimDo63 = typeof claimDo63 === 'function' ? claimDo63 : null;
  if (_claimDo63) {
    claimDo63 = function (id) {
      var r = _claimDo63(id);
      var bridge = syncOf();
      if (bridge) {
        // Tandai ke server di push snapshot berikutnya (owned ikut snapshot);
        // hydrate berikutnya akan menyesuaikan dengan entitlements server.
        void bridge.hydrate && bridge.hydrate();
      }
      return r;
    };
  }

  /* ---------------------------------------------------- hydrate boot -- */
  // Setelah engine siap dan (bila login) sesi ada, tarik paket + kepemilikan
  // dari server. pushCatalog editor tetap memakai CATALOG_KEYS (tanpa
  // packages) — paket di-push terpisah lewat HermesSync.pushPackages.
  if (window.HermesSync && typeof window.HermesSync.hydrate === 'function') {
    window.HermesSync.hydrate().catch(function () {});
  }
})();
