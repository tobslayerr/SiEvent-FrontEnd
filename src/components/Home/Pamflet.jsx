import React from "react";

const Pamflet = () => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg px-4 py-8 sm:px-6 md:px-8 mx-auto max-w-4xl shadow-2xl transition-all duration-500 hover:scale-105">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-wide animate-pulse">
          Khawatir ribet?
        </h2>
        <p
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text drop-shadow-lg transition-all duration-300 hover:drop-shadow-2xl"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          #BUATLEBIHMUDAH
        </p>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mt-3 tracking-wide">
          dengan SiEvent!
        </p>
      </div>
    </div>
  );
};

export default Pamflet;
