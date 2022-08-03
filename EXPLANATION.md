# Efishery Test App

Aplikasi ini dibuat menggunakan framework react dengan komponent-komponent utamanya menggunakan MateriaUI. Kenapa saya menggunakan Materia UI, karena dari segi tampilan lebih baik daripada Bootstrap jadi user yang menggunakan bisa lebih nyaman meliha UI nya.

### Halaman Menu

Pada halaman menu, membuat desail berupa list view supaya user yang melihat tidak merasa bosan jika tampilan hanya berupa tabel. Pada Halaman ini, actions yang dapat dilakukan user antara lain:
- Melakukan search nama ikan/komoditas pada search input text
- Saat daftar sudah mencapai bottom, maka halaman akan otomatis memuat lebih banyak data. Tiap data akan di-load 10 data baru
- Melakukan sorting berdasarkan tipe data yang dipilih

### Halaman Detail dan Create

Pada halaman ini, user dapat melihat detail dari ikan yang dipilih. Data-data yang ditampilkan sesuai dengan kolom yang tersedia pada api yang diberikan. Terdapat gambar ikan di bagian kiri, gambar ikan akan berubah berdasarkan nama ikan yang diketik. Semisal user mengetik 'Patin' maka gambar yang akan muncul adalah gambar ikan patin. Hanya ada beberapa jenis ikan yang tersedia. Saat user berhasil mengubah atau menambahkan data baru, maka user akan diarahkan ke halaman main menu.