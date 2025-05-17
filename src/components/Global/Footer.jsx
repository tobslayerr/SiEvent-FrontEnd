import React from 'react';
import { FaFacebook, FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#222831] text-white w-full px-6 md:px-16 lg:px-46 py-12 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/30 pb-10 md:mr-16">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <a href="/">
            <h1 className="font-bold text-xl hover:text-gray-300 transition">SiEvent</h1>
          </a>
        </div>

        {/* Sosial + Navigasi */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex space-x-5 text-lg mb-5">
            <FaFacebook className="cursor-pointer hover:text-gray-400" />
            <FaXTwitter className="cursor-pointer hover:text-gray-400" />
            <FaLinkedin className="cursor-pointer hover:text-gray-400" />
            <FaInstagram className="cursor-pointer hover:text-gray-400" />
          </div>
          <ul className="flex flex-wrap justify-center md:flex-col md:items-start text-xs md:text-sm gap-2 md:gap-3 text-white/80">
            <li><a href="/">Syarat & Ketentuan</a></li>
            <li><a href="/">Apa itu SiEvent?</a></li>
            <li><a href="/">Kebijakan Privasi</a></li>
            <li><a href="/">Hubungi Kami</a></li>
          </ul>
        </div>

        {/* Email Form */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="font-semibold mb-3">Email Kami</h2>
          <p className="text-sm text-white/80 text-center md:text-left">Ingin mengirim email untuk hal tertentu? Silakan masukkan email!</p>
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-auto flex-grow border border-gray-500/30 bg-gray-200 text-gray-700 placeholder-gray-500 rounded px-3 h-9 text-sm outline-none"
            />
            <button className="bg-[#00ADB5] hover:bg-blue-600 transition text-white rounded px-4 h-9 text-sm w-full sm:w-24 active:scale-90 ">
              Kirim
            </button>
          </div>
        </div>
      </div>

      <p className="pt-6 text-center text-xs md:text-sm text-white/60">
        Copyright 2025 &copy; SIEvent, All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
