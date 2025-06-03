import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-20 py-20 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <FaExclamationTriangle className="text-yellow-500 text-6xl" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang kamu cari tidak tersedia. Yuk kembali ke halaman utama!
        </p>

        <Link to="/">
          <button className="bg-[#00ADB5] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg active:scale-95 transition text-sm sm:text-base">
            Kembali ke Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
