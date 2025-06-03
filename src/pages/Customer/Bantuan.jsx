import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaClipboardCheck, FaCreditCard, FaSmile } from "react-icons/fa";

const steps = [
  {
    icon: <FaSearch className="text-blue-500 text-3xl" />,
    title: "1. Cari Event yang Kamu Suka",
    description: "Jelajahi beragam event dari berbagai kategori seperti musik, seminar, olahraga, dan lainnya dengan mudah di halaman utama atau fitur pencarian.",
  },
  {
    icon: <FaClipboardCheck className="text-blue-500 text-3xl" />,
    title: "2. Lihat Detail Event",
    description: "Klik event untuk melihat informasi lengkap seperti waktu, lokasi, deskripsi, harga tiket, dan jumlah tiket yang tersedia.",
  },
  {
    icon: <FaCreditCard className="text-blue-500 text-3xl" />,
    title: "3. Pesan Tiket",
    description: "Pilih jumlah tiket, masukkan informasi yang dibutuhkan, lalu lanjutkan ke proses pembayaran dengan metode yang kamu pilih.",
  },
  {
    icon: <FaSmile className="text-blue-500 text-3xl" />,
    title: "4. Nikmati Acara!",
    description: "Setelah pembayaran berhasil, e-tiket akan tersedia di akunmu. Tunjukkan saat check-in dan nikmati acara dengan nyaman!",
  },
];

const Bantuan = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Tips Menggunakan <span className="text-blue-500">SiEvent</span>
        </h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          Ikuti langkah-langkah berikut untuk pengalaman terbaik dalam membeli tiket di SiEvent. Semudah itu!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-center"
            >
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/event">
            <button className="bg-[#00ADB5] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg active:scale-95 transition text-sm sm:text-base">
              Cari Event Sekarang
            </button>
          </Link>
          <Link to="/">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg active:scale-95 transition text-sm sm:text-base">
              Kembali ke Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Bantuan;
