import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTicketAlt, FaUsers } from "react-icons/fa";

const fitur = [
  {
    icon: <FaSearch size={28} className="text-blue-500" />,
    title: "Temukan Event Mudah",
    desc: "Cari event terdekat, gratis, atau sesuai minatmu hanya dalam beberapa klik.",
  },
  {
    icon: <FaTicketAlt size={28} className="text-blue-500" />,
    title: "Beli Tiket Aman",
    desc: "Pembayaran aman, tiket digital langsung masuk ke akunmu.",
  },
  {
    icon: <FaUsers size={28} className="text-blue-500" />,
    title: "Jadi SiCreator",
    desc: "Buat dan kelola event kamu sendiri, gratis dan tanpa ribet.",
  },
];

const ApaItuSiEvent = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6">
          Apa Itu <span className="text-blue-500">SiEvent</span>?
        </h2>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-12">
          <strong>SiEvent</strong> adalah platform modern untuk mencari, membeli, dan mengelola tiket acara secara online. Kami hadir untuk menghubungkan kamu dengan event menarik di sekitarmu—dari konser, seminar, hingga festival lokal.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fitur.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow border border-blue-100 hover:shadow-lg transition duration-200"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link to="/">
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-6 py-3 rounded-lg active:scale-95 transition-all duration-200 text-sm sm:text-base shadow">
             Kembali ke Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApaItuSiEvent;
