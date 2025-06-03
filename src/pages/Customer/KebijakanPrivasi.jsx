import React from "react";
import { Link } from "react-router-dom";
import { FaLock, FaDatabase, FaEnvelopeOpenText, FaUserSecret } from "react-icons/fa";

const kebijakanList = [
  {
    icon: <FaLock size={24} className="text-blue-500" />,
    title: "Keamanan Data",
    content:
      "Kami menjaga keamanan data pengguna dengan sistem enkripsi dan pembaruan rutin agar data tetap terlindungi dari akses tidak sah.",
  },
  {
    icon: <FaDatabase size={24} className="text-blue-500" />,
    title: "Penggunaan Informasi",
    content:
      "Informasi yang Anda berikan digunakan untuk proses transaksi, personalisasi layanan, serta peningkatan fitur SiEvent.",
  },
  {
    icon: <FaEnvelopeOpenText size={24} className="text-blue-500" />,
    title: "Email & Komunikasi",
    content:
      "Kami hanya mengirim email yang relevan terkait akun, pembelian, dan informasi event. Anda bisa berhenti berlangganan kapan saja.",
  },
  {
    icon: <FaUserSecret size={24} className="text-blue-500" />,
    title: "Kerja Sama Pihak Ketiga",
    content:
      "Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa izin, kecuali untuk keperluan layanan (seperti sistem pembayaran).",
  },
];

const KebijakanPrivasi = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-4">
          Kebijakan <span className="text-blue-500">Privasi</span>
        </h2>
        <p className="text-center text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-12">
          Kami menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami mengelola, melindungi, dan menggunakan data pribadi Anda saat menggunakan SiEvent.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {kebijakanList.map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/80 border border-blue-100 rounded-xl shadow hover:shadow-lg transition duration-200 p-6 flex gap-4 items-start"
            >
              <div className="mt-1">{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
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

export default KebijakanPrivasi;
