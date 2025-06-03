import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";
import AlertBox from "../../components/Global/AlertBox";
import Loading from "../../components/Global/Loading";

const EmailVerify = () => {
  const { backendUrl } = useContext(AppContent);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const sendOtp = async () => {
      try {
        setLoading(true);
        await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {}, { withCredentials: true });
        setAlert({ message: "Kode OTP telah dikirim ke email Anda.", type: "success" });
      } catch (err) {
        const msg = err.response?.data?.message || "Gagal mengirim OTP.";
        setAlert({ message: msg, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    sendOtp();
  }, [backendUrl]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setAlert({ message: "Lengkapi semua kolom OTP", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp: code }, { withCredentials: true });
      if (res.data.success) {
        setAlert({ message: "Email berhasil diverifikasi!", type: "success" });
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        setAlert({ message: res.data.message || "OTP salah", type: "error" });
      }
    } catch (err) {
      setAlert({ message: err.response?.data?.message || "Verifikasi gagal", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-200 via-white to-blue-20 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verifikasi Email</h2>

        {alert.message && (
          <div className="mb-4">
            <AlertBox
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ message: "", type: "" })}
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                maxLength={1}
                className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
              />
            ))}
          </div>
          <button
            onClick={handleVerify}
            className="w-full bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition active:scale-90"
          >
            Verifikasi Sekarang
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full text-gray-500 text-sm hover:text-blue-500 hover:underline mt-4"
          >
            ← Kembali ke Profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
