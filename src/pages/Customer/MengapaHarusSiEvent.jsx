import React from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaRegSmile, FaClock, FaLock } from "react-icons/fa";

const features = [
  {
    icon: <FaTicketAlt className="text-blue-500 text-3xl" />,
    title: "Banyak Pilihan Event",
    description: "Temukan berbagai event menarik, mulai dari konser musik, seminar, hingga workshop lokal.",
  },
  {
    icon: <FaRegSmile className="text-blue-500 text-3xl" />,
    title: "Mudah & Praktis",
    description: "Proses pembelian tiket cepat dan user-friendly, tanpa perlu antri panjang atau ribet.",
  },
  {
    icon: <FaClock className="text-blue-500 text-3xl" />,
    title: "Update Real-Time",
    description: "Dapatkan informasi event terbaru dan status tiket secara langsung dan akurat.",
  },
  {
    icon: <FaLock className="text-blue-500 text-3xl" />,
    title: "Pembayaran Aman",
    description: "Transaksi dilindungi sistem keamanan modern untuk kenyamanan Anda.",
  },
];

const MengapaHarusSiEvent = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white via-blue-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Mengapa Harus <span className="text-blue-500">SiEvent</span>?
        </h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          SiEvent hadir sebagai solusi modern untuk pembelian tiket acara yang mudah, cepat, dan aman. Berikut beberapa alasan kenapa kamu wajib menggunakan SiEvent!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition text-center"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/event">
            <button className="bg-[#00ADB5] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg active:scale-95 transition text-sm sm:text-base">
              Jelajahi Event Sekarang
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

export default MengapaHarusSiEvent;
