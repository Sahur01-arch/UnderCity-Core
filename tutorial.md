# Panduan Penggunaan Command OpenJS (Tutorial)

Dokumen ini berisi panduan penggunaan command yang tersedia di server Undercity-Core menggunakan plugin OpenJS.

---

## 1. Command Kelas (`/kelas`)
Digunakan untuk manajemen grup kelas di server.

*   **Tambah Kelas:**
    *   Command: `/kelas tambah <nama_kelas> [weight]`
    *   Fungsi: Membuat grup kelas baru di LuckPerms.
    *   Contoh: `/kelas tambah KelasA 10`

*   **Hapus Kelas:**
    *   Command: `/kelas hapus <nama_kelas>`
    *   Fungsi: Menghapus grup kelas yang ada.
    *   Contoh: `/kelas hapus KelasA`

---

## 2. Command LPGroup (`/lpgroup`)
Digunakan untuk manajemen prefix grup (hanya untuk Staff/Dev).

*   **Set Prefix:**
    *   Command: `/lpgroup setprefix <grup> <text>`
    *   Fungsi: Menetapkan prefix untuk grup tertentu.
    *   Contoh: `/lpgroup setprefix KelasA &a[KelasA]`

*   **Hapus Prefix:**
    *   Command: `/lpgroup removeprefix <grup>`
    *   Fungsi: Menghapus prefix dari grup tertentu.
    *   Contoh: `/lpgroup removeprefix KelasA`

---

## 3. Command Tugas (`/tugas`)
Digunakan untuk pengumpulan dan pemeriksaan tugas.

*   **Kumpulkan Tugas (Siswa):**
    *   Command: `/tugas`
    *   Fungsi: Mengumpulkan buku di tangan ke chest tugas kelas siswa tersebut.
    *   Syarat: Harus memegang buku yang sudah di-sign (Written Book).

*   **Periksa Tugas (Guru/Staff):**
    *   Command: `/tugas cek <kelas>`
    *   Fungsi: Membuka GUI virtual chest berisi tugas kelas yang dikumpulkan.
    *   Syarat: Memiliki permission `server.tugas.guru`.

---

## 4. Command Absensi (`/attendance`)
Digunakan untuk mencatat kehadiran.

*   **Tandai Kehadiran:**
    *   Command: `/attendance mark`
    *   Fungsi: Mencatat absensi pemain saat ini sebagai "Present".

---

## 5. Command Event (`/event`)
Digunakan untuk manajemen acara sekolah.

*   **Buat Event:**
    *   Command: `/event create <nama> <tanggal>`
    *   Fungsi: Menjadwalkan event baru.
    *   Contoh: `/event create "Ujian Akhir" "20-07-2026"`

---

## 6. Command Report (`/report`)
Digunakan untuk manajemen nilai (hanya untuk Staff/Guru).

*   **Set Nilai:**
    *   Command: `/report set <nama_player> <mapel> <nilai> [nama_kelas]`
    *   Fungsi: Mengatur nilai mata pelajaran siswa, memperbarui rata-rata, dan secara opsional menambahkan pemain ke grup kelas (kelasa-kelasd).
    *   Contoh: `/report set Budi Matematika 90 kelasa`

---

## 7. Setup Permission (LuckPerms)
Untuk mengatur hak akses command, gunakan perintah LuckPerms berikut di console server:

*   **Akses Dasar (Siswa):**
    `lp group default permission set server.tugas.use true`
    (Memberikan akses untuk menggunakan command `/tugas` bagi siswa).

*   **Akses Guru/Staff:**
    `lp group <nama_grup_staff> permission set server.tugas.guru true`
    (Memberikan akses untuk menggunakan command `/tugas cek <kelas>` bagi guru).

*   **Akses Manajemen Kelas/Report (Admin/Guru):**
    `lp group <nama_grup_admin> permission set under.manage true`
    `lp group <nama_grup_admin> permission set server.grade.manage true`
