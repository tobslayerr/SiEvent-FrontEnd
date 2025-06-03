import React from "react";
import { Link } from "react-router-dom";
import { FaUserShield, FaTicketAlt, FaCalendarTimes, FaGlobe, FaSyncAlt } from "react-icons/fa";

const syaratList = [
  {
    title: "Akun Pengguna",
    content:
      "Anda bertanggung jawab atas keamanan akun Anda. Jangan membagikan informasi login kepada pihak lain. Semua aktivitas dalam akun adalah tanggung jawab Anda.",
    icon: <FaUserShield size={24} className="text-blue-500" />,
  },
  {
    title: "Pembelian Tiket",
    content:
      "Semua pembelian tiket bersifat final dan tidak dapat dibatalkan, kecuali dalam kondisi tertentu oleh penyelenggara. Pastikan membaca detail sebelum membeli.",
    icon: <FaTicketAlt size={24} className="text-blue-500" />,
  },
  {
    title: "Perubahan & Pembatalan Acara",
    content:
      "SiEvent tidak bertanggung jawab atas perubahan atau pembatalan acara. Kami akan menginformasikan secepat mungkin jika hal tersebut terjadi.",
    icon: <FaCalendarTimes size={24} className="text-blue-500" />,
  },
  {
    title: "Penggunaan Situs",
    content:
      "Dilarang menggunakan situs untuk tujuan ilegal atau merugikan pihak lain. Patuhilah hukum dan etika dalam penggunaan digital.",
    icon: <FaGlobe size={24} className="text-blue-500" />,
  },
  {
    title: "Perubahan Syarat",
    content:
      "Kami berhak mengubah syarat dan ketentuan kapan saja tanpa pemberitahuan. Harap cek halaman ini secara berkala.",
    icon: <FaSyncAlt size={24} className="text-blue-500" />,
  },
];

const SyaratKetentuan = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-4">
          Syarat & Ketentuan <span className="text-blue-500">SiEvent</span>
        </h2>
        <p className="text-center text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-12">
          Dengan menggunakan situs ini, Anda dianggap telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang berlaku.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {syaratList.map((item, index) => (
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

export default SyaratKetentuan;
