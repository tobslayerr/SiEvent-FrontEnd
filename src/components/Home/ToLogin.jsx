import React from "react";
import { useNavigate } from "react-router-dom";

const ToLogin = () => {
  const navigate = useNavigate();

  const isSignedIn = false;

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-t from-blue-200 via-white to-blue-20">
      <h2 className="text-xl sm:text-2xl font-bold text-center">
        Masuk untuk memudahkan booking
      </h2>
      <p className="text-sm sm:text-base text-gray-600 text-center mt-2">
        Silahkan Klik Tombol di bawah ini
      </p>

      <button
        onClick={() => navigate("/login")}
        className="mt-5 bg-[#00ADB5] text-white px-6 py-2 rounded-full text-sm sm:text-base font-medium transition duration-300 hover:bg-blue-400 active:scale-90"
      >
        Masuk
      </button>
    </div>
  );
};

export default ToLogin;
