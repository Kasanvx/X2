# Kaxel Donate

Website donasi Kaxel Support dengan tema Neo-Brutalism yang sudah ada, riwayat dan total donasi, APIQris QRIS dinamis sebagai metode pembayaran utama, login member OTP WhatsApp, dashboard member, invoice, notifikasi, halaman admin, health, dan status layanan.

## URL shortcut

- Website: `/`
- Admin: `/admin`
- Health: `/health`
- Status sistem: `/status`
- Hasil kembali dari payment gateway: `/success`

URL shortcut dirutekan lewat `vercel.json`, sehingga pengguna tidak perlu menulis `.html` di akhir URL.

## Environment Variables Vercel

Untuk lokal, salin `.env.example` menjadi `.env` dan isi nilainya. Untuk Vercel, masukkan variabel yang diperlukan satu per satu pada **Project → Settings → Environment Variables**. Setelah selesai, lakukan redeploy.

Variabel pembayaran yang wajib:

- `SITE_URL=https://donate.khasan.site`
- `APIQRIS_API_KEY`: API Key toko APIQris (server-side only; rotasi bila pernah terekspos)
- `APIQRIS_MERCHANT_CODE=478143523796`: kode merchant untuk identifikasi konfigurasi
- `JSONBIN_ID` dan `JSONBIN_KEY`: **gunakan bin lama** supaya histori/goal/member tetap terhubung
- `ADMIN_PASSWORD`: password admin yang kuat
- `WAPITO_API_KEY` dan `OTP_HASH_SECRET`: dibutuhkan untuk OTP serta notifikasi WhatsApp melalui Wapito. Endpoint default: `https://api.wapito.com/v1/messages/text`.

Hapus variabel BTZPay lama dari Vercel setelah memastikan tidak ada transaksi BTZPay pending yang masih perlu dilacak. Untuk transaksi lama yang masih pending, status gateway lama belum dimigrasikan ke APIQris.

APIQris menggunakan `POST /v1/invoices`, lalu backend melakukan polling `GET /v1/invoices/:id` setiap sekitar 5 detik dari browser melalui endpoint website. `APIQRIS_PRIVATE_KEY` tidak diperlukan pada mode polling dan tidak boleh ditambahkan ke browser. QRIS memakai `qr_image_url`/`qris_content`; status final hanya diterima dari APIQris.

Gunakan `DONATION_FEE_ENABLED=false` agar fee layanan tetap nonaktif. Tarif di `MEMBER_FEE_PERCENT` dan `ANONYMOUS_FEE_PERCENT` baru dipakai jika fee diaktifkan. `EARLY_SUPPORTER_CUTOFF` opsional; kosong berarti badge periode awal tidak diberikan.

File `.env` diabaikan oleh Git; jangan commit file `.env` berisi token asli ke GitHub. Jika API key/token pernah dipublikasikan, rotasi sebelum deploy. Jangan gunakan token Wapito yang pernah ditempel di chat atau commit; simpan token baru hanya sebagai Environment Variable `WAPITO_API_KEY` di Vercel.

## WhatsApp OTP

OTP dan notifikasi akun sekarang dikirim melalui Wapito menggunakan header Bearer dan payload `to` dengan awalan `+` serta `body`. Respons provider berstatus `pending` tetap dianggap diterima ketika HTTP request berhasil, sesuai pola respons yang diberikan provider. Token hanya dibaca dari Environment Variable server dan tidak dikirim ke browser.

## Pembayaran dan return

Status transaksi diperiksa melalui polling browser ke `/api/status/:id` (interval sekitar 5 detik pada halaman donasi). Endpoint tersebut memvalidasi access key lokal, lalu meminta status langsung ke APIQris dan memeriksa kecocokan ID, order reference, dan total pembayaran sebelum memperbarui histori. Halaman `/success` juga memeriksa status melalui endpoint yang sama; redirect dari gateway sendiri tidak dianggap sebagai bukti pembayaran sukses.

Pada implementasi saat ini belum ada route callback `/api/paygate/callback` dan backend tidak mengirim `callback_url`. Karena itu, jangan mengonfigurasi atau mengandalkan callback sampai integrasi callback benar-benar diimplementasikan dan diuji berdasarkan kontrak provider.

## Privasi anonim

Donasi tanpa akun diproses dan ditampilkan sebagai `Anonim`; alias yang dikirim dari browser tidak digunakan. Data transaksi member tetap ditampilkan sesuai pengaturan privasi akun.

## Health dan status

`/health` dan `/status` memakai endpoint `/api/health`. Health memeriksa konektivitas APIQris, akses baca JSONBin, konfigurasi API key, dan kesiapan konfigurasi Wapito untuk OTP/notifikasi. Pemeriksaan tidak membuat transaksi uji atau mengirim OTP. Label “terjangkau/terkonfigurasi” bukan jaminan bahwa pembayaran produksi berhasil.

## Menjalankan lokal

```bash
cp .env.example .env
# isi nilai rahasia pada .env
npm install
npm start
```

Pemeriksaan sintaks:

```bash
node --check api/index.js
```

Catatan: aplikasi masih memakai JSONBin sebagai storage dokumen. JSONBin bukan database transaksional dengan atomic compare-and-set; untuk volume tinggi, rencanakan migrasi ke database transaksional sebelum mengandalkan proses bersamaan dalam skala besar.

## UI theme

The public donation page, member experience, admin dashboard, payment result, and service status pages share a Soft Nature visual theme. A floating theme control switches between light and dark mode. The preference is stored locally in the visitor's browser (`kaxel_theme_preference_v1`); it does not require an environment variable or backend change. Shared presentation assets are `public/theme.css` and `public/theme.js`.

## UI design system (Neo Corporate)

The public donation experience, member views, Sultan leaderboard, donation history, OTP onboarding, admin workspace, health dashboard, service status, and payment result pages use a shared Neo Corporate design system. Each page keeps a role-specific layout: public donation navigation, member activity views, an admin sidebar workspace, technical monitoring panels, and a focused payment-result view. Light and dark themes are available through the floating theme control and are saved locally in the browser.

The redesign is presentation-only. It does not change API routes, payment processing, OTP behavior, JSONBin persistence, or environment-variable names.

## Midnight Fintech UI

The current frontend uses a dark navy fintech visual system inspired by the supplied desktop dashboard and mobile checkout references. `public/premium.css` provides the visual layer and `public/checkout.js` progressively presents the existing donation form as a three-stage mobile checkout. Existing form controls, IDs, submission handlers, API contracts, and payment processing remain the source of truth. Desktop keeps the complete form visible; the guided step flow is enabled at viewport widths up to 760px. Light and dark themes remain available through the shared theme switcher, with dark mode as the default for new browser preferences.
