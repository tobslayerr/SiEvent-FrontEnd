import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

const HubungiKami = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full text-center bg-white/80 border border-blue-100 rounded-xl shadow p-8 backdrop-blur-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Hubungi <span className="text-blue-500">Kami</span>
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-8">
          Ada pertanyaan atau butuh bantuan terkait event dan pembelian tiket? Tim kami siap membantu Anda kapan saja melalui WhatsApp.
        </p>

        <a
          href="https://wa.me/6288212098241"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow active:scale-95 transition duration-200"
        >
          <FaWhatsapp size={20} />
          Hubungi via WhatsApp
        </a>

        <div className="mt-10">
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

export default HubungiKami;
