import React from 'react';
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#222831] text-white w-full px-6 md:px-16 lg:px-46 py-12">
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
            <a
              href="https://www.tiktok.com/@tobslayerr"
              target="_blank"
              rel="noopener noreferrer"
              className="transition transform hover:text-gray-400 active:scale-90"
            >
              <FaTiktok />
            </a>
            <a
              href="https://www.instagram.com/kevineltobing"
              target="_blank"
              rel="noopener noreferrer"
              className="transition transform hover:text-gray-400 active:scale-90"
            >
              <FaInstagram />
            </a>
          </div>
          <ul className="flex flex-wrap justify-center md:flex-col md:items-start text-xs md:text-sm gap-2 md:gap-3 text-white/80">
            <li><Link to="/syarat-ketentuan">Syarat & Ketentuan</Link></li>
            <li><Link to="/apa-sievent">Apa itu SiEvent?</Link></li>
            <li><Link to="/kebijakan-privasi">Kebijakan Privasi</Link></li>
            <li><Link to="/hubungi-kami">Hubungi Kami</Link></li>
          </ul>
        </div>

        {/* Kontak Kami */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="font-semibold mb-3">Kontak Kami</h2>
          <div className="text-sm text-white/80 space-y-2 text-center md:text-left">
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <FaMapMarkerAlt className="text-[#00ADB5]" /> Prototype - Indonesia
            </p>
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <FaEnvelope className="text-[#00ADB5]" /> support@sievent.com
            </p>
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <FaPhone className="text-[#00ADB5]" /> 0882-1209-8241
            </p>
          </div>
        </div>
      </div>

      <p className="pt-6 text-center text-xs md:text-sm text-white/60">
        Copyright 2025 &copy; SiEvent, All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
