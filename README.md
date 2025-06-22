# SkyBooking - Sistem Reservasi Tiket Pesawat

Aplikasi web untuk sistem reservasi tiket pesawat yang dibangun dengan React + Vite + Tailwind CSS.

## Fitur

- 🔍 **Pencarian Penerbangan** - Cari penerbangan berdasarkan kota, tanggal, dan kelas
- 🎫 **Pemesanan Tiket** - Proses booking lengkap dengan pemilihan kursi
- 👤 **Manajemen Akun** - Registrasi, login, dan profil pengguna
- 📱 **Responsive Design** - Tampilan optimal di desktop dan mobile
- 🔄 **Mode Demo** - Berfungsi tanpa backend dengan data mock
- 🌐 **API Integration** - Siap terhubung dengan backend API
- 🎨 **Modern UI** - Menggunakan Tailwind CSS dan Lucide Icons

## Teknologi

- **React 18** - Library UI
- **Vite** - Build tool dan dev server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript (ES6+)** - Tanpa TypeScript

## Instalasi

1. **Clone atau download project**
\`\`\`bash
git clone <repository-url>
cd skybooking-frontend
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Jalankan development server**
\`\`\`bash
npm run dev
\`\`\`

4. **Buka browser**
\`\`\`
http://localhost:5173
\`\`\`

## Struktur Project

\`\`\`
src/
├── components/          # Komponen UI
│   ├── ui/             # Komponen dasar (Button, Card, dll)
│   └── ConnectionStatus.jsx
├── contexts/           # React Context
│   └── AuthContext.jsx
├── lib/               # Utilities
│   ├── api.js         # API functions
│   └── utils.js       # Helper functions
├── pages/             # Halaman aplikasi
│   ├── HomePage.jsx
│   ├── FlightsPage.jsx
│   ├── BookingPage.jsx
│   ├── MyTicketsPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── AdminPage.jsx
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
\`\`\`

## Konfigurasi API

Edit file `src/lib/api.js` untuk mengatur URL API:

\`\`\`javascript
const API_BASE_URLS = [
  'https://your-api-url.com',
  'http://localhost:3001',
  'http://localhost:8000'
]
\`\`\`

## Mode Demo

Aplikasi akan otomatis menggunakan mode demo jika API tidak tersedia:
- Data mock untuk penerbangan dan pemesanan
- Sistem login demo
- Semua fitur tetap berfungsi

## Build untuk Production

\`\`\`bash
npm run build
\`\`\`

File hasil build akan ada di folder `dist/`.

## Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview build hasil
- `npm run lint` - Jalankan ESLint

## Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Tim Pengembang

- Samuel Steve Mulyono
- Muhammad Farhan Nugroho  
- Huraira Shenmue Mahanee

Institut Teknologi Sepuluh Nopember Surabaya

## Lisensi

Project ini dibuat untuk keperluan akademik.
