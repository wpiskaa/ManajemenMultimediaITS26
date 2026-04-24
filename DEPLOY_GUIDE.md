# Panduan Deployment Multimedia ITSpecta Portal

Website ini dibangun menggunakan teknologi murni HTML, CSS, dan JavaScript tanpa backend, sehingga sangat mudah untuk di-deploy secara gratis.

## Opsi 1: GitHub Pages (Sangat Direkomendasikan)
Cocok untuk kolaborasi tim dan gratis selamanya.
1. Buat repository baru di GitHub.
2. Upload semua file (`index.html`, `admin.html`, `script.js`, `admin.js`, `style.css`, `admin.css`).
3. Pergi ke **Settings** > **Pages**.
4. Pada bagian **Build and deployment**, pilih branch `main` dan folder `/ (root)`.
5. Klik **Save**. Tunggu 1-2 menit, website Anda akan live di `https://username.github.io/repository-name/`.

## Opsi 2: Vercel / Netlify
Sangat cepat dan otomatis.
1. Drag & drop folder proyek Anda ke [Vercel](https://vercel.com/new) atau [Netlify](https://app.netlify.com/drop).
2. Selesai! Anda akan mendapatkan URL acak (bisa diganti).

---

## 🚀 Keunggulan Sistem Baru (Firebase)
Website Anda kini sudah menggunakan **Firebase Firestore**, yang berarti:
- **Sinkronisasi Real-Time**: Saat Anda menambah/mengedit data di Admin Panel, HP seluruh anggota akan terupdate **otomatis tanpa refresh**.
- **Data Permanen**: Data tersimpan di Cloud Google, aman meskipun ganti perangkat atau hapus history browser.

## ⚠️ Keamanan Firestore
Saat ini database Anda berada dalam **Test Mode** (siapa saja bisa baca/tulis selama punya API Key). 
Untuk keamanan lebih lanjut di masa depan:
1. Buka Firebase Console > Firestore Database > Rules.
2. Ubah rules agar hanya Admin yang bisa menulis data (memerlukan Firebase Authentication).

---

## Opsi Deployment
Website ini murni HTML/CSS/JS, jadi bisa di-deploy gratis di:
- **GitHub Pages**
- **Vercel**
- **Netlify**

Cukup upload semua file ke salah satu layanan tersebut, dan portal Multimedia ITSpecta Anda akan langsung online!
