# Tugas Web Semantik - Praktikum API

## Penjelasan & Jawaban Tugas

### 1. Validasi Aturan `title` (Soal Pertemuan 5)

Sesuai instruksi soal, `title` untuk task itu sifatnya **wajib** dan panjangnya maksimal **120 karakter**.

**Penerapan dalam kode:**
Saya sudah menambahkan logika pengecekan input ini. Kalau misalnya ada user yang mencoba ngirim `title` kosong atau lebih dari 120 huruf, server akan langsung nolak request-nya.

**Status Code yang dipakai:** `400 Bad Request`.
Alasannya karena ini murni kesalahan dari sisi client (input yang dikirim tidak sesuai aturan/format). Server akan merespon dengan pesan error seperti: _"title wajib diisi"_ atau _"title maksimal 120 karakter"_.

### 2. Perbedaan Error 404 dan 500

Dalam bikin API, kita sering banget ketemu dua error ini. Bedanya lumayan jauh:

- **Error 404 (Not Found)**
  Ini berarti server kita nyala dan berjalan lancar, tapi data yang dicari sama client memang nggak ada di database.
  _Contoh penyebab di kode:_ Ketika sistem nyari ID yang salah pakai `findById`, dan hasilnya dapet `undefined`.

  ```javascript
  const task = taskService.findById(req.params.id);
  if (!task) throw new AppError(404, "Task tidak ditemukan");
  ```

- **Error 500 (Internal Server Error)**
  Kalau yang ini artinya aplikasi servernya yang _crash_ atau ada kode yang error. Walaupun client udah ngirim data yang benar, servernya tetep gagal memprosesnya.
  _Contoh penyebab di kode:_ Lupa bikin validasi terus langsung menjalankan fungsi pada nilai yang kosong (undefined).
  ```javascript
  // Kalau req.body.title itu nilainya undefined, pas di-trim() pasti bakal memicu fatal error
  const title = req.body.title.trim();
  ```

### 3. Evaluasi Desain Endpoint "Notes"

Kalau kita lihat URL seperti `/api/createNote` dan `/api/deleteNote`, desain ini sebenernya **kurang RESTful**.

Kenapa? Karena dalam aturan REST API standar, URL itu harus berupa **kata benda (resource)**, bukan kata kerja. Kata kerjanya itu udah diwakilin sama jenis metode HTTP-nya (seperti GET, POST, DELETE, dll).

**Desain Endpoint yang Benar:**

- Untuk **Menambah** Note:
  - Method: `POST`
  - URL: `/api/notes`
  - Status Code: `201 Created`
- Untuk **Menghapus** Note:
  - Method: `DELETE`
  - URL: `/api/notes/:id` (menyebutkan ID yang mau dihapus)
  - Status Code: `200 OK` (berhasil dihapus)

### 4. Solusi Error "Blocked by CORS policy"

Kasusnya: Frontend Vue ada di port `5173` sedangkan backend Express di port `4000`. Pas disambungin malah muncul error CORS di browser.

**Penjelasan:**
Error ini muncul karena browser itu ketat urusan keamanan (_Same-Origin Policy_). Kalau frontend minta data ke backend yang port-nya beda, otomatis diblokir karena dianggap nyasar ke alamat lain.

**Cara Memperbaikinya:**
Kita harus ngasih "izin" ke aplikasi Vue supaya boleh mengakses server Express. Perubahan ini dilakuin di file utama backend, yaitu **`server.js`** (bukan di controller/service).

Caranya dengan menambahkan kode middleware ini:

```javascript
const express = require("express");
const cors = require("cors"); // Panggil library CORS
const app = express();

// Pasang middleware CORS dan masukin alamat Vue kita
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// ... sisa kode lainnya
```

---

## Catatan : Cara Ngetes API di Postman

Syarat: Jalankan servernya dulu (`node server.js`). Kalau udah jalan di port 4000, jalankan aplikasi Postman.

**1. Narik Semua Data Task (GET)**

- Pilih kotak dropdown method, ganti ke **GET**.
- Ketik URL-nya: `http://localhost:4000/api/tasks`
- Tinggal pencet **Send**. Nanti di panel bawah bakal muncul data JSON yang isinya daftar task kita.

**2. Bikin Task Baru (POST)**

- Ganti methodnya jadi **POST**.
- URL tetep sama: `http://localhost:4000/api/tasks`
- Nah ini yang penting: masuk ke tab **Body**, klik opsi **raw**, terus ganti tulisan _Text_ di pojok kanan jadi **JSON**.
- Masukin data ini ke kotak teks:
  ```json
  {
    "title": "Beli kopi buat nugas"
  }
  ```
- Klik **Send**. Harusnya dapet respon `201 Created`.
- _(Buat ngetes kode validasi soal no. 5 jalan atau tidak, coba aja hapus "title"-nya atau isi asal dulu. Server pasti menolak dan memberikan error `400 Bad Request`!)_

**3. Update Status Task (PUT)**

- Pertama, _copy_ dulu `id` salah satu task dari hasil GET atau POST tadi (yang panjang kayak gabungan huruf dan angka itu).
- Ganti method ke **PUT**.
- Paste ID-nya di ujung URL, jadinya: `http://localhost:4000/api/tasks/1234-abcd-5678`
- Masuk tab **Body** (sama kayak langkah POST tadi, format JSON). Misal kita mau nandain task-nya udah siap:
  ```json
  {
    "done": true
  }
  ```
- Hit **Send**!

**4. Hapus Task (DELETE)**

- Ganti method ke **DELETE**.
- URL-nya sama persis kayak pas mau ngedit tadi (wajib pakai ID di belakangnya).
- Langsung pencet **Send** aja tanpa perlu ngisi _Body_ sama sekali. Task otomatis bakal dihapus dari server.
